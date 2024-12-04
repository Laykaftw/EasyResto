// Screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signIn, getCurrentUser } from '../Appwrite/appwrite';
import colors from '../styles/colors';

const LoginScreen = ({ navigation }) => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async () => {
        if (!form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setIsSubmitting(true);
        try {
            await signIn(form.email, form.password);
            const user = await getCurrentUser();

            if (user.role === 'student') {
                navigation.navigate('Menu');
            } else if (user.Role === 'canteenDirector') {
                navigation.navigate('UploadMenu');
            } else {
                Alert.alert('Login Error', 'Unknown user role');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>Log in to EasyResto</Text>
                    <TextInput
                        placeholder="Email"
                        value={form.email}
                        onChangeText={(e) => setForm({ ...form, email: e })}
                        style={styles.input}
                        keyboardType="email-address"
                    />
                    <TextInput
                        placeholder="Password"
                        value={form.password}
                        onChangeText={(e) => setForm({ ...form, password: e })}
                        style={styles.input}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        onPress={submit}
                        style={styles.button}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.buttonText}>{isSubmitting ? 'Logging in...' : 'Log In'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Signup')}
                        style={styles.linkContainer}
                    >
                        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
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

export default LoginScreen;