-- Add livekit_room_name column to streams table
ALTER TABLE streams ADD COLUMN IF NOT EXISTS livekit_room_name TEXT;

