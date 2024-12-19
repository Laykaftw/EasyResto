// Screens/UploadMenuScreen.js
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    Alert,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../styles/colors';
import * as DocumentPicker from 'expo-document-picker';
import { createMenuItem, getCurrentUser, uploadFile } from '../../Appwrite/appwrite';

const UploadMenuScreen = ({ navigation }) => {
    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const user = await getCurrentUser();
    //             console.log("User Label", user.labels);
    //         } catch (error) {
    //             console.error("Failed to fetch user:", error);
    //         }
    //     };

    //     fetchUser();
    // }, []);
    const [menuItem, setMenuItem] = useState('');
    const [image, setImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const uploadMenu = async () => {
        if (!menuItem ||  !image) {
            Alert.alert('Error', 'Please fill in all fields and select an image');
            return;
        }

        setIsUploading(true);

        try {
            const user = await getCurrentUser();
            if (!user) {
                Alert.alert('Authentication Error', 'Please log in to continue.');
                navigation.navigate('Login');
                return;
            }

            // Create a new menu item using the createMenuItem function

            const date = new Date();
            await createMenuItem(menuItem, image, date);

            Alert.alert('Success', 'Menu item uploaded successfully');
            setMenuItem('');
            setImage(null);
        } catch (error) {
            console.error('Upload Error:', error);
            Alert.alert('Error', 'Failed to upload menu item: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const openPicker = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ["image/png", "image/jpg", "image/jpeg"],
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        } else {
            setTimeout(() => {
                Alert.alert("Document picked", JSON.stringify(result, null, 2));
            }, 100);
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

                    <TouchableOpacity onPress={openPicker} style={styles.imagePicker}>
                        {image ? (
                            <Image source={{ uri: image.uri }} style={styles.image} />
                        ) : (
                            <Text style={styles.imagePickerText}>Select Image</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={uploadMenu}
                        style={styles.button}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <Text style={styles.buttonText}>Upload</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Menu')}
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
        textAlignVertical: 'top', // For multiline TextInput
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
        height: 50,
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