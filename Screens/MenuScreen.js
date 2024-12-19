import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getCurrentProfile, getCurrentUser, getMenuItems } from '../Appwrite/appwrite';
import colors from '../styles/colors';
import MenuItem from '../Components/MenuItem';

const MenuScreen = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const fetchMenuItems = async () => {
        try {
            const items = await getMenuItems();
            const itemsWithUrls = items.map((item) => ({
                ...item,
                imageUrl: item.MenuImage, // Use the URL directly
            }));
            setMenuItems(itemsWithUrls);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const handleMenuItemPress = async (item) => {
        try {
            const user = await getCurrentUser();
            if (user.labels?.includes('Director')) {
                // User is a Canteen Director
                navigation.navigate('ManageMenu', { menuItem: item });
            } else {
                // User is a Student
                navigation.navigate('PreOrder', { menuItem: item });
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.message);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <FlatList
                data={menuItems}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <MenuItem
                        item={item}
                        onSelect={() => handleMenuItemPress(item)}
                    />
                )}
            />

            <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('Profile')}
            >
                <Image
                    source={require('../assets/icons/profile.png')}
                    style={styles.profileIcon}
                />
                <Text style={styles.profileButtonText}>Go to Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileButton: {
        padding: 16,
        backgroundColor: colors.secondary,
        alignItems: 'center',
        margin: 16,
        borderRadius: 8,
    },
    profileButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
});

export default MenuScreen;