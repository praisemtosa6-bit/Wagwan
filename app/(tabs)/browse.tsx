import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { ResizeMode, Video } from 'expo-av';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, User } from '../../lib/api';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const ITEM_WIDTH = (width - 48) / COLUMN_COUNT; // 16px padding on sides + 16px gap

const CATEGORIES = [
    { id: '1', name: 'Just Chatting', viewers: '463K', image: require('../../assets/images/categories/just_chatting.png'), tags: ['IRL'] },
    { id: '2', name: 'Fortnite', viewers: '120K', image: require('../../assets/images/categories/fortnite.png'), tags: ['Shooter', 'FPS'] },
    { id: '3', name: 'League of Legends', viewers: '95K', image: require('../../assets/images/categories/league_of_legends.avif'), tags: ['MOBA'] },
    { id: '4', name: 'Valorant', viewers: '80K', image: require('../../assets/images/categories/valorant.png'), tags: ['FPS', 'Shooter'] },
    { id: '5', name: 'Call of Duty', viewers: '60K', image: require('../../assets/images/categories/cod.webp'), tags: ['FPS'] },
    { id: '6', name: 'Minecraft', viewers: '45K', image: require('../../assets/images/categories/minecraft.png'), tags: ['Simulation'] },
    { id: '7', name: 'Malawian Music', viewers: '15K', image: require('../../assets/images/categories/malawian-music.jpg'), tags: ['Music', 'Culture'] },
];

const LIVE_CHANNELS = [
    {
        id: '1',
        streamer: 'shipmark',
        title: '24 hours live stream',
        game: 'Just Chatting',
        viewers: '23K',
        video: require('../../assets/Download.mp4'),
        avatar: 'https://via.placeholder.com/40',
    },
    {
        id: '2',
        streamer: 'voodo skates',
        title: 'random title',
        game: 'irl',
        viewers: '12K',
        video: require('../../assets/Download_1.mp4'),
        avatar: 'https://via.placeholder.com/40',
    },
];

export default function BrowseScreen() {
    const router = useRouter();
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState('Categories');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [followStatus, setFollowStatus] = useState<Record<string, boolean>>({});
    const [followLoading, setFollowLoading] = useState<Record<string, boolean>>({});

    const handleSearch = async (text: string) => {
        setSearchQuery(text);
        if (text.length < 2) {
            setSearchResults([]);
            setSearchError(null);
            return;
        }

        setIsSearching(true);
        setSearchError(null);
        console.log('Searching for:', text);
        try {
            const results = await api.searchUsers(text);
            console.log('Search results:', results);
            // Keep yourself in results (useful for confirming search works), but disable follow in UI
            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
            setSearchError(error instanceof Error ? error.message : String(error));
        } finally {
            setIsSearching(false);
        }
    };

    // Refresh follow status for visible search results
    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            if (!user) return;
            if (searchResults.length === 0) return;

            try {
                const statuses = await Promise.all(
                    searchResults.map(async (u) => {
                        const res = await api.checkFollowStatus(user.id, u.id);
                        return [u.id, res.isFollowing] as const;
                    })
                );

                if (cancelled) return;
                setFollowStatus((prev) => {
                    const next = { ...prev };
                    for (const [id, isFollowing] of statuses) {
                        next[id] = isFollowing;
                    }
                    return next;
                });
            } catch (e) {
                // Non-fatal; still allow user to tap Follow and create state
                console.log('Failed to prefetch follow statuses:', e);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [user, searchResults]);

    const toggleFollow = async (targetUserId: string) => {
        if (!user) {
            alert('Please log in to follow users.');
            return;
        }

        if (targetUserId === user.id) {
            return;
        }

        if (followLoading[targetUserId]) return;

        const currentlyFollowing = !!followStatus[targetUserId];
        setFollowLoading((p) => ({ ...p, [targetUserId]: true }));

        try {
            if (currentlyFollowing) {
                await api.unfollowUser(user.id, targetUserId);
                setFollowStatus((p) => ({ ...p, [targetUserId]: false }));
            } else {
                await api.followUser(user.id, targetUserId);
                setFollowStatus((p) => ({ ...p, [targetUserId]: true }));
            }
        } catch (e) {
            console.error('Follow toggle failed:', e);
            alert(`Failed to ${currentlyFollowing ? 'unfollow' : 'follow'} user`);
        } finally {
            setFollowLoading((p) => ({ ...p, [targetUserId]: false }));
        }
    };

    const renderCategoryItem = ({ item }: { item: typeof CATEGORIES[0] }) => (
        <View style={styles.categoryCard}>
            <Image source={item.image} style={styles.categoryImage} />
            <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle} numberOfLines={1}>{item.name}</Text>
                <View style={styles.viewerRow}>
                    <View style={styles.redDot} />
                    <Text style={styles.viewerCount}>{item.viewers}</Text>
                </View>
                <View style={styles.tagsRow}>
                    {item.tags.map((tag: string, index: number) => (
                        <View key={index} style={styles.tagPill}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    const renderLiveChannelItem = ({ item }: { item: typeof LIVE_CHANNELS[0] }) => (
        <Link href={`/stream/${item.id}`} asChild>
            <TouchableOpacity style={styles.streamCard} activeOpacity={0.9}>
                {/* Video Preview */}
                <View style={styles.videoContainer}>
                    <Video
                        style={styles.video}
                        source={item.video}
                        resizeMode={ResizeMode.COVER}
                        isLooping
                        shouldPlay
                        isMuted={true}
                    />
                    <View style={styles.liveBadge}>
                        <Text style={styles.liveText}>LIVE</Text>
                    </View>
                    <View style={styles.viewerCountBadge}>
                        <Text style={styles.viewerText}>{item.viewers} viewers</Text>
                    </View>
                </View>

                {/* Stream Info Panel */}
                <View style={styles.streamInfo}>
                    <View style={styles.infoTopRow}>
                        <View style={styles.streamerDetails}>
                            <Image source={{ uri: item.avatar }} style={styles.avatar} />
                            <Text style={styles.streamerName}>{item.streamer}</Text>
                            <Ionicons name="checkmark-circle" size={16} color="#f0ede4" style={{ marginLeft: 4 }} />
                        </View>
                        <View style={styles.infoActions}>
                            <TouchableOpacity style={styles.followButton}>
                                <Ionicons name="heart-outline" size={16} color="white" style={{ marginRight: 4 }} />
                                <Text style={styles.followText}>Follow</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Ionicons name="ellipsis-vertical" size={20} color="#efeff1" style={{ marginLeft: 10 }} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.streamTitle} numberOfLines={2}>
                        {item.title}
                    </Text>

                    <TouchableOpacity style={styles.gameTag}>
                        <Text style={styles.gameTagText}>{item.game}</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Link>
    );

    const renderSearchResult = ({ item }: { item: User }) => {
        const isMe = !!user && item.id === user.id;
        const isFollowing = !!followStatus[item.id];
        const isLoading = !!followLoading[item.id];

        return (
            <View style={styles.resultItem}>
                <TouchableOpacity
                    style={styles.resultMain}
                    activeOpacity={0.8}
                    onPress={() => router.push(`/user/${item.id}`)}
                >
                    <Image
                        source={item.avatarUrl ? { uri: item.avatarUrl } : require('../../assets/images/pfp/pfp.png')}
                        style={styles.resultAvatar}
                    />
                    <View style={styles.resultInfo}>
                        <View style={styles.resultNameRow}>
                            <Text style={styles.resultName}>{item.username}</Text>
                            {item.isVerified && (
                                <Ionicons name="checkmark-circle" size={16} color="#8A2BE2" style={{ marginLeft: 6 }} />
                            )}
                            {isMe && (
                                <View style={styles.youPill}>
                                    <Text style={styles.youPillText}>You</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.resultUsername}>@{item.username}</Text>
                    </View>
                </TouchableOpacity>

                {!isMe && (
                    <TouchableOpacity
                        style={[styles.followAction, isFollowing && styles.followActionFollowing, isLoading && { opacity: 0.6 }]}
                        onPress={() => toggleFollow(item.id)}
                        disabled={isLoading || !user}
                    >
                        <Text style={[styles.followActionText, isFollowing && styles.followActionTextFollowing]}>
                            {isLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Search Header */}
            <View style={[styles.searchContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                <View style={[styles.searchBar, { flex: 1, marginRight: 10 }]}>
                    <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
                    <TextInput
                        placeholder="Search users..."
                        placeholderTextColor="#888"
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={handleSearch}
                        returnKeyType="search"
                    />
                </View>
                <TouchableOpacity>
                    <Ionicons name="filter" size={20} color="#efeff1" />
                </TouchableOpacity>
            </View>

            {/* Tabs Header - Only show when not searching */}
            {!searchQuery && (
                <View style={styles.tabsHeader}>
                    <View style={styles.tabsRow}>
                        <TouchableOpacity
                            style={styles.tabButton}
                            onPress={() => setActiveTab('Categories')}
                        >
                            <Text style={[styles.tabText, activeTab === 'Categories' && styles.tabTextActive]}>Categories</Text>
                            {activeTab === 'Categories' && <View style={styles.activeIndicator} />}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.tabButton}
                            onPress={() => setActiveTab('Live Channels')}
                        >
                            <Text style={[styles.tabText, activeTab === 'Live Channels' && styles.tabTextActive]}>Live Channels</Text>
                            {activeTab === 'Live Channels' && <View style={styles.activeIndicator} />}
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Content */}
            {searchQuery ? (
                <View style={styles.searchResultsContainer}>
                    {isSearching ? (
                        <ActivityIndicator color="#f0ede4" style={{ marginTop: 20 }} />
                    ) : (
                        <FlatList
                            data={searchResults}
                            renderItem={renderSearchResult}
                            keyExtractor={(item) => item.id}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>
                                    {searchError ? `Search failed: ${searchError}` : 'No users found'}
                                </Text>
                            }
                        />
                    )}
                </View>
            ) : (
                activeTab === 'Categories' ? (
                    <FlatList
                        key="categories-grid"
                        data={CATEGORIES}
                        renderItem={renderCategoryItem}
                        keyExtractor={(item) => item.id}
                        numColumns={COLUMN_COUNT}
                        contentContainerStyle={styles.gridContent}
                        columnWrapperStyle={styles.gridRow}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <FlatList
                        key="live-channels-list"
                        data={LIVE_CHANNELS}
                        renderItem={renderLiveChannelItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )
            )}
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    content: {
        flex: 1,
    },
    // Search Results
    searchResultsContainer: {
        flex: 1,
        padding: 16,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f23',
    },
    resultMain: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    resultAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: '#333',
    },
    resultInfo: {
        flex: 1,
    },
    resultNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    youPill: {
        marginLeft: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: '#1f1f23',
        borderWidth: 1,
        borderColor: '#333',
    },
    youPillText: {
        color: '#adadb8',
        fontSize: 12,
        fontWeight: '700',
    },
    resultName: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    resultUsername: {
        color: '#888',
        fontSize: 14,
    },
    followAction: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#8A2BE2',
        marginLeft: 10,
    },
    followActionFollowing: {
        backgroundColor: '#1f1f23',
        borderWidth: 1,
        borderColor: '#333',
    },
    followActionText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 12,
    },
    followActionTextFollowing: {
        color: '#f0ede4',
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#000000',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1f1f23',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 40,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        fontSize: 16,
    },
    tabsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    tabsRow: {
        flexDirection: 'row',
        gap: 24,
    },
    tabButton: {
        paddingVertical: 10,
    },
    tabText: {
        color: '#888',
        fontSize: 18,
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#f0ede4', // Secondary
        fontWeight: 'bold',
    },
    activeIndicator: {
        height: 3,
        backgroundColor: '#f0ede4', // Secondary
        width: '100%',
        marginTop: 4,
        borderRadius: 2,
    },
    gridContent: {
        padding: 16,
    },
    listContent: {
        paddingBottom: 20,
    },
    gridRow: {
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    categoryCard: {
        width: ITEM_WIDTH,
    },
    categoryImage: {
        width: '100%',
        height: ITEM_WIDTH * 1.3, // Aspect ratio roughly 3:4
        borderRadius: 6,
        marginBottom: 8,
        backgroundColor: '#333',
    },
    categoryInfo: {
        gap: 4,
    },
    categoryTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    viewerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    redDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'red',
        marginRight: 6,
    },
    viewerCount: {
        color: '#adadb8',
        fontSize: 12,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginTop: 4,
    },
    tagPill: {
        backgroundColor: '#323239',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    tagText: {
        color: '#adadb8',
        fontSize: 10,
        fontWeight: '600',
    },
    // Stream Card Styles
    streamCard: {
        marginBottom: 20,
    },
    videoContainer: {
        width: width,
        height: 220,
        backgroundColor: '#000',
        position: 'relative',
        overflow: 'hidden',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    liveBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#e91916',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    liveText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    viewerCountBadge: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    viewerText: {
        color: 'white',
        fontSize: 12,
    },
    streamInfo: {
        padding: 12,
    },
    infoTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    streamerDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
    },
    streamerName: {
        color: '#f0ede4',
        fontWeight: 'bold',
        fontSize: 16,
    },
    infoActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    followButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0ede4', // Secondary
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    followText: {
        color: '#014743', // Primary
        fontWeight: 'bold',
        fontSize: 12,
    },
    streamTitle: {
        color: '#f0ede4',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    gameTag: {
        alignSelf: 'flex-start',
        backgroundColor: '#26262c',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    gameTagText: {
        color: '#adadb8',
        fontSize: 12,
        fontWeight: '600',
    },
});
