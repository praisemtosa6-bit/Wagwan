import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface CreateBottomSheetProps {
    visible: boolean;
    onClose: () => void;
}

export default function CreateBottomSheet({ visible, onClose }: CreateBottomSheetProps) {
    const router = useRouter();

    const handleStreamIRL = () => {
        onClose();
        router.push('/stream/irl');
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.sheetContainer}>
                            <View style={styles.handle} />

                            <Text style={styles.headerTitle}>Create</Text>

                            <View style={styles.optionsContainer}>
                                <TouchableOpacity
                                    style={styles.optionItem}
                                    onPress={() => {
                                        onClose();
                                        router.push('/stream-setup/pick-category');
                                    }}
                                >
                                    <View style={[styles.iconContainer, { backgroundColor: '#9146FF' }]}>
                                        <Ionicons name="game-controller" size={24} color="white" />
                                    </View>
                                    <View style={styles.optionTextContainer}>
                                        <Text style={styles.optionTitle}>Stream Games</Text>
                                        <Text style={styles.optionSubtitle}>Play and stream games from your device</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#53535f" />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.optionItem} onPress={handleStreamIRL}>
                                    <View style={[styles.iconContainer, { backgroundColor: '#e91916' }]}>
                                        <Ionicons name="videocam" size={24} color="white" />
                                    </View>
                                    <View style={styles.optionTextContainer}>
                                        <Text style={styles.optionTitle}>Stream IRL</Text>
                                        <Text style={styles.optionSubtitle}>Broadcast wherever you are</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#53535f" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.optionItem}
                                    onPress={() => {
                                        onClose();
                                        router.push('/(tabs)/create');
                                    }}
                                >
                                    <View style={[styles.iconContainer, { backgroundColor: '#014743' }]}>
                                        <Ionicons name="stats-chart" size={24} color="white" />
                                    </View>
                                    <View style={styles.optionTextContainer}>
                                        <Text style={styles.optionTitle}>Creator Dashboard</Text>
                                        <Text style={styles.optionSubtitle}>Manage your stream and analytics</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#53535f" />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    sheetContainer: {
        backgroundColor: '#18181b',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
        minHeight: 300,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#3a3a3d',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    optionsContainer: {
        gap: 16,
        marginBottom: 24,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1f1f23',
        padding: 12,
        borderRadius: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    optionSubtitle: {
        color: '#adadb8',
        fontSize: 12,
    },
    cancelButton: {
        backgroundColor: '#26262c',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
