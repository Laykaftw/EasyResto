import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMenuItem, uploadFile, appwriteConfig } from '../../Appwrite/appwrite';
import * as ImagePicker from 'expo-image-picker';

const UploadMenuScreen = () => {
    const [form, setForm] = useState({
        menuName: '',
        serveDate: '',
        imageUri: null
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Please allow access to your photos to upload a menu image');
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!pickerResult.canceled) {
            setForm({ ...form, imageUri: pickerResult.assets[0].uri });
        }
    };

    const submit = async () => {
        if (!form.menuName || !form.serveDate) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setIsSubmitting(true);
        try {
            let imageFileId = null;
            if (form.imageUri) {
                imageFileId = await uploadFile(appwriteConfig.menuImagesBucketId, form.imageUri);
            }
            await createMenuItem(form.menuName, form.serveDate, imageFileId);
            Alert.alert('Success', 'Menu uploaded successfully');
            setForm({ menuName: '', serveDate: '', imageUri: null });
        } catch (error) {
            console.error('Error uploading menu:', error);
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View className="w-full justify-center min-h-[82vh] px-4 my-6">
                    <Text className="text-2xl text-white font-semibold mt-10">
                        Upload Menu
                    </Text>
                    <TextInput
                        placeholder="Menu Name"
                        value={form.menuName}
                        onChangeText={(e) => setForm({ ...form, menuName: e })}
                        className="mt-7 p-4 bg-white rounded"
                    />
                    <TextInput
                        placeholder="Serve Date"
                        value={form.serveDate}
                        onChangeText={(e) => setForm({ ...form, serveDate: e })}
                        className="mt-7 p-4 bg-white rounded"
                    />
                    <TouchableOpacity onPress={pickImage} className="mt-7 p-4 bg-gray-200 rounded justify-center items-center">
                        {form.imageUri ? (
                            <Image source={{ uri: form.imageUri }} className="w-full h-40" />
                        ) : (
                            <Text className="text-gray-600">Pick an Image</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={submit}
                        className="mt-7 p-4 bg-secondary rounded justify-center items-center"
                        disabled={isSubmitting}
                    >
                        <Text className="text-white text-lg font-semibold">
                            {isSubmitting ? 'Uploading...' : 'Upload Menu'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UploadMenuScreen;