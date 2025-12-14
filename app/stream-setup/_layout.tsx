
import { Stack } from 'expo-router';

export default function StreamSetupLayout() {
    return (
        <Stack>
            <Stack.Screen name="pick-category" options={{ headerShown: false }} />
            <Stack.Screen name="setup" options={{ headerShown: false }} />
        </Stack>
    );
}
