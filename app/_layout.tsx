import { useColorScheme } from '@/hooks/use-color-scheme';
import { ClerkLoaded, ClerkProvider, useUser } from '@clerk/clerk-expo';
import { registerGlobals } from '@livekit/react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import { api } from '../lib/api';
import { getRandomAvatarId } from '../lib/avatars';
import { tokenCache } from '../lib/tokenCache';

if (Platform.OS !== 'web') {
  registerGlobals();
}

export const unstable_settings = {
  anchor: '(tabs)',
};

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  );
}

// Component to handle user sync with backend
function UserSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      console.log('Attempting to sync user to:', api.getApiUrl ? api.getApiUrl() : 'Unknown URL');
      // Sync user to backend
      const syncUser = async () => {
        try {
          console.log('Fetching user from backend...');
          // 1. Check if user exists to preserve avatar if customized
          const existingUser = await api.getUser(user.id);
          console.log('Existing user check result:', existingUser ? 'Found' : 'Not Found');

          let avatarUrlToUse = existingUser?.avatarUrl;

          // 2. If no existing avatar (new user) or explicit override needed
          if (!avatarUrlToUse) {
            avatarUrlToUse = getRandomAvatarId();
          }

          console.log('Creating/Updating user with avatar:', avatarUrlToUse);
          await api.createUser({
            id: user.id,
            username: user.username || user.firstName || 'user',
            email: user.primaryEmailAddress?.emailAddress || '',
            avatarUrl: avatarUrlToUse,
            bio: existingUser?.bio, // Preserve bio
          });
          console.log('User synced to backend successfully');
        } catch (error) {
          console.error('Failed to sync user:', error);
        }
      };
      syncUser();
    }
  }, [isLoaded, user]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY}>
      <UserSync />
      <ClerkLoaded>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="stream/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="stream-setup" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="messages" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="chat" options={{ headerShown: false }} />
            {/* 'stream' folder routes are handled by stream/[id] or similar.
                If you have an index.tsx in stream/, uncomment next line.
                Otherwise, avoid "No route named stream" warning.
             */}
            {/* <Stack.Screen name="stream" options={{ headerShown: false }} /> */}
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
