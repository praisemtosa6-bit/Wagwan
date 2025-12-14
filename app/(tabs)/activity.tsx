import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Notification {
    id: string;
    type: 'live' | 'follow' | 'mention' | 'system';
    user?: {
        name: string;
        avatar: string;
    };
    content: string;
    time: string;
    read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'live',
        user: {
            name: 'shipmark',
            avatar: 'https://via.placeholder.com/40',
        },
        content: 'is live: 24 hours live stream',
        time: '2m ago',
        read: false,
    },
    {
        id: '2',
        type: 'follow',
        user: {
            name: 'ninja_fan_99',
            avatar: 'https://via.placeholder.com/40',
        },
        content: 'started following you',
        time: '1h ago',
        read: false,
    },
    {
        id: '3',
        type: 'mention',
        user: {
            name: 'voodo skates',
            avatar: 'https://via.placeholder.com/40',
        },
        content: 'mentioned you in chat: "@wagwan nice stream!"',
        time: '3h ago',
        read: true,
    },
    {
        id: '4',
        type: 'system',
        content: 'Welcome to Wagwan! Setup your profile to start streaming.',
        time: '1d ago',
        read: true,
    },
    {
        id: '5',
        type: 'live',
        user: {
            name: 'shroud',
            avatar: 'https://via.placeholder.com/40',
        },
        content: 'is live: VALORANT Ranked',
        time: '1d ago',
        read: true,
    },
];

export default function ActivityScreen() {
    const renderNotification = ({ item }: { item: Notification }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'notifications';
        let iconColor = '#9146FF';

        switch (item.type) {
            case 'live':
                iconName = 'videocam';
                iconColor = '#e91916';
                break;
            case 'follow':
                iconName = 'person-add';
                iconColor = '#9146FF';
                break;
            case 'mention':
                iconName = 'at';
                iconColor = '#014743';
                break;
            case 'system':
                iconName = 'information-circle';
                iconColor = '#adadb8';
                break;
        }

        return (
            <TouchableOpacity style={[styles.notificationItem, !item.read && styles.unreadItem]}>
                <View style={styles.avatarContainer}>
                    {item.user ? (
                        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.systemAvatar]}>
                            <Ionicons name="logo-twitch" size={20} color="white" />
                        </View>
                    )}
                    <View style={[styles.iconBadge, { backgroundColor: iconColor }]}>
                        <Ionicons name={iconName} size={10} color="white" />
                    </View>
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.notificationText}>
                        {item.user && <Text style={styles.username}>{item.user.name} </Text>}
                        {item.content}
                    </Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Activity</Text>
            </View>
            <FlatList
                data={MOCK_NOTIFICATIONS}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f23',
    },
    headerTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: 20,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f23',
        alignItems: 'center',
    },
    unreadItem: {
        backgroundColor: '#0e0e10',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#333',
    },
    systemAvatar: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#014743',
    },
    iconBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    contentContainer: {
        flex: 1,
    },
    notificationText: {
        color: '#efeff1',
        fontSize: 14,
        lineHeight: 20,
    },
    username: {
        fontWeight: 'bold',
        color: '#f0ede4',
    },
    timeText: {
        color: '#adadb8',
        fontSize: 12,
        marginTop: 4,
    },
});
