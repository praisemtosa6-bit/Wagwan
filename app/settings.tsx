
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const router = useRouter();
    const { signOut } = useAuth();

    const renderSectionHeader = (title: string) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    const renderItem = (icon: keyof typeof Ionicons.glyphMap, title: string, onPress?: () => void, hasArrow = true, color = '#f0ede4') => (
        <TouchableOpacity style={styles.itemRow} onPress={onPress}>
            <View style={styles.itemLeft}>
                <Ionicons name={icon} size={22} color={color} style={styles.itemIcon} />
                <Text style={[styles.itemText, { color }]}>{title}</Text>
            </View>
            {hasArrow && <Ionicons name="chevron-forward" size={20} color="#666" />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {renderSectionHeader('Account')}
                {renderItem('person-outline', 'Edit Profile', () => router.push('/settings/edit-profile'))}
                {renderItem('shield-checkmark-outline', 'Security & Privacy')}
                {renderItem('notifications-outline', 'Notifications')}

                {renderSectionHeader('Preferences')}
                <View style={styles.itemRow}>
                    <View style={styles.itemLeft}>
                        <Ionicons name="moon-outline" size={22} color="#f0ede4" style={styles.itemIcon} />
                        <Text style={styles.itemText}>Dark Mode</Text>
                    </View>
                    <Switch value={true} trackColor={{ false: '#333', true: '#014743' }} />
                </View>
                {renderItem('language-outline', 'Language')}

                {renderSectionHeader('Support')}
                {renderItem('help-circle-outline', 'Help Center')}
                {renderItem('document-text-outline', 'Terms of Service')}
                {renderItem('lock-closed-outline', 'Privacy Policy')}

                <View style={styles.logoutContainer}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={async () => {
                            try {
                                await signOut();
                                // router.replace('/auth/login'); // signOut typically redirects automatically or updates auth state which triggers a redirect if using protected routes, but explicit is okay too if we want to be sure.
                                // Actually better to just let auth state change handle it or redirect after.
                                router.replace('/auth/login');
                            } catch (err) {
                                console.error('Logout error:', err);
                            }
                        }}
                    >
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                    <Text style={styles.versionText}>Version 1.0.0 (Build 420)</Text>
                </View>
            </ScrollView>
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        paddingBottom: 40,
    },
    sectionHeader: {
        color: '#014743',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 8,
        paddingHorizontal: 16,
        textTransform: 'uppercase',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#111',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemIcon: {
        marginRight: 16,
        width: 24,
    },
    itemText: {
        color: '#f0ede4', // Secondary
        fontSize: 16,
    },
    logoutContainer: {
        marginTop: 40,
        paddingHorizontal: 16,
        gap: 16,
    },
    logoutButton: {
        backgroundColor: '#1f1f23',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    logoutText: {
        color: '#e91916',
        fontWeight: 'bold',
        fontSize: 16,
    },
    versionText: {
        color: '#666',
        textAlign: 'center',
        fontSize: 12,
    },
});
