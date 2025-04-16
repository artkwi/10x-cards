-- Migration: Initial Schema Setup
-- Description: Creates the initial database schema for 10x-cards application
-- Tables: flashcards, generations, generation_error_logs
-- Author: AI Assistant
-- Date: 2024-03-20

-- Create unaccent extension if not exists (required for Polish language support)
create extension if not exists unaccent;

-- Create Polish language configuration
create text search configuration polish (copy = simple);
alter text search configuration polish
    alter mapping for word, asciiword, asciihword, hword, hword_asciipart, hword_part
    with unaccent, simple;

-- Create generations table first (since it's referenced by flashcards)
create table generations (
    id bigserial primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    model text not null,
    generated_count integer not null,
    accepted_unedited_count integer,
    accepted_edited_count integer,
    source_text_hash text not null,
    source_text_length integer not null,
    generation_duration integer not null,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp
);

-- Create flashcards table with proper reference to generations
create table flashcards (
    id bigserial primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    generation_id bigint references generations(id) on delete cascade,
    front varchar(200) not null,
    back varchar(500) not null,
    source varchar not null check (source in ('ai-full', 'ai-edited', 'manual')),
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp
);

-- Create generation_error_logs table
create table generation_error_logs (
    id bigserial primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    model text not null,
    source_text_hash text not null,
    source_text_length integer not null,
    error_code text not null,
    error_message text,
    created_at timestamptz not null default current_timestamp
);

-- Create full-text search indexes
create index idx_flashcards_front_fts on flashcards using gin (to_tsvector('polish', front));
create index idx_flashcards_back_fts on flashcards using gin (to_tsvector('polish', back));

-- Create indexes for user_id columns
create index idx_flashcards_user_id on flashcards(user_id);
create index idx_generations_user_id on generations(user_id);
create index idx_generation_error_logs_user_id on generation_error_logs(user_id);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = current_timestamp;
    return new;
end;
$$ language plpgsql;

-- Create trigger for flashcards
create trigger update_flashcards_updated_at
    before update on flashcards
    for each row
    execute function update_updated_at_column();

-- Create trigger for generations
create trigger update_generations_updated_at
    before update on generations
    for each row
    execute function update_updated_at_column();

-- Enable Row Level Security
alter table flashcards enable row level security;
alter table generations enable row level security;
alter table generation_error_logs enable row level security;

-- Create RLS Policies for flashcards
create policy "Users can view their own flashcards"
    on flashcards for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert their own flashcards"
    on flashcards for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own flashcards"
    on flashcards for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own flashcards"
    on flashcards for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create RLS Policies for generations
create policy "Users can view their own generations"
    on generations for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert their own generations"
    on generations for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own generations"
    on generations for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own generations"
    on generations for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create RLS Policies for generation_error_logs
create policy "Users can view their own error logs"
    on generation_error_logs for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert their own error logs"
    on generation_error_logs for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can delete their own error logs"
    on generation_error_logs for delete
    to authenticated
    using (auth.uid() = user_id); 