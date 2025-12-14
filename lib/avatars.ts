export const AVATARS: Record<string, any> = {
    'asset:pfp': require('../assets/images/pfp/pfp.png'),
    'asset:pfp1': require('../assets/images/pfp/pfp1.png'),
    'asset:pfp2': require('../assets/images/pfp/pfp2.png'),
    'asset:pfp3': require('../assets/images/pfp/pfp3.png'),
    'asset:pfp4': require('../assets/images/pfp/pfp4.jpg'),
};

export const AVAILABLE_AVATAR_IDS = Object.keys(AVATARS);

export function getRandomAvatarId(): string {
    const randomIndex = Math.floor(Math.random() * AVAILABLE_AVATAR_IDS.length);
    return AVAILABLE_AVATAR_IDS[randomIndex];
}

export function resolveAvatar(url?: string | null): any {
    if (!url) {
        // Fallback if null
        return AVATARS['asset:pfp'];
    }
    // Check if it's a remote URL (Clerk, etc.)
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return { uri: url };
    }
    // Check if it's a local asset
    if (url.startsWith('asset:')) {
        return AVATARS[url] || AVATARS['asset:pfp'];
    }
    // Default fallback
    return { uri: url };
}
