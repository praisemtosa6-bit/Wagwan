
import { boolean, integer, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: text('id').primaryKey(), // Matches Clerk User ID
    username: text('username').unique().notNull(),
    email: text('email').notNull(),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),
    isStreamer: boolean('is_streamer').default(false),
    isVerified: boolean('is_verified').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});

export const streams = pgTable('streams', {
    id: serial('id').primaryKey(),
    userId: text('user_id').references(() => users.id).notNull(),
    title: text('title').notNull(),
    category: text('category'),
    status: text('status', { enum: ['live', 'offline'] }).default('offline'),
    viewerCount: integer('viewer_count').default(0),
    thumbnailUrl: text('thumbnail_url'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const chatMessages = pgTable('chat_messages', {
    id: serial('id').primaryKey(),
    streamId: integer('stream_id').references(() => streams.id).notNull(),
    userId: text('user_id').references(() => users.id).notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const follows = pgTable('follows', {
    followerId: text('follower_id').references(() => users.id).notNull(),
    followingId: text('following_id').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
    pk: primaryKey({ columns: [t.followerId, t.followingId] }),
}));

export const subscriptions = pgTable('subscriptions', {
    id: serial('id').primaryKey(),
    subscriberId: text('subscriber_id').references(() => users.id).notNull(),
    streamerId: text('streamer_id').references(() => users.id).notNull(),
    status: text('status', { enum: ['active', 'expired'] }).default('active'),
    createdAt: timestamp('created_at').defaultNow(),
});
