// Screens/SignupScreen.js
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUser } from '../Appwrite/appwrite';
import colors from '../styles/colors';

const SignupScreen = ({ navigation }) => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        role: 'student', // Default role
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async () => {
        if (!form.email || !form.password || !form.name) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setIsSubmitting(true);
        try {
            await createUser(form.email, form.password, form.name, form.role);
            Alert.alert('Success', 'Account created successfully');
            navigation.navigate('Menu'); // Or appropriate screen
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
                    <Text style={styles.title}>Sign Up for EasyResto</Text>
                    <TextInput
                        placeholder="Name"
                        value={form.name}
                        onChangeText={(e) => setForm({ ...form, name: e })}
                        style={styles.input}
                    />
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
                        <Text style={styles.buttonText}>{isSubmitting ? 'Signing up...' : 'Sign Up'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        style={styles.linkContainer}
                    >
                        <Text style={styles.linkText}>Already have an account? Log In</Text>
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

export default SignupScreen;