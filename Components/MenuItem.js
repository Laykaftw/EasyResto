// Components/MenuItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../styles/colors';

const MenuItem = ({ item, onSelect }) => {
    return (
        <TouchableOpacity onPress={onSelect} style={styles.container}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderBottomColor: colors.gray100,
        borderBottomWidth: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.black,
    },
    description: {
        fontSize: 14,
        color: colors.gray600,
    },
    price: {
        marginTop: 8,
        fontSize: 16,
        color: colors.black,
    },
});

export default MenuItem;