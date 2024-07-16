import { Alert, Animated, Button, Easing, Pressable, StyleSheet, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Color } from '../assets/colors/colors'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { ModelChatList, ModelUser } from '../models/Models';
import CSText, { TextType } from '../components/CSText';
import callApiWith from '../utils/Api';

const SearchScreen = ({ navigation }: any) => {
    const currentUser = useSelector((state: any): ModelUser => { return state.user })
    const spinValue = useRef(new Animated.Value(0)).current;
    const [isSearching, setIsSearching] = useState(false)
    const stopAnimationa = useRef(false);

    const handleOnPressSearch = () => {
        //API Call
        callSearchNewChatAPI()
    }

    const startAnimation = () => {
        spinValue.setValue(0);
        setIsSearching(true)
        Animated.timing(
            spinValue,
            {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start(() => {
            if (stopAnimationa.current == false) {
                startAnimation();
            }
        });
    };
    const stopAnimation = () => {
        stopAnimationa.current = true
        setIsSearching(false)
    };
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const redirectToChatScreen = (modelChat: ModelChatList) => {
        navigation.push('ChatScreen', { modelChatListParam: modelChat });
    }

    const callSearchNewChatAPI = async () => {
        startAnimation()
        const chatList: ModelChatList = await callApiWith(
            `search_new_chat`,
            'POST',
            currentUser.token,
            {
                user_id: currentUser.id,
                chat_with_user_id: 33,
            })
        setTimeout(() => {
            stopAnimation()
            if (chatList) {
                redirectToChatScreen(chatList)
            }
        }, 2000)
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.view_BG1}>
            </View>

            <View style={styles.view_BG2}>
                <Animated.Image
                    style={[
                        { transform: [{ rotate: spin }] },
                        styles.imgSearch
                    ]}
                    source={require('../assets/images/search.png')}
                />
                <Pressable onPress={handleOnPressSearch}>
                    <CSText style={styles.text_search} type={TextType.body2}>
                        {isSearching ? "Searching..." : "Search"}
                    </CSText>
                </Pressable>
            </View>
            <View style={styles.view_BG3}>
            </View>
        </SafeAreaView>
    )
}

export default SearchScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.main_bg,
    },
    view_BG1: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"

    },
    view_BG2: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    view_BG3: {
        flex: 1,
    },
    imgMenu: {
        height: 36,
        width: 40,
        margin: 10
    },
    imgSearch: {
        height: 100,
        width: 100,
    },
    text_search: {
        marginTop: 20,
    },
    text_cancel: {
        marginTop: 10,
        fontSize: 15,
        color: "red"
    }
})