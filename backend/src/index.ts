import 'dotenv/config';
import { eq, ilike } from 'drizzle-orm';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { db } from './db';
import { streams, users } from './schema';

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

// List users (useful for debugging/admin)
app.get('/users', async (c) => {
    try {
        const results = await db.select().from(users).limit(50);
        return c.json(results);
    } catch (error) {
        console.error('Error listing users:', error);
        return c.json({ error: 'Failed to list users' }, 500);
    }
});

// Search users (must be registered before /users/:id)
app.get('/users/search', async (c) => {
    const query = c.req.query('q');

    if (!query || query.length < 2) {
        return c.json([]);
    }

    try {
        const results = await db
            .select()
            .from(users)
            .where(ilike(users.username, `%${query}%`))
            .limit(10);

        return c.json(results);
    } catch (error) {
        console.error('Error searching users:', error);
        return c.json({ error: 'Failed to search users' }, 500);
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

app.get('/users/:id/stats', async (c) => {
    const userId = c.req.param('id');

    try {
        const { follows } = await import('./schema');
        const { sql } = await import('drizzle-orm');

        // Count followers (people following this user)
        const followersResult = await db.select({ count: sql<number>`count(*)` })
            .from(follows)
            .where(eq(follows.followingId, userId));

        // Count following (people this user follows)
        const followingResult = await db.select({ count: sql<number>`count(*)` })
            .from(follows)
            .where(eq(follows.followerId, userId));

        return c.json({
            followers: Number(followersResult[0]?.count || 0),
            following: Number(followingResult[0]?.count || 0),
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return c.json({ error: 'Failed to fetch user stats' }, 500);
    }
});

// Create Stream
app.post('/streams', async (c) => {
    try {
        const body = await c.req.json();
        console.log('Received stream creation request:', body);
        
        const { userId, title, category, status, livekitRoomName } = body;

        if (!userId || !title) {
            console.log('Missing required fields - userId:', userId, 'title:', title);
            return c.json({ error: 'Missing required fields: userId and title are required' }, 400);
        }

        console.log('Inserting stream with values:', {
            userId,
            title,
            category: category || null,
            status: (status as 'live' | 'offline') || 'live',
            livekitRoomName: livekitRoomName || null,
            viewerCount: 0,
        });

        const result = await db.insert(streams).values({
            userId,
            title,
            category: category || null,
            status: (status as 'live' | 'offline') || 'live',
            livekitRoomName: livekitRoomName || null,
            viewerCount: 0,
        }).returning();

        console.log('Stream created successfully:', result[0]);
        return c.json(result[0]);
    } catch (error: any) {
        console.error('Error creating stream:', error);
        console.error('Error details:', error?.message, error?.stack);
        return c.json({ 
            error: 'Failed to create stream', 
            details: error?.message || String(error) 
        }, 500);
    }
});

// LiveKit token generation
import { AccessToken } from 'livekit-server-sdk';

app.post('/streams/token', async (c) => {
    const { userId, username, roomName, isPublisher } = await c.req.json();

    if (!userId || !username || !roomName) {
        return c.json({ error: 'Missing required fields' }, 400);
    }

    try {
        const at = new AccessToken(
            process.env.LIVEKIT_API_KEY,
            process.env.LIVEKIT_API_SECRET,
            { identity: userId, name: username }
        );

        at.addGrant({
            room: roomName,
            roomJoin: true,
            canPublish: isPublisher || false,
            canSubscribe: true,
        });

        const token = await at.toJwt();

        return c.json({ token, roomName });
    } catch (error) {
        console.error('Error generating LiveKit token:', error);
        return c.json({ error: 'Failed to generate token' }, 500);
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
