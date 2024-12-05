// Screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { getCurrentProfile, getCurrentUser, updateUserProfile, uploadFile, logout } from '../Appwrite/appwrite';
import colors from '../styles/colors';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentProfile();
        setUser(currentUser);
        setName(currentUser.Name);
        setEmail(currentUser.Email);
        setAvatar(currentUser.Avatar);
        // console.log('User:', currentUser);
      } catch (error) {
        console.error('Error fetching user:', error);
        Alert.alert('Error', 'Failed to fetch user information.');
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setUser(null);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      await updateUserProfile({ name, email });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={isLoggingOut}>
          <Image
            source={require('../assets/icons/logout.png')} // Ensure you have a logout icon in assets
            style={styles.logoutIcon}
          />
        </TouchableOpacity>
          <Image
            source={{ uri: avatar.uri || avatar }}
            resizeMode='cover'
            style={styles.avatar}
          />
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
        <TouchableOpacity
          onPress={handleUpdateProfile}
          style={styles.button}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.primary,
    flex: 1,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 24,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  logoutIcon: {
    width: 24,
    height: 24,
    tintColor: colors.white,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  input: {
    marginTop: 28,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    width: '100%',
  },
  button: {
    marginTop: 28,
    padding: 16,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProfileScreen;