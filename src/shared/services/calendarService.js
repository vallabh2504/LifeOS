const GOOGLE_CLIENT_ID = '24879269382-f0g5cfgb9g4skf4d31pse0i80isfmsqc.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

let gapiInited = false;
let gisInited = false;
let tokenClient;

export const calendarService = {
  
  loadGapi: () => {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.body.appendChild(script);
    });
  },

  loadGis: () => {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.body.appendChild(script);
    });
  },

  async initClient() {
    await Promise.all([this.loadGapi(), this.loadGis()]);
    
    return new Promise((resolve, reject) => {
      window.gapi.load('client', async () => {
        try {
          await window.gapi.client.init({
            clientId: GOOGLE_CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
          });
          gapiInited = true;
          
          tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: SCOPES,
            callback: '', // defined at request time
          });
          gisInited = true;
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  },

  async signIn() {
    if (!tokenClient) await this.initClient();
    return new Promise((resolve, reject) => {
      tokenClient.callback = async (resp) => {
        if (resp.error) {
          reject(resp);
        }
        resolve(resp);
      };
      if (window.gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        tokenClient.requestAccessToken({ prompt: '' });
      }
    });
  },

  async signOut() {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
    }
  },

  async listEvents(timeMin = (new Date()).toISOString(), maxResults = 10) {
    if (!gapiInited) await this.initClient();
    try {
      const response = await window.gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': timeMin,
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': maxResults,
        'orderBy': 'startTime'
      });
      return response.result.items;
    } catch (err) {
      console.error("Error listing events", err);
      throw err;
    }
  },

  async createEvent(event) {
    if (!gapiInited) await this.initClient();
    // Event structure: { summary, location, description, start: { dateTime, timeZone }, end: { dateTime, timeZone } }
    try {
      const response = await window.gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
      });
      return response.result;
    } catch (err) {
       console.error("Error creating event", err);
       throw err;
    }
  },

  async updateEvent(eventId, event) {
    if (!gapiInited) await this.initClient();
    try {
      const response = await window.gapi.client.calendar.events.update({
        'calendarId': 'primary',
        'eventId': eventId,
        'resource': event
      });
      return response.result;
    } catch (err) {
      console.error("Error updating event", err);
      throw err;
    }
  },

  async deleteEvent(eventId) {
    if (!gapiInited) await this.initClient();
    try {
      await window.gapi.client.calendar.events.delete({
        'calendarId': 'primary',
        'eventId': eventId
      });
      return true;
    } catch (err) {
      console.error("Error deleting event", err);
      throw err;
    }
  }
};
