import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../lib/api';

export default function EditProfileScreen() {
    const router = useRouter();
    const { user } = useUser();
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (user) {
                // Initialize with Clerk data
                setUsername(user.username || user.fullName || '');

                // Fetch additional data (bio) from our backend
                const dbUser = await api.getUser(user.id);
                if (dbUser && dbUser.bio) {
                    setBio(dbUser.bio);
                }
                setInitialLoading(false);
            }
        };
        fetchUser();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);

        try {
            // 1. Update Clerk (Username) - Note: This requires Clerk API permissions or frontend helper
            // Updating username via Clerk frontend SDK might have restrictions. 
            // For now, we sync the "display" username to our DB, but ideally we update Clerk too.
            // user.update({ username }); // This often requires password confirmation or is restricted.
            // Let's assume we maintain our own 'username' in DB as the display name for now if Clerk fails.

            // 2. Update Backend (Bio, Username, Avatar)
            const updatedUser = await api.createUser({
                id: user.id,
                username: username,
                email: user.primaryEmailAddress?.emailAddress || '',
                avatarUrl: user.imageUrl,
                bio: bio,
            });

            if (updatedUser) {
                Alert.alert('Success', 'Profile updated successfully!');
                router.back();
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#014743" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={loading} style={styles.saveButton}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#014743" />
                    ) : (
                        <Text style={styles.saveText}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Enter username"
                            placeholderTextColor="#666"
                            autoCapitalize="none"
                        />
                        <Text style={styles.helperText}>This is how you'll appear to other users.</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Tell us about yourself..."
                            placeholderTextColor="#666"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            maxLength={160}
                        />
                        <Text style={styles.helperText}>{bio.length}/160 characters</Text>
                    </View>
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
    center: {
        justifyContent: 'center',
        alignItems: 'center',
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#f0ede4',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
    },
    saveText: {
        color: '#050505',
        fontWeight: 'bold',
        fontSize: 14,
    },
    content: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        color: '#f0ede4',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1f1f23',
        color: 'white',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    textArea: {
        height: 100,
    },
    helperText: {
        color: '#666',
        fontSize: 12,
        marginTop: 6,
    },
});
