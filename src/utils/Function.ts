import AsyncStorage from "@react-native-async-storage/async-storage";

const retrieveNotificationToken = async ():Promise<string> => {
    try {
      const value = await AsyncStorage.getItem("notification_token");
      if (value !== null) {
        return value;
      }
    } catch (error) {
      console.error('Failed to load data', error);
    }
    return "";
  };

  export default retrieveNotificationToken