import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Room, VideoView, useLocalParticipant } from '@livekit/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../lib/api';

export default function BroadcastScreen() {
    const router = useRouter();
    const { user } = useUser();
    const { roomName, streamId, streamTitle } = useLocalSearchParams();
    const [room] = useState(() => new Room());
    const [isConnecting, setIsConnecting] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);

    const { cameraPublication, microphonePublication } = useLocalParticipant(room);

    useEffect(() => {
        const connect = async () => {
            if (!user || !roomName) return;

            try {
                // Get LiveKit token
                const { token } = await api.getLivekitToken(
                    user.id,
                    user.username || user.fullName || 'Streamer',
                    roomName as string,
                    true // isPublisher
                );

                // Connect to room
                await room.connect(process.env.EXPO_PUBLIC_LIVEKIT_URL || 'wss://wagwan-rf66fz84.livekit.cloud', token);

                // Enable camera and microphone
                await room.localParticipant.setCameraEnabled(true);
                await room.localParticipant.setMicrophoneEnabled(true);

                setIsConnecting(false);
            } catch (error) {
                console.error('Failed to connect to room:', error);
                alert('Failed to start stream');
                router.back();
            }
        };

        connect();

        return () => {
            room.disconnect();
        };
    }, [user, roomName]);

    const toggleMute = async () => {
        if (microphonePublication) {
            await room.localParticipant.setMicrophoneEnabled(isMuted);
            setIsMuted(!isMuted);
        }
    };

    const toggleCamera = async () => {
        if (cameraPublication) {
            await room.localParticipant.setCameraEnabled(isCameraOff);
            setIsCameraOff(!isCameraOff);
        }
    };

    const endStream = async () => {
        await room.disconnect();
        // TODO: Update stream status to 'offline' in database
        router.back();
    };

    if (isConnecting) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#8A2BE2" />
                <Text style={styles.loadingText}>Connecting to stream...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Camera Preview */}
            <View style={styles.videoContainer}>
                {cameraPublication && (
                    <VideoView
                        style={styles.video}
                        videoTrack={cameraPublication.track}
                        mirror={true}
                    />
                )}
            </View>

            {/* Stream Info Overlay */}
            <View style={styles.topOverlay}>
                <View style={styles.liveIndicator}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                </View>
                <Text style={styles.streamTitle}>{streamTitle}</Text>
            </View>

            {/* Controls Overlay */}
            <View style={styles.bottomOverlay}>
                <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
                    <Ionicons
                        name={isMuted ? 'mic-off' : 'mic'}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton} onPress={toggleCamera}>
                    <Ionicons
                        name={isCameraOff ? 'videocam-off' : 'videocam'}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton}>
                    <Ionicons name="camera-reverse" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.controlButton, styles.endButton]}
                    onPress={endStream}
                >
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    videoContainer: {
        flex: 1,
    },
    video: {
        flex: 1,
    },
    loadingText: {
        color: '#fff',
        marginTop: 16,
        fontSize: 16,
    },
    topOverlay: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff0000',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
        marginRight: 6,
    },
    liveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    streamTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 12,
    },
    bottomOverlay: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    controlButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    endButton: {
        backgroundColor: '#ff0000',
    },
});
