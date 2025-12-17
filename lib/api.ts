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
    isVerified?: boolean;
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

    searchUsers: async (query: string): Promise<User[]> => {
        if (!query || query.length < 2) return [];
        console.log('API searching for:', query);
        console.log('API URL:', API_URL);
        try {
            const response = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
                const text = await response.text();
                console.error('API Error:', response.status, text);
                throw new Error('Failed to search users');
            }
            const data = await response.json();
            console.log('API Data:', data);
            return data;
        } catch (error) {
            console.error('API Network Error:', error);
            throw error;
        }
    },

    // Stream endpoints
    createStream: async (stream: Partial<Stream> & { livekitRoomName?: string }) => {
        console.log('Creating stream with data:', stream);
        console.log('API URL:', `${API_URL}/streams`);
        
        const res = await fetch(`${API_URL}/streams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(stream),
        });
        
        console.log('Stream creation response status:', res.status);
        
        if (!res.ok) {
            const text = await res.text();
            console.log('Stream creation error response:', text);
            let errorMessage = 'Failed to create stream';
            try {
                const error = JSON.parse(text);
                errorMessage = error.error || errorMessage;
            } catch {
                errorMessage = text || errorMessage;
            }
            throw new Error(`${errorMessage} (Status: ${res.status})`);
        }
        
        const result = await res.json();
        console.log('Stream creation success:', result);
        return result;
    },

    getLivekitToken: async (userId: string, username: string, roomName: string, isPublisher: boolean = false): Promise<{ token: string; roomName: string }> => {
        const res = await fetch(`${API_URL}/streams/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, username, roomName, isPublisher }),
        });
        return res.json();
    },

    // Follow endpoints
    followUser: async (followerId: string, followingId: string) => {
        const res = await fetch(`${API_URL}/follows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followerId, followingId }),
        });
        return res.json();
    },

    unfollowUser: async (followerId: string, followingId: string) => {
        const res = await fetch(`${API_URL}/follows`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followerId, followingId }),
        });
        return res.json();
    },

    checkFollowStatus: async (followerId: string, followingId: string): Promise<{ isFollowing: boolean }> => {
        const res = await fetch(`${API_URL}/follows/${followerId}/${followingId}`);
        return res.json();
    },

    getUserStats: async (userId: string): Promise<{ followers: number; following: number }> => {
        const res = await fetch(`${API_URL}/users/${userId}/stats`);
        return res.json();
    },

    getApiUrl: () => API_URL
};
