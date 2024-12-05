// Screens/MenuScreen.js
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../styles/colors';
import { getMenuItems, storage, appwriteConfig } from '../Appwrite/appwrite';

const MenuScreen = ({ navigation }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("MenuScreen rendered"); // Check if the component renders
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        console.log("fetchMenuItems called"); // Debugging line to ensure function is called

        try {
            const items = await getMenuItems();
            console.log("Fetched items:", items); // Debugging line
            if (items && items.length > 0) {
                setMenuItems(items);
            } else {
                Alert.alert('No Menu Items', 'No menu items available');
            }
        } catch (error) {
            console.error('Error fetching menu items:', error);
            Alert.alert('Error', 'Failed to load menu items');
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (fileId) => {
        console.log("Fetching image URL for:", fileId); // Debugging line
        return storage.getFilePreview(appwriteConfig.storageId, fileId).toString();
    };

    const renderItem = ({ item }) => (
        <View style={styles.menuItem}>
            <Image
                source={{ uri: getImageUrl(item.imageId) }}
                style={styles.menuItemImage}
            />
            <Text style={styles.menuItemText}>{item.name}</Text>
            <Text style={styles.menuItemDescription}>{item.description}</Text>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.white} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                data={menuItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.$id}
                contentContainerStyle={styles.container}
            />
            
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: colors.primary,
        flex: 1,
    },
    container: {
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItem: {
        backgroundColor: colors.white,
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
        padding: 16,
    },
    menuItemImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    menuItemText: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.textDark,
        marginTop: 12,
    },
    menuItemDescription: {
        fontSize: 16,
        color: colors.textGray,
        marginTop: 8,
    },
});

export default MenuScreen;
