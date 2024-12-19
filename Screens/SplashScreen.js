import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

export default function SplashScreen({ navigation }) {
    useEffect(() => {
        // Navigate to Login after 3 seconds
        const timer = setTimeout(() => {
            navigation.replace('Login'); // Replace to avoid back navigation to splash
        }, 3000);

        return () => clearTimeout(timer); // Cleanup on component unmount
    }, [navigation]);

    return (
        <View style={styles.container}>
            {/* App Logo */}
            <Image
                source={require('../assets/icon.png')} // Replace with your logo
                style={styles.logo}
            />

            {/* App Title */}
            <Text style={styles.text}>Welcome to Resto ISET Nabeul!</Text>

            {/* Loading Indicator */}
            <ActivityIndicator
                size="large"
                color="#f5a623" // Orange color
                style={styles.loader}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a2e', // Dark blue background
    },
    logo: {
        width: 250, // Increased width
        height: 250, // Increased height
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        color: '#f5a623', // Orange text
        fontWeight: 'bold',
        marginBottom: 20,
    },
    loader: {
        marginTop: 20,
    },
});