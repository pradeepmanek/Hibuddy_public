import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import { persistReducer } from 'redux-persist';
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
    key: "root",
    version: 1,
    storage: AsyncStorage
};

const reducer = combineReducers({
    user: userSlice
});

const persistedReducer = persistReducer(persistConfig, reducer);


const store=configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
})
export default store;