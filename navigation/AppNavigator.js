// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../Screens/LoginScreen';
import SignupScreen from '../Screens/SignupScreen';

// Student Screens
import MenuScreen from '../Screens/MenuScreen';
import PreOrderScreen from '../Screens/Student/PreOrderScreen';
import QRCodeScreen from '../Screens/Student/QRCodeScreen';
import OrderSummaryScreen from '../Screens/Student/OrderSummaryScreen';
import OrderHistoryScreen from '../Screens/Student/OrderHistoryScreen';

// Canteen Director Screens
import UploadMenuScreen from '../Screens/CanteenDirector/UploadMenuScreen';
import ManageMenuScreen from '../Screens/CanteenDirector/ManageMenuScreen';

// Profile Screen
import ProfileScreen from '../Screens/ProfileScreen';
import SplashScreen from '../Screens/SplashScreen';

const Stack = createStackNavigator();

function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash">
                <Stack.Screen name='Splash' component={SplashScreen} options={{ headerShown: false }} />
                {/* Authentication */}
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Signup" component={SignupScreen} />

                {/* Student Screens */}
                <Stack.Screen name="Menu" component={MenuScreen} />
                <Stack.Screen name="PreOrder" component={PreOrderScreen} />
                <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} />
                <Stack.Screen name="QRCode" component={QRCodeScreen} />
                <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />

                {/* Canteen Director Screens */}
                <Stack.Screen name="UploadMenu" component={UploadMenuScreen} />
                <Stack.Screen name="ManageMenu" component={ManageMenuScreen} />

                {/* Profile Screen */}
                <Stack.Screen name="Profile" component={ProfileScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;