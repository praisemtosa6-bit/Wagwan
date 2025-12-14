import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IRLStreamScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const router = useRouter();
    const [facing, setFacing] = useState<'front' | 'back'>('front');
    const [isMuted, setIsMuted] = useState(false);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <CameraView style={styles.camera} facing={facing}>
                <SafeAreaView style={styles.overlay}>
                    {/* Top Bar */}
                    <View style={styles.topBar}>
                        <View style={styles.statusBadge}>
                            <View style={styles.offlineDot} />
                            <Text style={styles.statusText}>Stream... Offline</Text>
                        </View>
                        <View style={styles.topButtons}>
                            <TouchableOpacity style={styles.iconButton}>
                                <Ionicons name="ellipsis-horizontal" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.back()} style={[styles.iconButton, { marginLeft: 10 }]}>
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Bottom Section */}
                    <View style={styles.bottomSection}>
                        {/* Stats */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Uptime</Text>
                                <Text style={styles.statValue}>00:00</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Viewers</Text>
                                <Text style={styles.statValue}>--</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Followers</Text>
                                <Text style={styles.statValue}>0</Text>
                            </View>
                        </View>

                        {/* Controls */}
                        <View style={styles.controlsContainer}>
                            <TouchableOpacity
                                style={styles.controlButton}
                                onPress={() => setIsMuted(!isMuted)}
                            >
                                <Ionicons name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.goLiveButton}>
                                <Image
                                    source={require('../../assets/images/icon.png')}
                                    style={styles.goLiveIcon}
                                />
                                <Text style={styles.goLiveText}>GO LIVE</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.controlButton}
                                onPress={toggleCameraFacing}
                            >
                                <Ionicons name="camera-reverse" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: 'white',
    },
    permissionButton: {
        backgroundColor: '#014743',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'center',
    },
    permissionButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 16,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    offlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#adadb8',
        marginRight: 8,
    },
    statusText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    topButtons: {
        flexDirection: 'row',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomSection: {
        gap: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 12,
        borderRadius: 12,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        color: '#adadb8',
        fontSize: 12,
        marginBottom: 2,
    },
    statValue: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    controlButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    goLiveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e91916',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 30,
        gap: 8,
    },
    goLiveIcon: {
        width: 24,
        height: 24,
        tintColor: 'white',
    },
    goLiveText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
