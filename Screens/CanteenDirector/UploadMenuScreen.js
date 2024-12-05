// Screens/UploadMenuScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    Alert,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../styles/colors';
import * as ImagePicker from 'expo-image-picker';

const UploadMenuScreen = ({ navigation }) => {
    const [menuItem, setMenuItem] = useState('');
    const [price, setPrice] = useState('');
    const [imageUri, setImageUri] = useState(null);

    const uploadMenu = () => {
        if (!menuItem || !price || !imageUri) {
            Alert.alert('Error', 'Please fill in all fields and select an image');
            return;
        }
        // Handle menu upload logic here
        Alert.alert('Success', 'Menu item uploaded successfully');
        setMenuItem('');
        setPrice('');
        setImageUri(null);
    };

    const pickImage = async () => {
        // Request permission to access media library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission Denied',
                'We need permission to access your photos to upload an image.'
            );
            return;
        }

        // Open image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.cancelled) {
            setImageUri(result.uri);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>Upload Menu Item</Text>
                    <TextInput
                        placeholder="Menu Item"
                        value={menuItem}
                        onChangeText={(text) => setMenuItem(text)}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Price"
                        value={price}
                        onChangeText={(text) => setPrice(text)}
                        style={styles.input}
                        keyboardType="numeric"
                    />

                    <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.image} />
                        ) : (
                            <Text style={styles.imagePickerText}>Select Image</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={uploadMenu} style={styles.button}>
                        <Text style={styles.buttonText}>Upload</Text>
                    </TouchableOpacity>
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
        justifyContent: 'center',
        minHeight: '82%',
        paddingHorizontal: 16,
        marginVertical: 24,
    },
    title: {
        fontSize: 24,
        color: colors.white,
        fontWeight: '600',
        marginTop: 40,
    },
    input: {
        marginTop: 28,
        padding: 16,
        backgroundColor: colors.white,
        borderRadius: 8,
    },
    imagePicker: {
        marginTop: 28,
        height: 200,
        backgroundColor: colors.white,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePickerText: {
        color: colors.textGray,
        fontSize: 18,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    button: {
        marginTop: 28,
        padding: 16,
        backgroundColor: colors.secondary,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
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

export default UploadMenuScreen; 