/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect } from 'react';
import MyStack from './navigation/MainStackNavigator';
import { AppState, StatusBar, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ModelOnlineStatus, ModelUser } from './models/Models';
import moment from 'moment';
import { useSocket } from './utils/SocketManager';
import { Color } from './assets/colors/colors';


function App(): React.JSX.Element {
  const socket = useSocket()
  const currentUser = useSelector((state: any): ModelUser => { return state.user })

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('Next AppState is: ', nextAppState);
      if (nextAppState === 'active') {
        // App is in foreground, connect socket
        if (currentUser.id != -1) {
          socket?.connectSocket()
          setUserOnline(true)
        }
      } else {
        // App is in background, disconnect socket
        if (currentUser.id != -1) {
          setUserOnline(false)
          //socket?.disconnectSocket();
        }
      }

    });

    return () => {
      subscription.remove();
    };
  }, []);// Empty dependency array ensures this effect runs only once

  const setUserOnline = (isOnline:boolean) => {
    let onlineStatus: ModelOnlineStatus = {
      id: currentUser.id,
      isOnline: isOnline,
      lastSeen: moment().format("YYYY-MM-DD HH:mm:ss")
    }
    socket?.emitSendOnlineStatus(onlineStatus)
  }

  return  (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content" // or "dark-content"
        backgroundColor = {Color.main_btn} // your desired color
        hidden={false} // to hide or show the status bar
      />
      {
        <MyStack />}
    </View>
  )
}

export default App;
