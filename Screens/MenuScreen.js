// Screens/Student/MenuScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMenuItems, storage } from '../../Appwrite/appwrite';
import colors from '../../styles/colors';

function MenuScreen() {
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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

        fetchMenuItems();
    }, []);

    const renderItem = ({ item }) => {
        const imageUrl = item.imageId
            ? storage.getFilePreview('YOUR_BUCKET_ID', item.imageId).href
            : null;

        return (
            <View style={styles.menuItem}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.menuImage} />
                ) : (
                    <View style={styles.menuImagePlaceholder}>
                        <Text>No Image</Text>
                    </View>
                )}
                <View style={styles.menuInfo}>
                    <Text style={styles.menuName}>{item.name}</Text>
                    <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ActivityIndicator size="large" color={colors.secondary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {menuItems.length === 0 ? (
                <View style={styles.noMenuContainer}>
                    <Text style={styles.noMenuText}>No menu available</Text>
                </View>
            ) : (
                <FlatList
                    data={menuItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.$id}
                    contentContainerStyle={styles.container}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: colors.primary,
        flex: 1,
    },
    container: {
        padding: 16,
    },
    menuItem: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: colors.white,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    menuImage: {
        width: 100,
        height: 100,
    },
    menuImagePlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuInfo: {
        flex: 1,
        padding: 8,
    },
    menuName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    menuDescription: {
        fontSize: 14,
        color: colors.gray600,
    },
    noMenuContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noMenuText: {
        color: colors.white,
        fontSize: 18,
    },
});

export default MenuScreen;