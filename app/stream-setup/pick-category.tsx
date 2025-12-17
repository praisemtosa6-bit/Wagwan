
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const CARD_WIDTH = (width - 48) / COLUMN_COUNT; // 16px padding on sides + 16px gap

// Reusing assets from Browse page for consistency
const CATEGORIES = [
    { id: '1', name: 'Just Chatting', image: require('../../assets/images/categories/just_chatting.png') },
    { id: '2', name: 'Fortnite', image: require('../../assets/images/categories/fortnite.png') },
    { id: '3', name: 'League of Legends', image: require('../../assets/images/categories/league_of_legends.avif') },
    { id: '4', name: 'Valorant', image: require('../../assets/images/categories/valorant.png') },
    { id: '5', name: 'Call of Duty', image: require('../../assets/images/categories/cod.webp') },
    { id: '6', name: 'Minecraft', image: require('../../assets/images/categories/minecraft.png') },
    { id: '7', name: 'Malawian Music', image: require('../../assets/images/categories/malawian-music.jpg') },
    { id: '8', name: 'FIFA 24', image: require('../../assets/images/categories/just_chatting.png') }, // Fallback
];

export default function PickCategoryScreen() {
    const router = useRouter();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleNext = () => {
        if (selectedId) {
            router.push({
                pathname: '/stream-setup/setup',
                params: { categoryId: selectedId },
            });
        }
    };

    const renderItem = ({ item }: { item: typeof CATEGORIES[0] }) => {
        const isSelected = selectedId === item.id;
        return (
            <TouchableOpacity
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelectedId(item.id)}
                activeOpacity={0.7}
            >
                <Image source={item.image} style={styles.image} resizeMode="cover" />
                <View style={styles.cardOverlay}>
                    {isSelected && (
                        <View style={styles.checkIcon}>
                            <Ionicons name="checkmark-circle" size={24} color="#f0ede4" />
                        </View>
                    )}
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Top Bar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Text style={styles.closeText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Choose Category</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Search & Prompt */}
            <View style={styles.searchSection}>
                <Text style={styles.promptText}>What do you want to stream?</Text>
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.input}
                        placeholder="Search games and categories"
                        placeholderTextColor="#666"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Ionicons name="search" size={20} color="#888" />
                </View>
            </View>

            {/* Grid */}
            <FlatList
                data={CATEGORIES}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={COLUMN_COUNT}
                contentContainerStyle={styles.gridContent}
                columnWrapperStyle={styles.rowGap}
            />

            {/* Footer Action */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.nextButton, !selectedId && styles.nextButtonDisabled]}
                    disabled={!selectedId}
                    onPress={handleNext}
                >
                    <Text style={[styles.nextButtonText, !selectedId && styles.nextButtonTextDisabled]}>
                        Next
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f23',
    },
    closeButton: {
        paddingVertical: 8,
        width: 60,
    },
    closeText: {
        color: '#f0ede4',
        fontSize: 16,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSpacer: {
        width: 60,
    },
    searchSection: {
        padding: 16,
        gap: 12,
    },
    promptText: {
        color: 'white',
        fontSize: 22, // Large prominent text
        fontWeight: 'bold',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1f1f23',
        borderRadius: 8,
        paddingHorizontal: 16,
        height: 48,
        borderWidth: 1,
        borderColor: '#333',
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
    },
    // Grid
    gridContent: {
        padding: 16,
    },
    rowGap: {
        gap: 16,
        marginBottom: 16,
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * 1.4, // Portrait aspect ratio
        borderRadius: 12,
        backgroundColor: '#1f1f23',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
        position: 'relative',
    },
    cardSelected: {
        borderColor: '#8A2BE2', // Purple outline as requested
    },
    image: {
        width: '100%',
        height: '100%',
    },
    cardOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    cardTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    checkIcon: {
        position: 'absolute',
        top: -40, // Float above title
        right: 0,
        left: 0,
        alignItems: 'center',
    },
    // Footer
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#1f1f23',
        backgroundColor: '#000',
    },
    nextButton: {
        backgroundColor: '#8A2BE2', // Purple
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButtonDisabled: {
        backgroundColor: '#1f1f23',
    },
    nextButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    nextButtonTextDisabled: {
        color: '#666',
    },
});
