
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../lib/api';

export default function SetupScreen() {
    const router = useRouter();
    const { user } = useUser();
    const [title, setTitle] = useState('');
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [micVolume, setMicVolume] = useState(80); // 0-100
    const [deviceVolume, setDeviceVolume] = useState(60); // 0-100
    const [storeVods, setStoreVods] = useState(true);
    const [isCreatingStream, setIsCreatingStream] = useState(false);

    const handleGoLive = async () => {
        if (!user || !title.trim()) {
            alert('Please enter a stream title');
            return;
        }

        setIsCreatingStream(true);
        try {
            const roomName = `stream_${user.id}_${Date.now()}`;
            const stream = await api.createStream({
                userId: user.id,
                title: title.trim(),
                category: 'IRL',
                status: 'live',
                livekitRoomName: roomName,
            });

            router.push({
                pathname: '/stream/broadcast',
                params: { roomName, streamId: stream.id, streamTitle: title },
            });
        } catch (error) {
            console.error('Failed to create stream:', error);
            alert('Failed to start stream. Please try again.');
        } finally {
            setIsCreatingStream(false);
        }
    };

    // Mock Slider Component simply visualizes value for now
    const RenderSlider = ({ value, label, icon }: { value: number, label: string, icon: keyof typeof Ionicons.glyphMap }) => (
        <View style={styles.sliderGroup}>
            <View style={styles.sliderHeader}>
                <Ionicons name={icon} size={20} color="#ccc" />
                <Text style={styles.sliderLabel}>{label}</Text>
            </View>
            <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: `${value}%` }]} />
                <View style={[styles.sliderKnob, { left: `${value}%` }]} />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Top Bar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Stream Setup</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity>
                        <Ionicons name="share-outline" size={24} color="white" style={{ marginRight: 16 }} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-vertical" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* --- SECTION A: CORE --- */}

                {/* Stream Title */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Stream Title</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Title your stream"
                            placeholderTextColor="#666"
                            value={title}
                            onChangeText={setTitle}
                            maxLength={140}
                        />
                        <Text style={styles.charCount}>{140 - title.length}</Text>
                    </View>
                    <TouchableOpacity style={styles.editInfoBtn}>
                        <Text style={styles.editInfoText}>Edit Stream Info</Text>
                    </TouchableOpacity>
                </View>

                {/* Orientation */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Stream Orientation</Text>
                    <View style={styles.orientationRow}>
                        <TouchableOpacity
                            style={[styles.orientationOption, orientation === 'portrait' && styles.orientationSelected]}
                            onPress={() => setOrientation('portrait')}
                        >
                            <Ionicons name="tablet-portrait-outline" size={24} color={orientation === 'portrait' ? '#8A2BE2' : '#666'} />
                            <Text style={[styles.orientationText, orientation === 'portrait' && styles.orientationTextSelected]}>Portrait</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.orientationOption, orientation === 'landscape' && styles.orientationSelected]}
                            onPress={() => setOrientation('landscape')}
                        >
                            <Ionicons name="tablet-landscape-outline" size={24} color={orientation === 'landscape' ? '#8A2BE2' : '#666'} />
                            <Text style={[styles.orientationText, orientation === 'landscape' && styles.orientationTextSelected]}>Landscape</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Volume */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Stream Volume</Text>
                    <RenderSlider value={micVolume} label="Microphone" icon="mic-outline" />
                    <View style={{ height: 16 }} />
                    <RenderSlider value={deviceVolume} label="Device Audio" icon="phone-portrait-outline" />
                </View>


                {/* --- SECTION B: ADVANCED --- */}
                <View style={styles.divider} />

                {/* Audio Calibration */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Device Audio Calibration</Text>
                    <View style={styles.sliderTrack}>
                        <View style={[styles.sliderFill, { width: '50%', backgroundColor: '#8A2BE2' }]} />
                    </View>
                    <View style={styles.calibrationLabels}>
                        <Text style={styles.calLabel}>Too Low</Text>
                        <Text style={styles.calLabel}>Just Right</Text>
                        <Text style={styles.calLabel}>Too High</Text>
                    </View>
                </View>

                {/* Notifications */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Stream Notifications</Text>
                    <Text style={styles.descriptionText}>
                        Allow notifications to receive alerts when you go live or get new followers.
                    </Text>
                    <TouchableOpacity style={styles.enableButton}>
                        <Text style={styles.enableButtonText}>Enable iOS Notifications</Text>
                    </TouchableOpacity>
                </View>

                {/* VOD Settings */}
                <View style={styles.section}>
                    <View style={styles.rowBetween}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.sectionLabel}>Store Past Broadcasts</Text>
                            <Text style={styles.descriptionText}>
                                Automatically save your streams as VODs for viewers to watch later.
                            </Text>
                        </View>
                        <Switch
                            value={storeVods}
                            onValueChange={setStoreVods}
                            trackColor={{ false: '#333', true: '#8A2BE2' }}
                            thumbColor="white"
                        />
                    </View>
                </View>

                {/* Go Live Tips */}
                <View style={styles.tipsSection}>
                    <Text style={styles.tipsText}>
                        By going live, you agree to our <Text style={styles.linkText}>Terms of Service</Text>.
                    </Text>
                    <Text style={styles.linkText}>Review streaming tips</Text>
                </View>

                <View style={{ height: 80 }} /> {/* Bottom padding for fixed button */}
            </ScrollView>

            {/* Fixed Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.goLiveButton, isCreatingStream && { opacity: 0.6 }]}
                    onPress={handleGoLive}
                    disabled={isCreatingStream}
                >
                    <Text style={styles.goLiveText}>
                        {isCreatingStream ? 'Starting...' : 'Go Live'}
                    </Text>
                </TouchableOpacity>
            </View>

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
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f23',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerActions: {
        flexDirection: 'row',
    },
    scrollContent: {
        padding: 16,
    },
    section: {
        marginBottom: 32,
    },
    sectionLabel: {
        color: '#f0ede4',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    divider: {
        height: 1,
        backgroundColor: '#1f1f23',
        marginVertical: 16,
    },
    // Inputs
    inputContainer: {
        backgroundColor: '#1f1f23',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#333',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
    },
    charCount: {
        color: '#666',
        fontSize: 12,
    },
    editInfoBtn: {
        marginTop: 8,
    },
    editInfoText: {
        color: '#8A2BE2',
        fontWeight: '600',
    },
    // Orientation
    orientationRow: {
        flexDirection: 'row',
        gap: 16,
    },
    orientationOption: {
        flex: 1,
        backgroundColor: '#1f1f23',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        gap: 8,
    },
    orientationSelected: {
        borderColor: '#8A2BE2',
        backgroundColor: 'rgba(138, 43, 226, 0.1)',
    },
    orientationText: {
        color: '#666',
        fontWeight: '600',
    },
    orientationTextSelected: {
        color: 'white',
    },
    // Sliders
    sliderGroup: {
        marginBottom: 12,
    },
    sliderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    sliderLabel: {
        color: '#ccc',
    },
    sliderTrack: {
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
        position: 'relative',
        justifyContent: 'center',
    },
    sliderFill: {
        height: 4,
        backgroundColor: '#8A2BE2',
        borderRadius: 2,
    },
    sliderKnob: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        marginLeft: -10, // Center knob
    },
    // Calibration
    calibrationLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    calLabel: {
        color: '#666',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    // Notifications
    descriptionText: {
        color: '#888',
        lineHeight: 20,
        marginBottom: 12,
    },
    enableButton: {
        backgroundColor: '#1f1f23',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    enableButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    // VODs
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    // Tips
    tipsSection: {
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    tipsText: {
        color: '#666',
        textAlign: 'center',
    },
    linkText: {
        color: '#8A2BE2',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#000',
        borderTopWidth: 1,
        borderTopColor: '#1f1f23',
    },
    goLiveButton: {
        backgroundColor: '#8A2BE2', // Purple
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    goLiveText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
