// Screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentUser, logout } from '../Appwrite/appwrite';
import colors from '../styles/colors';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
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
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: user.avatar }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        {/* Additional user information or statistics can go here */}
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
  userName: {
    fontSize: 24,
    color: colors.white,
    fontWeight: 'bold',
    marginTop: 16,
  },
  // Add more styles as needed
});

export default ProfileScreen;