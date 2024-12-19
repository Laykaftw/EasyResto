// Components/MenuItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import colors from '../styles/colors';

const MenuItem = ({ item, onSelect }) => {
    return (
        <TouchableOpacity onPress={onSelect} style={styles.container}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.details}>
                <Text style={styles.name}>{item.MenuName}</Text>
                <Text style={styles.date}>Serve Date: {new Date(item.ServeDate).toLocaleDateString()}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        borderBottomColor: colors.gray100,
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 16,
    },
    details: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.black,
    },
    date: {
        fontSize: 14,
        color: colors.gray600,
        marginTop: 4,
    },
});

export default MenuItem;
