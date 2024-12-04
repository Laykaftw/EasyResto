// Screens/Student/PreOrderScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMenuItems } from '../../Appwrite/appwrite';
import colors from '../../styles/colors';

const PreOrderScreen = ({ navigation }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
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

    const toggleSelectItem = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((i) => i.$id !== item.$id));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const proceedToOrderSummary = () => {
        navigation.navigate('OrderSummary', { selectedItems });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.menuItem,
                selectedItems.includes(item) && styles.selectedItem,
            ]}
            onPress={() => toggleSelectItem(item)}
        >
            <Text style={styles.menuName}>{item.name}</Text>
            <Text style={styles.menuDescription}>{item.description}</Text>
        </TouchableOpacity>
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
                {menuItems.length === 0 ? (
                    <Text style={styles.noMenuText}>No menu available</Text>
                ) : (
                    <>
                        <FlatList
                            data={menuItems}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.$id}
                        />
                        {selectedItems.length > 0 && (
                            <TouchableOpacity
                                style={styles.orderButton}
                                onPress={proceedToOrderSummary}
                            >
                                <Text style={styles.orderButtonText}>Proceed to Order Summary</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
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
        flex: 1,
        padding: 16,
    },
    menuItem: {
        padding: 16,
        backgroundColor: colors.white,
        borderRadius: 8,
        marginBottom: 16,
    },
    selectedItem: {
        backgroundColor: colors.secondary100,
    },
    menuName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 4,
    },
    menuDescription: {
        fontSize: 14,
        color: colors.gray600,
    },
    noMenuText: {
        color: colors.white,
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    orderButton: {
        padding: 16,
        backgroundColor: colors.secondary,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    orderButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
});

export default PreOrderScreen;