# Supabase migrations for PlumbBud chat history

This folder contains the SQL migration used to create the chat history schema for PlumbBud.

## What was created

- `public.chats`: stores one chat per user, with an id, user_id, title, and created_at.
- `public.messages`: stores messages for a chat, with an id, chat_id, role, content, and created_at.
- Row Level Security (RLS) is enabled on both tables.
- Policies ensure that users can only access chats and messages that belong to their own account.

## Apply the migration

Run this migration in the Supabase SQL editor for your project:

```sql
-- see the file in supabase/migrations/20260717120000_create_chat_history_tables.sql
```
