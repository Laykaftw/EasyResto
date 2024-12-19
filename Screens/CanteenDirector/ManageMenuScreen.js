import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import colors from '../../styles/colors';
import { updateMenuItem, deleteMenuItem } from '../../Appwrite/appwrite';
import DatePicker from 'react-native-date-picker';

const ManageMenuScreen = ({ route, navigation }) => {
    const { menuItem } = route.params;

    const [menuName, setMenuName] = useState('');
    const [serveDate, setServeDate] = useState(null);
    const [menuImageUri, setMenuImageUri] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const refreshData = useCallback(() => {
        if (menuItem) {
            setMenuName(menuItem.MenuName);
            setServeDate(menuItem.ServeDate);
            setMenuImageUri(menuItem.MenuImage || null); 
        }
    }, [menuItem]);

    useFocusEffect(
        useCallback(() => {
            refreshData();
        }, [refreshData])
    );

    const pickImage = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*',
                copyToCacheDirectory: true,
            });

            if (result.type === 'success') {
                setMenuImageUri(result.uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick an image.');
        }
    };

    const handleUpdate = async () => {
        try {
            setIsUpdating(true);
    
            const updatedData = {
                MenuName: menuName,
                ServeDate: serveDate,
                ...(menuImageUri && { MenuImage: menuImageUri }),
            };
    
            // Update the menu item in the database
            await updateMenuItem(menuItem.$id, updatedData);
    
            // Update local state with the updated values
            setMenuName(updatedData.MenuName);
            setServeDate(updatedData.ServeDate);
            setMenuImageUri(updatedData.MenuImage || null); // Clear the image if not updated
    
            Alert.alert('Success', 'Menu item updated successfully!');
            navigation.goBack(); // Return to the previous screen
        } catch (error) {
            Alert.alert('Error', 'Failed to update the menu item.');
        } finally {
            setIsUpdating(false);
        }
    };
    

    const handleDelete = async () => {
        try {
            if (!menuItem.$id) {
                throw new Error('Menu item ID is missing');
            }

            await deleteMenuItem(menuItem.$id);
            Alert.alert('Success', 'Menu item deleted successfully!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to delete the menu item.');
            console.error('Error deleting menu item:', error);
        }
    };

    const confirmDelete = () => {
        Alert.alert(
            'Delete Menu Item',
            'Are you sure you want to delete this menu item?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: handleDelete },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Menu Item</Text>
            <TextInput
                style={styles.input}
                placeholder="Menu Name"
                value={menuName}
                onChangeText={setMenuName}
            />
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                <Text style={styles.buttonText}>
                    {menuImageUri ? 'Change Image' : 'Pick an Image'}
                </Text>
            </TouchableOpacity>
            {menuImageUri && (
                <Image
                    source={{ uri: menuImageUri }}
                    style={styles.imagePreview}
                    resizeMode="contain"
                />
            )}
            <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdate}
                disabled={isUpdating}
            >
                <Text style={styles.buttonText}>
                    {isUpdating ? 'Updating...' : 'Update'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={confirmDelete}
                disabled={isUpdating}
            >
                <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 16,
    },
    input: {
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        color: colors.black,
    },
    imagePickerButton: {
        backgroundColor: colors.secondary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    updateButton: {
        backgroundColor: colors.secondary,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    deleteButton: {
        backgroundColor: colors.red,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
});

export default ManageMenuScreen;
