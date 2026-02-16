# LifeOS

LifeOS is a modular dashboard built with React, Vite, Tailwind CSS, and Supabase.

## LEGO Constraints & Architecture

This project follows the **LEGO Architecture** principle:
- **Modular Decks**: Each feature (Personal, Journal, Habits, Finance, Development) is a self-contained "Deck" inside `src/decks/`.
- **Shared Core**: Shared logic, themes, and services reside in `src/shared/`.
- **Atomic Components**: UI components should be reusable and theme-aware.
- **Theme Consistency**: All styles must adhere to the 4 defined theme colors:
    - `primary`: #1E1E1E (Midnight Black)
    - `secondary`: #2D2D2D (Onyx)
    - `accent`: #00E5FF (Electric Cyan)
    - `muted`: #B0B0B0 (Slate Gray)

## Project Structure

- `src/shared/`: Contexts and API services.
- `src/decks/`: Feature-specific modules.
- `src/assets/`: Static assets.

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Database/Auth**: Supabase
- **Icons**: Lucide React
