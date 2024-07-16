import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/lib/persistStore';
import store from './src/redux/store';
import { Provider } from 'react-redux';
import SocketProvider from './src/utils/SocketManager';
import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid } from 'react-native';

const persistor = persistStore(store)

const AppRedux = () => {

  const storeTokenData = async (token) => {
    try {
      await AsyncStorage.setItem('notification_token', token);
    } catch (error) {
      console.error('Failed to save data', error);
    }
  };

  useEffect(() => {
    // Get FCM token
    const getToken = async () => {
      const token = await messaging().getToken();
      storeTokenData(token)
      // Save the token to your server or wherever you need it
    };

    // Call requestUserPermission and then getToken
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    getToken();

    // Handle token refresh
    const unsubscribeOnTokenRefresh = messaging().onTokenRefresh(token => {
      storeTokenData(token)
    });

    // Clean up the listener on unmount
    return () => {
      unsubscribeOnTokenRefresh();
    };
  }, []);

  return (
    <SocketProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </SocketProvider>
  )
}

AppRegistry.registerComponent(appName, () => AppRedux);
