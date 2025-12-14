import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const FeedScreen = () => {
    const video = useRef(null);
    const [status, setStatus] = useState({});
    // Placeholder for bottom tab height if used, otherwise default padding
    // const tabBarHeight = useBottomTabBarHeight(); 

    useEffect(() => {
        if (video.current) {
            video.current.playAsync();
        }
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Video Player Background */}
            <Video
                ref={video}
                style={styles.video}
                source={require('../../assets/Download.mp4')}
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            />

            {/* Overlay Container */}
            <SafeAreaView style={styles.overlay}>

                {/* Top Bar: Streamer Info */}
                <View style={styles.topBar}>
                    <View style={styles.streamerInfo}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/50' }}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.streamerName}>MalawiGamer_01</Text>
                            <Text style={styles.streamTitle}>Playing FIFA 24 - Rank Push! 🇲🇼</Text>
                            <View style={styles.tagsContainer}>
                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>English</Text>
                                </View>
                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>FIFA</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.liveBadge}>
                        <Text style={styles.liveText}>LIVE</Text>
                    </View>
                </View>

                {/* Right Side Actions */}
                <View style={styles.rightActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="heart-outline" size={30} color="white" />
                        <Text style={styles.actionText}>1.2k</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="chatbubble-outline" size={30} color="white" />
                        <Text style={styles.actionText}>342</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="share-social-outline" size={30} color="white" />
                        <Text style={styles.actionText}>Share</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Area: Chat Preview & Input */}
                <View style={styles.bottomArea}>
                    <View style={styles.chatPreview}>
                        <Text style={styles.chatMessage}><Text style={styles.chatUser}>User1:</Text> Let's gooo! 🔥</Text>
                        <Text style={styles.chatMessage}><Text style={styles.chatUser}>Chifundo:</Text> Nice goal!</Text>
                        <Text style={styles.chatMessage}><Text style={styles.chatUser}>WagwanFan:</Text> Is this live?</Text>
                    </View>

                    <View style={styles.inputArea}>
                        <TouchableOpacity style={styles.inputButton}>
                            <Text style={styles.inputText}>Send a message...</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.giftButton}>
                            <Ionicons name="gift" size={24} color="#A970FF" />
                        </TouchableOpacity>
                    </View>
                </View>

            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    video: {
        width: width,
        height: height,
        position: 'absolute',
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        alignItems: 'flex-start',
    },
    streamerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#A970FF',
    },
    streamerName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    streamTitle: {
        color: '#ddd',
        fontSize: 14,
    },
    tagsContainer: {
        flexDirection: 'row',
        marginTop: 4,
    },
    tag: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginRight: 6,
    },
    tagText: {
        color: 'white',
        fontSize: 10,
    },
    liveBadge: {
        backgroundColor: 'red',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    liveText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    rightActions: {
        position: 'absolute',
        right: 16,
        bottom: 200,
        alignItems: 'center',
    },
    actionButton: {
        marginBottom: 20,
        alignItems: 'center',
    },
    actionText: {
        color: 'white',
        fontSize: 12,
        marginTop: 4,
    },
    bottomArea: {
        padding: 16,
        paddingBottom: 20, // Adjust for bottom tab bar if needed
        backgroundColor: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', // Note: LinearGradient needs expo-linear-gradient, using solid fallback or just transparent for now if not installed. 
        // Actually, let's just use a semi-transparent background for readability
    },
    chatPreview: {
        height: 100,
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    chatMessage: {
        color: 'white',
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    chatUser: {
        fontWeight: 'bold',
        color: '#A970FF',
    },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputButton: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 12,
        borderRadius: 20,
        marginRight: 10,
    },
    inputText: {
        color: '#ccc',
    },
    giftButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
    },
});

export default FeedScreen;
