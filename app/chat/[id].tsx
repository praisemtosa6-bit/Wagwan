
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_MESSAGES = [
    { id: '1', text: 'Yo! You streaming today?', sender: 'them', time: '10:30 AM' },
    { id: '2', text: 'Yeah, planning to go live in about an hour. 🎮', sender: 'me', time: '10:32 AM' },
    { id: '3', text: 'Sweet, I will be there. What are you playing?', sender: 'them', time: '10:33 AM' },
    { id: '4', text: 'Probably some Valorant ranked, trying to hit Immortal.', sender: 'me', time: '10:35 AM' },
    { id: '5', text: 'Good luck with that haha, see ya there!', sender: 'them', time: '10:36 AM' },
];

export default function ChatDetailScreen() {
    const router = useRouter();
    const { id, user, avatar } = useLocalSearchParams();
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState(MOCK_MESSAGES);

    const handleSend = () => {
        if (!inputText.trim()) return;
        const newMessage = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([...messages, newMessage]);
        setInputText('');
    };

    const renderMessage = ({ item }: { item: typeof MOCK_MESSAGES[0] }) => {
        const isMe = item.sender === 'me';
        return (
            <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.theirMessageRow]}>
                <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
                    <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
                        {item.text}
                    </Text>
                    <Text style={styles.timeText}>
                        {item.time}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color="#f0ede4" />
                    </TouchableOpacity>

                    <View style={styles.profileContainer}>
                        <Image
                            source={{ uri: (avatar as string) || 'https://via.placeholder.com/50' }}
                            style={styles.headerAvatar}
                        />
                        <View style={styles.onlineBadge} />
                    </View>

                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>{user || 'Chat'}</Text>
                        <Text style={styles.headerStatus}>ONLINE</Text>
                    </View>
                </View>

                {/* Call buttons removed as requested */}
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            {/* Chat Area */}
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.chatContent}
                inverted={false}
            />

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.attachButton}>
                        <Ionicons name="add" size={24} color="#f0ede4" />
                    </TouchableOpacity>

                    <View style={styles.inputFieldContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Message..."
                            placeholderTextColor="#666"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                        />
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={handleSend}
                            disabled={!inputText.trim()}
                        >
                            <Ionicons
                                name="arrow-up"
                                size={20}
                                color={inputText.trim() ? '#014743' : '#333'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050505', // Slightly darker than standard black
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#121212',
        backgroundColor: '#0a0a0a',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backButton: {
        padding: 4,
        marginRight: 0,
    },
    profileContainer: {
        position: 'relative',
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 12, // More square
        backgroundColor: '#333',
        borderWidth: 1,
        borderColor: '#333',
    },
    onlineBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#00ff00',
        borderWidth: 2,
        borderColor: '#0a0a0a',
    },
    headerTextContainer: {
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#f0ede4',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    headerStatus: {
        color: '#014743',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    menuButton: {
        padding: 8,
    },
    chatContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        gap: 24, // More space between messages
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    myMessageRow: {
        justifyContent: 'flex-end',
    },
    theirMessageRow: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '75%',
        padding: 16,
        borderRadius: 4, // Tech / Sharp look
    },
    myBubble: {
        backgroundColor: '#014743',
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 0, // Sharp corner on source
    },
    theirBubble: {
        backgroundColor: '#1f1f23',
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 0, // Sharp corner on source
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '500',
    },
    myMessageText: {
        color: '#ffffff',
    },
    theirMessageText: {
        color: '#efeff1',
    },
    timeText: {
        fontSize: 10,
        marginTop: 8,
        color: 'rgba(255,255,255,0.4)',
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 16,
        backgroundColor: '#050505',
        gap: 12,
    },
    attachButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2, // Align with input
        borderWidth: 1,
        borderColor: '#222',
    },
    inputFieldContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#121212',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#222',
        alignItems: 'center',
        paddingRight: 8,
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        maxHeight: 100,
        color: 'white',
        fontSize: 16,
    },
    sendButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#f0ede4',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 6,
    },
});
