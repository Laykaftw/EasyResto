// Screens/MenuScreen.js
import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../styles/colors';

const menuItems = [
    { id: '1', name: 'Spaghetti Bolognese', price: '$12' },
    { id: '2', name: 'Chicken Caesar Salad', price: '$10' },
    { id: '3', name: 'Margherita Pizza', price: '$15' },
    // Add more menu items as needed
];

const MenuScreen = ({ navigation }) => {
    const renderItem = ({ item }) => (
        <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>{item.name}</Text>
            <Text style={styles.menuItemPrice}>{item.price}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>Today's Menu</Text>
                    <FlatList
                        data={menuItems}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.menuList}
                    />
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.linkContainer}
                    >
                        <Text style={styles.linkText}>Back to Home</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: colors.primary,
        flex: 1,
    },
    container: {
        width: '100%',
        minHeight: '82%',
        paddingHorizontal: 16,
        marginVertical: 24,
    },
    title: {
        fontSize: 28,
        color: colors.white,
        fontWeight: '600',
        marginBottom: 20,
    },
    menuList: {
        paddingBottom: 20,
    },
    menuItem: {
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    menuItemText: {
        fontSize: 18,
        color: colors.textDark,
        fontWeight: '500',
    },
    menuItemPrice: {
        fontSize: 16,
        color: colors.textGray,
        marginTop: 4,
    },
    linkContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    linkText: {
        color: colors.white,
        fontSize: 16,
    },
});

export default MenuScreen;