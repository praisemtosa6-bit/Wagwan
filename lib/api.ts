import { Platform } from 'react-native';

const LOCALHOST = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://127.0.0.1:3000';
export const API_URL = process.env.EXPO_PUBLIC_API_URL || LOCALHOST;

export interface User {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string | null;
    bio?: string | null;
    isStreamer: boolean;
    createdAt: string;
}

export interface Stream {
    id: number;
    userId: string;
    title: string;
    category?: string | null;
    status: 'live' | 'offline';
    viewerCount: number;
    thumbnailUrl?: string | null;
    createdAt: string;
}

export const api = {
    // User endpoints
    getUsers: async (): Promise<User[]> => {
        const res = await fetch(`${API_URL}/users`);
        return res.json();
    },

    createUser: async (user: Partial<User>) => {
        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        return res.json();
    },

    getUser: async (id: string): Promise<User | null> => {
        try {
            const res = await fetch(`${API_URL}/users/${id}`);
            if (!res.ok) return null;
            return res.json();
        } catch (e) {
            return null;
        }
    },

    // Stream endpoints (placeholder)
    createStream: async (stream: Partial<Stream>) => {
        // Implement later
    },
    getApiUrl: () => API_URL
};
