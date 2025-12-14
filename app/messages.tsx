
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_MESSAGES = [
    {
        id: '1',
        user: 'shipmark',
        avatar: 'https://via.placeholder.com/50',
        lastMessage: 'Thanks for tuning in! 🔥',
        time: '2m',
        unread: 2,
        verified: true,
    },
    {
        id: '2',
        user: 'Ninja_Fan_Lover',
        avatar: 'https://via.placeholder.com/50',
        lastMessage: 'Did you see that clip?? Insane.',
        time: '1h',
        unread: 0,
        verified: false,
    },
    {
        id: '3',
        user: 'WagwanSupport',
        avatar: 'https://via.placeholder.com/50',
        lastMessage: 'Your streamer application has been approved.',
        time: '1d',
        unread: 1,
        verified: true,
    },
    {
        id: '4',
        user: 'xqc_ow',
        avatar: 'https://via.placeholder.com/50',
        lastMessage: 'ggs',
        time: '2d',
        unread: 0,
        verified: true,
    },
    {
        id: '5',
        user: 'StreamLabs',
        avatar: 'https://via.placeholder.com/50',
        lastMessage: 'Check out the new alert box themes',
        time: '3d',
        unread: 0,
        verified: true,
    },
];

export default function MessagesScreen() {
    const router = useRouter();

    const renderMessageItem = ({ item }: { item: typeof MOCK_MESSAGES[0] }) => (
        <Link
            href={{
                pathname: '/chat/[id]',
                params: { id: item.id, user: item.user, avatar: item.avatar },
            }}
            asChild
        >
            <TouchableOpacity style={styles.messageItem}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    {item.unread > 0 && <View style={styles.unreadBadge} />}
                </View>
                <View style={styles.messageContent}>
                    <View style={styles.messageHeader}>
                        <View style={styles.nameRow}>
                            <Text style={[styles.username, item.unread > 0 && styles.unreadText]}>{item.user}</Text>
                            {item.verified && (
                                <Ionicons name="checkmark-circle" size={14} color="#f0ede4" style={{ marginLeft: 4 }} />
                            )}
                        </View>
                        <Text style={styles.timeText}>{item.time}</Text>
                    </View>
                    <Text style={[styles.lastMessage, item.unread > 0 ? styles.unreadMessage : styles.readMessage]} numberOfLines={1}>
                        {item.lastMessage}
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Messages</Text>
                <TouchableOpacity>
                    <Ionicons name="create-outline" size={24} color="#f0ede4" />
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
                    <TextInput
                        placeholder="Search Direct Messages"
                        placeholderTextColor="#888"
                        style={styles.searchInput}
                    />
                </View>
            </View>

            {/* Message List */}
            <FlatList
                data={MOCK_MESSAGES}
                renderItem={renderMessageItem}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f23',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchContainer: {
        padding: 16,
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
    listContent: {
        paddingBottom: 20,
    },
    messageItem: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#333',
    },
    unreadBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#014743',
        borderWidth: 2,
        borderColor: '#000',
    },
    messageContent: {
        flex: 1,
        justifyContent: 'center',
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        color: '#adadb8',
        fontSize: 16,
        fontWeight: '600',
    },
    unreadText: {
        color: '#f0ede4',
        fontWeight: 'bold',
    },
    timeText: {
        color: '#666',
        fontSize: 12,
    },
    lastMessage: {
        fontSize: 14,
        lineHeight: 20,
    },
    readMessage: {
        color: '#666',
    },
    unreadMessage: {
        color: '#f0ede4',
        fontWeight: '500',
    },
});
