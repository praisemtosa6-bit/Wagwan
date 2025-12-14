import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
    LayoutAnimation,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    UIManager,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const INITIAL_MESSAGES = [
    { id: '1', user: 'user123', message: 'This stream is awesome!', color: '#ff5733' },
    { id: '2', user: 'gamer_pro', message: 'Muli bwanji!', color: '#33ff57' },
    { id: '3', user: 'wagwan_fan', message: 'Hello from Malawi!', color: '#3357ff' },
];

const CHAT_PHRASES = [
    'Moto! 🔥',
    'Zikomo kwambiri',
    'This is lit',
    'Bwino bwino',
    'Wagwan fam',
    'Nice gameplay',
    'Zikuyenda',
    'Chabwino',
    'Lets goooo',
    'Malawi on top 🇲🇼',
    'GG',
    'Osadandaula',
    'Wow',
    'Stream is smooth',
];

const USERNAMES = ['chimwemwe', 'thoko', 'blantyre_boy', 'lilongwe_girl', 'mzuzu_kid', 'lake_vibes', 'nyasa_queen', 'warm_heart'];

const COLORS = ['#ff5733', '#33ff57', '#3357ff', '#ff33a8', '#33fff5', '#f0ede4', '#e91916'];

const SUBSCRIPTION_PLANS = [
    { duration: 'Monthly', regular: 'MK 3,000', vip: 'MK 5,000' },
    { duration: '3 Months', regular: 'MK 8,000', vip: 'MK 14,000' },
    { duration: '6 Months', regular: 'MK 16,500', vip: 'MK 28,500' },
];

export default function StreamScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef<Video>(null);

    // Chat Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            const randomPhrase = CHAT_PHRASES[Math.floor(Math.random() * CHAT_PHRASES.length)];
            const randomUser = USERNAMES[Math.floor(Math.random() * USERNAMES.length)];
            const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

            const newMessage = {
                id: Date.now().toString() + Math.random().toString(),
                user: randomUser,
                message: randomPhrase,
                color: randomColor,
            };

            setMessages((prev) => {
                const newMessages = [...prev, newMessage];
                if (newMessages.length > 50) newMessages.shift(); // Keep list manageable
                return newMessages;
            });
        }, 2000); // New message every 2 seconds

        return () => clearInterval(interval);
    }, []);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const sendMessage = () => {
        if (inputText.trim().length === 0) return;
        const newMessage = {
            id: Date.now().toString(),
            user: 'You',
            message: inputText,
            color: '#f0ede4',
        };
        setMessages((prev) => [...prev, newMessage]);
        setInputText('');
    };

    const toggleFollow = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsFollowing(!isFollowing);
    };

    const renderMessage = ({ item }: { item: { id: string, user: string, message: string, color: string } }) => (
        <View style={styles.messageRow}>
            <Text style={[styles.username, { color: item.color }]}>{item.user}: </Text>
            <Text style={styles.messageText}>{item.message}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.videoContainer}>
                {/* Auth Gate Overlay for Video */}
                <SignedOut>
                    <View style={styles.authOverlay}>
                        <Ionicons name="lock-closed" size={48} color="#f0ede4" style={{ marginBottom: 16 }} />
                        <Text style={styles.authTitle}>Sign in to Watch</Text>
                        <Text style={styles.authSubtitle}>Join the community to watch streams and chat.</Text>
                        <TouchableOpacity style={styles.authButton} onPress={() => router.push('/auth/login')}>
                            <Text style={styles.authButtonText}>Log In / Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </SignedOut>

                <SignedIn>
                    <TouchableWithoutFeedback onPress={() => setShowControls(!showControls)}>
                        <View style={styles.videoWrapper}>
                            <Video
                                ref={videoRef}
                                style={styles.video}
                                source={require('../../assets/Download.mp4')}
                                resizeMode={ResizeMode.COVER}
                                shouldPlay={isPlaying}
                                isLooping
                                useNativeControls={false}
                            />

                            {/* Custom Controls Overlay */}
                            {showControls && (
                                <View style={styles.controlsOverlay}>
                                    <TouchableOpacity
                                        style={styles.controlButton}
                                        onPress={() => {
                                            setIsPlaying(!isPlaying);
                                        }}
                                    >
                                        <Ionicons name={isPlaying ? "pause" : "play"} size={48} color="white" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.fullscreenButton}
                                        onPress={async () => {
                                            if (videoRef.current) {
                                                await videoRef.current.presentFullscreenPlayer();
                                            }
                                        }}
                                    >
                                        <Ionicons name="scan-outline" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Always visible overlay elements */}
                            {!showControls && (
                                <>
                                    <View style={styles.liveBadge}>
                                        <Text style={styles.liveText}>LIVE</Text>
                                    </View>

                                    <View style={styles.chatOverlay}>
                                        {messages.slice(-4).map((msg) => (
                                            <View key={msg.id} style={styles.overlayMessageRow}>
                                                <Text style={[styles.overlayUsername, { color: msg.color }]}>{msg.user}: </Text>
                                                <Text style={styles.overlayMessageText} numberOfLines={1}>{msg.message}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </>
                            )}

                            <TouchableOpacity style={[styles.backButton, { opacity: showControls ? 1 : 0.5 }]} onPress={() => router.back()}>
                                <Ionicons name="chevron-back" size={28} color="white" />
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </SignedIn>
                {/* Back button for SignedOut state */}
                <SignedOut>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={28} color="white" />
                    </TouchableOpacity>
                </SignedOut>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
                <View style={styles.streamerInfo}>
                    <Text style={styles.streamTitle}>Live Stream {id}</Text>
                    <TouchableOpacity onPress={() => router.push('/user/user123')}>
                        <Text style={styles.streamerName}>Streamer Name</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.subscribeButton]}
                        onPress={() => setSubscriptionModalVisible(true)}
                    >
                        <Text style={styles.subscribeText}>Subscribe</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, isFollowing ? styles.followingButton : styles.followButton]}
                        onPress={toggleFollow}
                    >
                        <Ionicons name={isFollowing ? "heart" : "heart-outline"} size={20} color={isFollowing ? "#f0ede4" : "#014743"} />
                        <Text style={[styles.followText, isFollowing && styles.followingText]}>
                            {isFollowing ? "Following" : "Follow"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Chat Area */}
            <View style={styles.chatContainer}>
                <View style={styles.chatHeader}>
                    <Text style={styles.chatTitle}>Live Chat</Text>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.chatList}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
                >
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Send a message..."
                            placeholderTextColor="#666"
                            value={inputText}
                            onChangeText={setInputText}
                            onSubmitEditing={sendMessage}
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                            <Ionicons name="send" size={20} color="#014743" />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>

            {/* Subscription Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={subscriptionModalVisible}
                onRequestClose={() => setSubscriptionModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Subscribe to Streamer</Text>
                            <TouchableOpacity onPress={() => setSubscriptionModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalSubtitle}>Support the stream and get exclusive perks!</Text>

                        <View style={styles.plansContainer}>
                            {SUBSCRIPTION_PLANS.map((plan, index) => (
                                <View key={index} style={styles.planRow}>
                                    <Text style={styles.planDuration}>{plan.duration}</Text>
                                    <View style={styles.planPrices}>
                                        <TouchableOpacity style={styles.priceButton}>
                                            <Text style={styles.priceLabel}>Regular</Text>
                                            <Text style={styles.priceValue}>{plan.regular}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.priceButton, styles.vipPriceButton]}>
                                            <Text style={[styles.priceLabel, styles.vipText]}>VIP</Text>
                                            <Text style={[styles.priceValue, styles.vipText]}>{plan.vip}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    videoContainer: {
        width: width,
        height: width * (9 / 16), // 16:9 aspect ratio
        backgroundColor: '#000',
        position: 'relative',
    },
    videoWrapper: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    controlsOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
    },
    controlButton: {
        padding: 20,
    },
    fullscreenButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        padding: 8,
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 4,
    },
    liveBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#e91916',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    liveText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
    },
    chatOverlay: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        width: 110, // Very compressed
        maxHeight: 80,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 6,
        padding: 4,
    },
    overlayMessageRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    overlayUsername: {
        fontWeight: 'bold',
        fontSize: 8, // Tiny text
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    overlayMessageText: {
        color: 'white',
        fontSize: 8, // Tiny text
        flex: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        backgroundColor: '#121212',
    },
    streamerInfo: {
        flex: 1,
    },
    streamTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    streamerName: {
        color: '#ccc',
        fontSize: 14,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 4,
    },
    subscribeButton: {
        backgroundColor: '#014743',
    },
    subscribeText: {
        color: '#f0ede4',
        fontWeight: 'bold',
    },
    followButton: {
        backgroundColor: '#f0ede4',
    },
    followingButton: {
        backgroundColor: '#014743',
        borderWidth: 1,
        borderColor: '#f0ede4',
    },
    followText: {
        color: '#014743',
        fontWeight: 'bold',
    },
    followingText: {
        color: '#f0ede4',
    },
    chatContainer: {
        flex: 1,
        backgroundColor: '#121212',
    },
    chatHeader: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        backgroundColor: '#1a1a1a',
    },
    chatTitle: {
        color: '#f0ede4',
        fontWeight: 'bold',
        fontSize: 16,
    },
    chatList: {
        padding: 10,
        paddingBottom: 20,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 8,
        flexWrap: 'wrap',
    },
    username: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    messageText: {
        color: '#fff',
        fontSize: 14,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#333',
        backgroundColor: '#1a1a1a',
    },
    input: {
        flex: 1,
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#f0ede4',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#014743',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    plansContainer: {
        gap: 15,
    },
    planRow: {
        marginBottom: 15,
    },
    planDuration: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    planPrices: {
        flexDirection: 'row',
        gap: 10,
    },
    priceButton: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    vipPriceButton: {
        backgroundColor: '#014743',
        borderColor: '#014743',
    },
    priceLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    priceValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    vipText: {
        color: '#f0ede4',
    },
    authOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
        padding: 24,
    },
    authTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    authSubtitle: {
        color: '#888',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
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
