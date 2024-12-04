// MenuScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Image } from 'react-native';
import { getMenuItems, storage } from '../../Appwrite/appwrite';

function MenuScreen() {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const items = await getMenuItems();
                setMenuItems(items);
            } catch (error) {
                console.error('Error fetching menu items:', error);
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

    return (
        <FlatList
            data={menuItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.$id}
            contentContainerStyle={styles.container}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    menuItem: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#FFF',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
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
        color: '#555',
    },
});

export default MenuScreen;