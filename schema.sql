-- 1. Profiles Table (Public User Data)
create table public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  username text unique,
  avatar_url text,
  bio text,
  is_streamer boolean default false,

  constraint username_length check (char_length(username) >= 3)
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- 2. Trigger to create Profile on Signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Streams Table
create table public.streams (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  category text,
  status text check (status in ('live', 'offline')) default 'offline',
  viewer_count integer default 0,
  thumbnail_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.streams enable row level security;

create policy "Streams are viewable by everyone." on public.streams
  for select using (true);

create policy "Streamers can update their own streams." on public.streams
  for all using (auth.uid() = user_id);

-- 4. Chat Messages Table
create table public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  stream_id uuid references public.streams(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.chat_messages enable row level security;

create policy "Chat messages are viewable by everyone." on public.chat_messages
  for select using (true);

create policy "Authenticated users can post messages." on public.chat_messages
  for insert with check (auth.role() = 'authenticated');
