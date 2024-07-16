
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import { StyleSheet } from 'react-native';
import { Color } from '../assets/colors/colors';
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import TabNavigator from './TabNavigator';
import ChatScreen from '../screens/ChatScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import { useSelector } from 'react-redux';
import { ModelOnlineStatus, ModelUser } from '../models/Models';
import ProfileScreen from '../screens/ProfileScreen';
import { useSocket } from '../utils/SocketManager';
import moment from 'moment';

const Stack = createStackNavigator();

export default function MyStack() {
  const socket = useSocket()
  const currentUser = useSelector((state: any): ModelUser => { return state.user })

  const setUserOnline = (isOnline:boolean) => {
    let onlineStatus: ModelOnlineStatus = {
      id: currentUser.id,
      isOnline: isOnline,
      lastSeen: moment().format("YYYY-MM-DD HH:mm:ss")
    }
    socket?.emitSendOnlineStatus(onlineStatus)
  }
  
  if (currentUser.id != -1){
    socket?.connectSocket()
    setUserOnline(true)
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Color.main_btn },
          headerTintColor: "white"
        }}
      >
       { (currentUser.id == -1) ? (
        <>
          <Stack.Screen
            options={{
              headerShown: true,
              title: "Welcome"
            }
            }
            name="WelcomeScreen"
            component={WelcomeScreen} />
          <Stack.Screen
            options={{ headerShown: false, title: "Signup" }}
            name="SignUpScreen"
            component={SignUpScreen} />
          <Stack.Screen
            options={{ headerShown: false, title: "Signin" }}
            name="SignInScreen"
            component={SignInScreen} />
        </>
        ) : (
        <>
          <Stack.Screen
            options={{ headerShown: false, title: "back" }}
            name="TabNavigator"
            component={TabNavigator} />
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
          />
          <Stack.Screen
            options={{
              title: "Edit Profile"
            }}
            name="EditProfileScreen"
            component={EditProfileScreen} />
          <Stack.Screen
                options={{
                    title: "Profile",
                }}
                name="ProfileScreen"
                component={ProfileScreen} />
        </>
        ) }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  imageFilter: {
    height: 20,
    width: 30,
    margin: 10
  }
  , body1: {
    fontSize: 30,
    fontWeight: "500",
    color: Color.main_text // Replace with your desired color
  },
  txtEdit: {
    padding: 5,
    color: "white"
  }
})