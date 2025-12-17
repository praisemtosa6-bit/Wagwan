import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function addLivekitColumn() {
    try {
        console.log('Adding livekit_room_name column to streams table...');
        await sql`ALTER TABLE streams ADD COLUMN IF NOT EXISTS livekit_room_name TEXT;`;
        console.log('✅ Successfully added livekit_room_name column');
    } catch (error) {
        console.error('❌ Error adding column:', error);
        process.exit(1);
    }
}

addLivekitColumn();

