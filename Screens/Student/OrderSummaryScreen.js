import React, { useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import colors from '../../styles/colors';
import { createOrder } from '../../Appwrite/appwrite';

const OrderSummaryScreen = ({ navigation, route }) => {
    const { selectedItems } = route.params;
    const [orderId, setOrderId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Create a ref for QRCode
    const qrCodeRef = useRef(null);

    const handleConfirmOrder = async () => {
        setIsLoading(true);
        try {
            const order = await createOrder(selectedItems);
            console.log('Order created:', order.$id);
            setOrderId(order.$id);
            Alert.alert('Order Confirmed', 'Your preorder has been placed successfully.');
            // navigation.navigate('Menu');
        } catch (error) {
            Alert.alert('Error', 'Failed to place the order.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveQRCode = async () => {
        if (!orderId) return;

        // Use qrCodeRef.current to access the QRCode component
        qrCodeRef.current.toDataURL(async (data) => {
            const fileUri = FileSystem.documentDirectory + `${orderId}.png`;
            await FileSystem.writeAsStringAsync(fileUri, data, {
                encoding: FileSystem.EncodingType.Base64,
            });
            await Sharing.shareAsync(fileUri);
        });
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.MenuName}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Order Summary</Text>
            <FlatList
                data={selectedItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.$id}
            />
            <TouchableOpacity style={styles.confirmButton} onPress={() => { }} disabled={isLoading}>
                <Text style={styles.confirmButtonText}>Proceed to Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder} disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator color={colors.white} />
                ) : (
                    <Text style={styles.confirmButtonText}>Confirm Order</Text>
                )}
            </TouchableOpacity>
            {orderId && (
                <View style={styles.qrCodeContainer}>
                    <Text style={styles.qrCodeTitle}>Your Order QR Code</Text>
                    <QRCode
                        value={orderId}
                        size={200}
                        color={colors.black}
                        backgroundColor={colors.white}
                        getRef={qrCodeRef}  // Set the ref to qrCodeRef
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveQRCode}>
                        <Text style={styles.saveButtonText}>Save QR Code</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.primary,
    },
    title: {
        fontSize: 24,
        color: colors.white,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    itemContainer: {
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
    },
    itemDescription: {
        fontSize: 14,
        color: colors.gray600,
    },
    confirmButton: {
        padding: 16,
        backgroundColor: colors.secondary,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    confirmButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
    qrCodeContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    qrCodeTitle: {
        fontSize: 18,
        color: colors.white,
        marginBottom: 10,
    },
    saveButton: {
        padding: 16,
        backgroundColor: colors.secondary,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
});

export default OrderSummaryScreen;
