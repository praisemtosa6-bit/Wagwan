
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateScreen() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');

    const handleGoLive = () => {
        // Mock go live logic
        console.log('Going live with:', { title, category, tags });
        // In a real app, this might navigate to a camera view or show stream key
        alert('Stream details updated! Ready to go live from OBS.');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Stream Manager</Text>
                    </View>

                    <SignedOut>
                        <View style={styles.authContainer}>
                            <Ionicons name="videocam-off" size={64} color="#333" style={{ marginBottom: 16 }} />
                            <Text style={styles.authTitle}>Start Streaming</Text>
                            <Text style={styles.authSubtitle}>Log in to access your Creator Dashboard and go live!</Text>
                            <TouchableOpacity style={styles.authButton} onPress={() => router.push('/auth/login')}>
                                <Text style={styles.authButtonText}>Log In to Stream</Text>
                            </TouchableOpacity>
                        </View>
                    </SignedOut>

                    <SignedIn>
                        {/* Preview Section */}
                        <View style={styles.previewContainer}>
                            <View style={styles.previewBox}>
                                <View style={styles.offlinePlaceholder}>
                                    <Ionicons name="videocam-off-outline" size={48} color="#666" />
                                    <Text style={styles.offlineText}>Offline</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.editThumbnailBtn}>
                                <Ionicons name="image-outline" size={20} color="white" />
                                <Text style={styles.editThumbnailText}>Edit Thumbnail</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Form Section */}
                        <View style={styles.formContainer}>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Stream Title</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter a catchy title..."
                                    placeholderTextColor="#666"
                                    value={title}
                                    onChangeText={setTitle}
                                    maxLength={140}
                                />
                                <Text style={styles.charCount}>{title.length}/140</Text>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Category / Game</Text>
                                <TouchableOpacity style={styles.selectInput}>
                                    <Text style={category ? styles.selectText : styles.placeholderText}>
                                        {category || 'Select a category'}
                                    </Text>
                                    <Ionicons name="chevron-down" size={20} color="#666" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Tags</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. English, NoBackseating (comma separated)"
                                    placeholderTextColor="#666"
                                    value={tags}
                                    onChangeText={setTags}
                                />
                            </View>

                            <View style={styles.notificationBox}>
                                <View style={styles.notificationHeader}>
                                    <Ionicons name="notifications-outline" size={20} color="#f0ede4" />
                                    <Text style={styles.notificationTitle}>Go Live Notification</Text>
                                </View>
                                <Text style={styles.notificationPreview}>
                                    {title ? `shipmark is live: ${title}` : 'shipmark is live!'}
                                </Text>
                            </View>

                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionContainer}>
                            <TouchableOpacity style={styles.goLiveButton} onPress={handleGoLive}>
                                <Text style={styles.goLiveText}>Go Live</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => {
                                    console.log('Attempting navigation to /stream-setup/pick-category');
                                    router.push('/stream-setup/pick-category');
                                }}
                            >
                                <Text style={styles.secondaryButtonText}>Stream Games</Text>
                            </TouchableOpacity>
                        </View>
                    </SignedIn>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f23',
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    previewContainer: {
        padding: 16,
        alignItems: 'center',
    },
    previewBox: {
        width: '100%',
        height: 200,
        backgroundColor: '#111',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    offlinePlaceholder: {
        alignItems: 'center',
        gap: 8,
    },
    offlineText: {
        color: '#666',
        fontWeight: '600',
    },
    editThumbnailBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1f1f23',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
    },
    editThumbnailText: {
        color: '#f0ede4',
        fontWeight: '600',
    },
    formContainer: {
        padding: 16,
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        color: '#f0ede4',
        fontWeight: 'bold',
        fontSize: 14,
    },
    input: {
        backgroundColor: '#1f1f23',
        borderRadius: 8,
        padding: 12,
        color: 'white',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    selectInput: {
        backgroundColor: '#1f1f23',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    selectText: {
        color: 'white',
        fontSize: 16,
    },
    placeholderText: {
        color: '#666',
        fontSize: 16,
    },
    charCount: {
        alignSelf: 'flex-end',
        color: '#666',
        fontSize: 12,
    },
    notificationBox: {
        backgroundColor: '#1f1f23',
        borderRadius: 8,
        padding: 16,
        gap: 8,
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    notificationTitle: {
        color: '#f0ede4',
        fontWeight: 'bold',
    },
    notificationPreview: {
        color: '#adadb8',
        fontStyle: 'italic',
    },
    actionContainer: {
        padding: 16,
        gap: 16,
    },
    goLiveButton: {
        backgroundColor: '#e91916', // Red for Go Live
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
    secondaryButton: {
        backgroundColor: '#8A2BE2', // Purple to match Stream Wizard
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    authContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 60,
    },
    authTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 16,
    },
    authSubtitle: {
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    authButton: {
        backgroundColor: '#014743',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
    },
    authButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
