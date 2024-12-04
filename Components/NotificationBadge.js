// Components/NotificationBadge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function NotificationBadge({ count }) {
    if (count <= 0) {
        return null;
    }

    return (
        <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{count}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badgeContainer: {
        position: 'absolute',
        right: -10,
        top: -10,
        backgroundColor: 'red',
        borderRadius: 15,
        minWidth: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    badgeText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default NotificationBadge;