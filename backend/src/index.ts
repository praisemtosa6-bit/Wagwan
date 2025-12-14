
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { db } from './db';
import { users } from './schema';

const app = new Hono();

app.use('/*', cors());

app.get('/', (c) => {
    return c.text('Wagwan API is running!');
});

// Create or Sync User
app.post('/users', async (c) => {
    const { id, username, email, avatarUrl, bio } = await c.req.json();

    if (!id || !username || !email) {
        return c.json({ error: 'Missing required fields' }, 400);
    }

    try {
        const result = await db.insert(users).values({
            id,
            username,
            email,
            avatarUrl,
            bio,
        }).onConflictDoUpdate({
            target: users.id,
            set: {
                username,
                email,
                avatarUrl,
                bio,
            },
        }).returning();

        return c.json(result[0]);
    } catch (error) {
        console.error('Error syncing user:', error);
        return c.json({ error: 'Failed to sync user' }, 500);
    }
});

// Get User by ID
app.get('/users/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
        if (user.length === 0) {
            return c.json({ error: 'User not found' }, 404);
        }
        return c.json(user[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        return c.json({ error: 'Failed to fetch user' }, 500);
    }
});


export default app;

import { serve } from '@hono/node-server';

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port,
    hostname: '0.0.0.0'
});
