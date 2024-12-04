// Screens/Student/OrderSummaryScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createOrder } from '../../Appwrite/appwrite';
import colors from '../../styles/colors';

const OrderSummaryScreen = ({ navigation, route }) => {
    const { selectedItems } = route.params;
    const total = selectedItems.reduce((sum, item) => sum + item.price, 0);

    const onConfirmOrder = async () => {
        try {
            const orderId = await createOrder(selectedItems, total);
            navigation.navigate('QRCode', { orderId });
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.orderItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Order Summary</Text>
                <FlatList
                    data={selectedItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.$id}
                />
                <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
                <TouchableOpacity
                    onPress={onConfirmOrder}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Confirm Order</Text>
                </TouchableOpacity>
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
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 24,
        color: colors.white,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    itemName: {
        fontSize: 18,
        color: colors.black,
    },
    itemPrice: {
        fontSize: 18,
        color: colors.black,
    },
    total: {
        fontSize: 20,
        color: colors.white,
        fontWeight: 'bold',
        marginTop: 16,
    },
    button: {
        padding: 16,
        backgroundColor: colors.secondary,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
});

export default OrderSummaryScreen;