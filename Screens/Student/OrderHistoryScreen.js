// Screens/Student/OrderHistoryScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentUser, databases, appwriteConfig } from '../../Appwrite/appwrite';
import colors from '../../styles/colors';

const OrderHistoryScreen = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const user = await getCurrentUser();
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.ordersCollectionId,
                [Query.equal('userId', user.$id)]
            );
            setOrders(response.documents);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.orderItem}>
            <Text style={styles.orderDate}>{item.dateOfPurchase}</Text>
            <Text style={styles.orderStatus}>{item.status}</Text>
            <Text style={styles.orderTotal}>Total: ${item.total.toFixed(2)}</Text>
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
                <Text style={styles.title}>Order History</Text>
                <FlatList
                    data={orders}
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
    orderItem: {
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    orderDate: {
        fontSize: 16,
        color: colors.black,
    },
    orderStatus: {
        fontSize: 14,
        color: colors.gray600,
        marginVertical: 4,
    },
    orderTotal: {
        fontSize: 16,
        color: colors.black,
        fontWeight: 'bold',
    },
});

export default OrderHistoryScreen;