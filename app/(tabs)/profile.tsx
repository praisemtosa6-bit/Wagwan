
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../lib/api';
import { resolveAvatar } from '../../lib/avatars';

const { width } = Dimensions.get('window');

const TABS = ['Home', 'About', 'Clips', 'Videos', 'Schedule'];

export default function ProfileScreen() {
    const router = useRouter();
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState('Home');
    const [isFollowing, setIsFollowing] = useState(false);

    // ...
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [followerStats, setFollowerStats] = useState({ followers: 0, following: 0 });

    useEffect(() => {
        const fetchUser = async () => {
            if (user) {
                const dbUser = await api.getUser(user.id);
                if (dbUser) {
                    setBio(dbUser.bio || '');
                    setAvatarUrl(dbUser.avatarUrl || user.imageUrl);
                }

                // Fetch follower stats
                const stats = await api.getUserStats(user.id);
                setFollowerStats(stats);
            }
        };
        fetchUser();
    }, [user]);

    // ...

    const renderStat = (label: string, value: string) => (
        <View style={styles.statItem}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[2]} // Make the tab bar sticky
            >
                {/* 1. Cover Image Area */}
                <View style={styles.coverContainer}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/800x400' }} // Replace with actual cover
                        style={styles.coverImage}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['transparent', '#050505']}
                        style={styles.coverGradient}
                    />

                    {/* Header Actions (Settings/Edit) */}
                    <SafeAreaView style={styles.headerActions} edges={['top']}>
                        <Link href="/settings" asChild>
                            <TouchableOpacity style={styles.iconButton}>
                                <Ionicons name="settings-outline" size={20} color="white" />
                            </TouchableOpacity>
                        </Link>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="share-social-outline" size={20} color="white" />
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>

                {/* 2. Profile Info Section */}
                <View style={styles.profileInfoContainer}>
                    <SignedIn>
                        <View style={styles.avatarRow}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={resolveAvatar(avatarUrl || user?.imageUrl)}
                                    style={styles.avatar}
                                />
                                <View style={styles.verifiedBadge}>
                                    <Ionicons name="checkmark" size={12} color="#050505" />
                                </View>
                            </View>

                            <View style={styles.nameSection}>
                                <Text style={styles.username}>{user?.username || user?.fullName || 'Streamer'}</Text>
                                <Text style={styles.bio}>
                                    {bio || 'Casual gamer 🎮 | streaming everyday 8PM EST | Business: email@wagwan.com'}
                                </Text>
                            </View>
                        </View>
                    </SignedIn>

                    <SignedOut>
                        <View style={styles.guestContainer}>
                            <Ionicons name="person-circle-outline" size={80} color="#333" />
                            <Text style={styles.guestTitle}>Welcome, Guest!</Text>
                            <Text style={styles.guestSubtitle}>Sign in to customize your profile, follow channels, and chat.</Text>
                            <TouchableOpacity style={styles.authButton} onPress={() => router.push('/auth/login')}>
                                <Text style={styles.authButtonText}>Log In / Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </SignedOut>

                    <SignedIn>
                        {/* Stats Row */}
                        <View style={styles.statsRow}>
                            {renderStat('Followers', followerStats.followers.toString())}
                            <View style={styles.statDivider} />
                            {renderStat('Following', followerStats.following.toString())}
                            <View style={styles.statDivider} />
                            {renderStat('Subs', '0')}
                        </View>

                        {/* Main Actions */}
                        <View style={styles.actionButtonsRow}>
                            <TouchableOpacity
                                style={[styles.followButton, isFollowing && styles.followingButton]}
                                onPress={() => setIsFollowing(!isFollowing)}
                            >
                                <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                                    {isFollowing ? 'Following' : 'Follow'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.subscribeButton}>
                                <Ionicons name="star" size={16} color="white" style={{ marginRight: 6 }} />
                                <Text style={styles.subscribeButtonText}>Subscribe</Text>
                            </TouchableOpacity>
                        </View>
                    </SignedIn>
                </View>

                {/* 3. Sticky Tab Bar */}
                <View style={styles.tabBarContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarContent}>
                        {TABS.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
                            >
                                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                                    {tab}
                                </Text>
                                {activeTab === tab && <View style={styles.activeIndicator} />}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* 4. Tab Content */}
                <View style={styles.contentArea}>
                    {activeTab === 'Home' ? (
                        <View style={styles.homeContent}>
                            <Text style={styles.sectionTitle}>Recent Broadcast</Text>
                            <TouchableOpacity style={styles.featuredClip}>
                                <View style={styles.thumbnailContainer}>
                                    <View style={styles.durationBadge}>
                                        <Text style={styles.durationText}>02:14:30</Text>
                                    </View>
                                </View>
                                <View style={styles.clipInfo}>
                                    <Text style={styles.clipTitle} numberOfLines={2}>
                                        Late Night Grinding! 🌙 Road to Rank 1
                                    </Text>
                                    <Text style={styles.clipMeta}>Last streamed 2 hours ago • 4.2K views</Text>
                                </View>
                            </TouchableOpacity>

                            <Text style={styles.sectionTitle}>Popular Clips</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }}>
                                <View style={{ width: 16 }} />
                                {[1, 2, 3].map((i) => (
                                    <TouchableOpacity key={i} style={styles.miniClipCard}>
                                        <View style={styles.miniThumbnail} />
                                        <Text style={styles.miniClipTitle} numberOfLines={2}>Insane Clutch Round {i}!</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    ) : (
                        <View style={styles.emptyStateContainer}>
                            <Ionicons name="file-tray-outline" size={48} color="#333" />
                            <Text style={styles.emptyStateTitle}>No content yet</Text>
                        </View>
                    )}
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050505',
    },
    scrollContent: {
        flex: 1,
    },
    // Cover Area
    coverContainer: {
        height: 180,
        width: '100%',
        position: 'relative',
        backgroundColor: '#1a1a1a',
    },
    coverImage: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    coverGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    headerActions: {
        position: 'absolute',
        top: 0,
        right: 16,
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    // Profile Info
    profileInfoContainer: {
        paddingHorizontal: 16,
        marginTop: -40, // Overlap cover
        marginBottom: 24,
    },
    avatarRow: {
        marginBottom: 16,
    },
    avatarContainer: {
        position: 'relative',
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 16, // Squares with rounded corners (Gamer style)
        borderWidth: 4,
        borderColor: '#050505',
        backgroundColor: '#333',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -6,
        right: -6,
        backgroundColor: '#014743',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#050505',
    },
    nameSection: {
        gap: 4,
    },
    username: {
        color: 'white',
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    bio: {
        color: '#adadb8',
        fontSize: 14,
        lineHeight: 20,
    },
    // Stats
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        backgroundColor: '#111',
        padding: 12,
        borderRadius: 12,
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#666',
        fontSize: 12,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#222',
    },
    // Actions
    actionButtonsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    followButton: {
        flex: 1,
        backgroundColor: '#f0ede4',
        height: 44,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    followingButton: {
        backgroundColor: '#1f1f23',
        borderWidth: 1,
        borderColor: '#333',
    },
    followButtonText: {
        color: '#050505',
        fontWeight: 'bold',
        fontSize: 14,
    },
    followingButtonText: {
        color: 'white',
    },
    subscribeButton: {
        flex: 1,
        backgroundColor: '#014743',
        height: 44,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    subscribeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    // Tabs
    tabBarContainer: {
        backgroundColor: '#050505',
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f23',
    },
    tabBarContent: {
        paddingHorizontal: 16,
    },
    tabItem: {
        marginRight: 24,
        paddingVertical: 14,
        alignItems: 'center',
    },
    tabItemActive: {
        //
    },
    tabText: {
        color: '#888',
        fontSize: 15,
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#f0ede4',
        fontWeight: 'bold',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 2,
        backgroundColor: '#014743',
        borderRadius: 2,
    },
    // Content
    contentArea: {
        padding: 16,
        minHeight: 400,
    },
    homeContent: {
        paddingBottom: 20,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 8,
    },
    featuredClip: {
        marginBottom: 32,
    },
    thumbnailContainer: {
        width: '100%',
        height: 180,
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        marginBottom: 12,
        position: 'relative',
    },
    durationBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    durationText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    clipInfo: {
        gap: 4,
    },
    clipTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
    },
    clipMeta: {
        color: '#666',
        fontSize: 12,
    },
    miniClipCard: {
        width: 140,
        marginRight: 12,
    },
    miniThumbnail: {
        width: 140,
        height: 80,
        backgroundColor: '#1a1a1a',
        borderRadius: 6,
        marginBottom: 8,
    },
    miniClipTitle: {
        color: '#adadb8',
        fontSize: 12,
        fontWeight: '500',
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateTitle: {
        color: '#666',
        fontSize: 14,
        marginTop: 12,
    },
    // Guest State
    guestContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#111',
        borderRadius: 16,
        padding: 24,
    },
    guestTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    guestSubtitle: {
        color: '#888',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    authButton: {
        backgroundColor: '#014743',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    authButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
