// Screens/CanteenDirector/ManageMenuScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMenuItems, databases, appwriteConfig } from '../../Appwrite/appwrite';
import colors from '../../styles/colors';

const ManageMenuScreen = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMenuItems = async () => {
        try {
            const items = await getMenuItems();
            setMenuItems(items);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const deleteMenuItem = async (id) => {
        try {
            await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.menusCollectionId, id);
            fetchMenuItems(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting menu item:', error);
        }
    };

    const confirmDelete = (id) => {
        Alert.alert(
            'Delete Menu Item',
            'Are you sure you want to delete this menu item?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: () => deleteMenuItem(id) },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.menuItem}>
            <View style={styles.menuInfo}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDelete(item.$id)}
            >
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ActivityIndicator size="large" color={colors.secondary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Manage Menu</Text>
                <FlatList
                    data={menuItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.$id}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: colors.primary,
        flex: 1,
    },
    container: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        color: colors.white,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    menuInfo: {
        flex: 1,
    },
    menuName: {
        fontSize: 18,
        color: colors.black,
        fontWeight: 'bold',
    },
    menuDescription: {
        fontSize: 14,
        color: colors.gray600,
    },
    deleteButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.secondary,
        borderRadius: 8,
    },
    deleteButtonText: {
        color: colors.white,
        fontSize: 16,
    },
});

export default ManageMenuScreen;