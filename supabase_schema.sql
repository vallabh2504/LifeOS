-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Function to update updated_at timestamp
create or replace function update_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 1. USERS (Extends auth.users)
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  settings jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.users enable row level security;

create policy "Users can view their own profile" on public.users
  for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

create trigger update_users_timestamp before update on public.users
  for each row execute procedure update_timestamp();

-- 2. CATEGORIES (Organizational buckets)
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  color text,
  icon text,
  type text check (type in ('project', 'finance', 'note', 'task', 'habit')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.categories enable row level security;

create policy "Users can CRUD their own categories" on public.categories
  for all using (auth.uid() = user_id);

create trigger update_categories_timestamp before update on public.categories
  for each row execute procedure update_timestamp();

-- 3. PROJECTS
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  category_id uuid references public.categories,
  title text not null,
  description text,
  status text default 'active' check (status in ('active', 'completed', 'archived', 'on_hold')),
  due_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.projects enable row level security;

create policy "Users can CRUD their own projects" on public.projects
  for all using (auth.uid() = user_id);

create trigger update_projects_timestamp before update on public.projects
  for each row execute procedure update_timestamp();

-- 4. NOTES
create table public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  project_id uuid references public.projects,
  category_id uuid references public.categories,
  title text not null,
  content text,
  is_pinned boolean default false,
  is_archived boolean default false,
  tags text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.notes enable row level security;

create policy "Users can CRUD their own notes" on public.notes
  for all using (auth.uid() = user_id);

create trigger update_notes_timestamp before update on public.notes
  for each row execute procedure update_timestamp();

-- 5. TASKS
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  project_id uuid references public.projects,
  category_id uuid references public.categories,
  parent_task_id uuid references public.tasks,
  title text not null,
  description text,
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.tasks enable row level security;

create policy "Users can CRUD their own tasks" on public.tasks
  for all using (auth.uid() = user_id);

create trigger update_tasks_timestamp before update on public.tasks
  for each row execute procedure update_timestamp();

-- 6. HABITS
create table public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  category_id uuid references public.categories,
  title text not null,
  description text,
  frequency jsonb, -- e.g., {"type": "daily", "days": ["Mon", "Wed"]}
  target_count integer default 1,
  current_streak integer default 0,
  longest_streak integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.habits enable row level security;

create policy "Users can CRUD their own habits" on public.habits
  for all using (auth.uid() = user_id);

create trigger update_habits_timestamp before update on public.habits
  for each row execute procedure update_timestamp();

-- 7. HABIT LOGS
create table public.habit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  habit_id uuid references public.habits on delete cascade,
  completed_date date default current_date,
  count integer default 1,
  notes text,
  created_at timestamptz default now()
);
alter table public.habit_logs enable row level security;

create policy "Users can CRUD their own habit logs" on public.habit_logs
  for all using (auth.uid() = user_id);

-- Function to calculate streak
create or replace function calculate_streak(p_habit_id uuid)
returns integer as $$
declare
  streak integer := 0;
  last_date date;
  check_date date;
  r record;
begin
  -- Get the most recent completion date
  select max(completed_date) into last_date
  from habit_logs
  where habit_id = p_habit_id;

  if last_date is null then
    return 0;
  end if;

  -- If the last completion was before yesterday, streak is broken (unless frequency logic is complex, assuming daily here for simplicity)
  if last_date < current_date - 1 then
     -- Allow for complex logic here later, but for basic daily:
     -- return 0;
  end if;
  
  -- Count consecutive days backwards
  check_date := last_date;
  loop
    if exists (select 1 from habit_logs where habit_id = p_habit_id and completed_date = check_date) then
      streak := streak + 1;
      check_date := check_date - 1;
    else
      exit;
    end if;
  end loop;

  return streak;
end;
$$ language plpgsql security definer;

-- Trigger to update habit streak on log insert
create or replace function update_habit_streak_trigger()
returns trigger as $$
begin
  update public.habits
  set current_streak = calculate_streak(new.habit_id),
      updated_at = now()
  where id = new.habit_id;
  
  -- Update longest streak if current is higher
  update public.habits
  set longest_streak = greatest(longest_streak, current_streak)
  where id = new.habit_id;
  
  return new;
end;
$$ language plpgsql;

create trigger on_habit_log_insert after insert on public.habit_logs
  for each row execute procedure update_habit_streak_trigger();

-- 8. EXPENSES
create table public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  category_id uuid references public.categories,
  amount numeric(10, 2) not null,
  currency text default 'USD',
  description text,
  date date default current_date,
  receipt_url text,
  is_recurring boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.expenses enable row level security;

create policy "Users can CRUD their own expenses" on public.expenses
  for all using (auth.uid() = user_id);

create trigger update_expenses_timestamp before update on public.expenses
  for each row execute procedure update_timestamp();

-- 9. BUDGETS
create table public.budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  category_id uuid references public.categories,
  amount_limit numeric(10, 2) not null,
  period text default 'monthly' check (period in ('weekly', 'monthly', 'yearly')),
  start_date date not null,
  end_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.budgets enable row level security;

create policy "Users can CRUD their own budgets" on public.budgets
  for all using (auth.uid() = user_id);

create trigger update_budgets_timestamp before update on public.budgets
  for each row execute procedure update_timestamp();

-- 10. JOURNAL ENTRIES
create table public.journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text,
  content text,
  mood text,
  tags text[],
  entry_date date default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.journal_entries enable row level security;

create policy "Users can CRUD their own journal entries" on public.journal_entries
  for all using (auth.uid() = user_id);

create trigger update_journal_timestamp before update on public.journal_entries
  for each row execute procedure update_timestamp();

-- 11. DEVELOPMENT DECK - 3-Level Hierarchy (Deck → Category → Project)

-- Development Categories (Level 2)
create table public.dev_categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  color text default '#6366f1',
  icon text,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.dev_categories enable row level security;

create policy "Users can CRUD their own dev categories" on public.dev_categories
  for all using (auth.uid() = user_id);

-- Development Projects (Level 3)
create table public.dev_projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  category_id uuid references public.dev_categories on delete cascade,
  name text not null,
  description text,
  status text default 'active' check (status in ('active', 'completed', 'archived', 'on_hold')),
  due_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.dev_projects enable row level security;

create policy "Users can CRUD their own dev projects" on public.dev_projects
  for all using (auth.uid() = user_id);

-- Development Tasks - Kanban items (linked to projects)
create table public.dev_tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  project_id uuid references public.dev_projects on delete cascade,
  category_id uuid references public.dev_categories,
  title text not null,
  description text,
  status text default 'todo' check (status in ('todo', 'doing', 'done')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  due_date timestamptz,
  order_index integer default 0,
  gcal_event_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.dev_tasks enable row level security;

create policy "Users can CRUD their own dev tasks" on public.dev_tasks
  for all using (auth.uid() = user_id);

-- Development Notes (Rich text notes for projects)
create table public.dev_notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  project_id uuid references public.dev_projects on delete cascade,
  category_id uuid references public.dev_categories,
  title text not null,
  content text,
  is_pinned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.dev_notes enable row level security;

create policy "Users can CRUD their own dev notes" on public.dev_notes
  for all using (auth.uid() = user_id);

-- Development Doubts (Questions/Issues to resolve)
create table public.dev_doubts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  project_id uuid references public.dev_projects on delete cascade,
  category_id uuid references public.dev_categories,
  question text not null,
  resolved boolean default false,
  resolved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.dev_doubts enable row level security;

create policy "Users can CRUD their own dev doubts" on public.dev_doubts
  for all using (auth.uid() = user_id);
