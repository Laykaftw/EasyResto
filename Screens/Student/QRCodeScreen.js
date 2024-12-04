// Screens/Student/QRCodeScreen.js
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import QRCodeGenerator from '../../Components/QRCodeGenerator';
import colors from '../../styles/colors';

const QRCodeScreen = ({ route }) => {
    const { orderId } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Order QR Code</Text>
            {orderId ? (
                <QRCodeGenerator orderId={orderId} />
            ) : (
                <ActivityIndicator size="large" color={colors.secondary} />
            )}
            <Text style={styles.instructions}>
                Please present this QR code at the canteen to collect your meal.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        color: colors.white,
        fontWeight: 'bold',
        marginVertical: 16,
    },
    instructions: {
        marginTop: 16,
        color: colors.white,
        textAlign: 'center',
        fontSize: 16,
    },
});

export default QRCodeScreen;