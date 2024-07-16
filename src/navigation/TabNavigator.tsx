import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Color } from '../assets/colors/colors';
import SearchScreen from '../screens/SearchScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();


function TabNavigator() {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      headerStyle: { backgroundColor: Color.main_btn },
      headerTintColor: "white",
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'SearchScreen') {
          iconName = focused
            ? require('../assets/images/Tabbar/imgTabSearchSelected.png')
            : require('../assets/images/Tabbar/imgTabSearch.png')
        } else if (route.name === 'ChatListScreen') {
          iconName = focused
            ? require('../assets/images/Tabbar/imgTabMsgSelected.png')
            : require('../assets/images/Tabbar/imgTabMsg.png')
        } else if (route.name === 'ProfileScreen') {
          iconName = focused
            ? require('../assets/images/Tabbar/imgTabProfileSelected.png')
            : require('../assets/images/Tabbar/imgTabProfile.png')
        }

        // You can return any component that you like here!
        return <Image source={iconName} style={styles.icon} resizeMode="contain" />;
      },
      tabBarActiveTintColor: Color.main_text,
      tabBarInactiveTintColor: Color.main_text_helper,
    })}
    >
      <Tab.Screen
                options={{ 
                    headerShown: false, 
                    title: "Search" 
                }}
                name="SearchScreen"
                component={SearchScreen} />
      <Tab.Screen
          name="ChatListScreen"
          component={ChatListScreen}
          options={{
            headerShown: true,
            title: "Chat List"
          }}
        />
        <Tab.Screen
                options={({ navigation, route }) => ({
                    title: "Profile"
                })}
                name="ProfileScreen"
                component={ProfileScreen} />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
})

export default TabNavigator