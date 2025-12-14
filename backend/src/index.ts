
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

// Follow a user
app.post('/follows', async (c) => {
    const { followerId, followingId } = await c.req.json();

    if (!followerId || !followingId) {
        return c.json({ error: 'Missing required fields' }, 400);
    }

    if (followerId === followingId) {
        return c.json({ error: 'Cannot follow yourself' }, 400);
    }

    try {
        const { follows } = await import('./schema');
        const { and } = await import('drizzle-orm');

        await db.insert(follows).values({
            followerId,
            followingId,
        });

        return c.json({ success: true });
    } catch (error) {
        console.error('Error following user:', error);
        return c.json({ error: 'Failed to follow user' }, 500);
    }
});

// Unfollow a user
app.delete('/follows', async (c) => {
    const { followerId, followingId } = await c.req.json();

    if (!followerId || !followingId) {
        return c.json({ error: 'Missing required fields' }, 400);
    }

    try {
        const { follows } = await import('./schema');
        const { and } = await import('drizzle-orm');

        await db.delete(follows).where(
            and(
                eq(follows.followerId, followerId),
                eq(follows.followingId, followingId)
            )
        );

        return c.json({ success: true });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        return c.json({ error: 'Failed to unfollow user' }, 500);
    }
});

// Check if user is following another user
app.get('/follows/:followerId/:followingId', async (c) => {
    const followerId = c.req.param('followerId');
    const followingId = c.req.param('followingId');

    try {
        const { follows } = await import('./schema');
        const { and } = await import('drizzle-orm');

        const result = await db.select().from(follows).where(
            and(
                eq(follows.followerId, followerId),
                eq(follows.followingId, followingId)
            )
        ).limit(1);

        return c.json({ isFollowing: result.length > 0 });
    } catch (error) {
        console.error('Error checking follow status:', error);
        return c.json({ error: 'Failed to check follow status' }, 500);
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
