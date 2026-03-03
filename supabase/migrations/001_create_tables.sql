-- Drop existing policies and tables (for clean re-creation)
DROP POLICY IF EXISTS "Allow public insert to search_logs" ON search_logs;
DROP POLICY IF EXISTS "Allow public select from search_logs" ON search_logs;
DROP POLICY IF EXISTS "Allow public insert to conversations" ON conversations;
DROP POLICY IF EXISTS "Allow public select from conversations" ON conversations;
DROP POLICY IF EXISTS "Allow public insert to messages" ON messages;
DROP POLICY IF EXISTS "Allow public select from messages" ON messages;

DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS search_logs CASCADE;

-- Create search_logs table
CREATE TABLE search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  query TEXT NOT NULL,
  results_count INTEGER DEFAULT 0
);

-- Create conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT,
  user_id UUID
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public insert to search_logs" ON search_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select from search_logs" ON search_logs FOR SELECT USING (true);

CREATE POLICY "Allow public insert to conversations" ON conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select from conversations" ON conversations FOR SELECT USING (true);

CREATE POLICY "Allow public insert to messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select from messages" ON messages FOR SELECT USING (true);
