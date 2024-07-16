import { ActivityIndicator, Alert, Image, Linking, Pressable, SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Color } from '../assets/colors/colors'
import CSIntput from '../components/CSIntput'
import CSButton from '../components/CSButtons'
import { useSelector } from 'react-redux'
import { ModelUser } from '../models/Models'
import { useDispatch } from 'react-redux'
import { removeUser, setUser } from '../redux/slice/userSlice'
import CSText, { TextType } from '../components/CSText'
import callApiWith from '../utils/Api'
import { base_url } from '../utils/constant'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

type RouteParams = {
    otherUserId?: number,
    isYouBlocked?: boolean
    from?: string
};

const ProfileScreen = ({ navigation, route }: any) => {
    let { otherUserId = -1, isYouBlocked = false, from = "" }: RouteParams = route.params || {}
    const [otherUser, setOtherUser] = useState<ModelUser | null>(null);
    const currentUser = useSelector((state: any): ModelUser => { return state.user })
    const [isLoading, showIsLoading] = useState(false)
    const dispatch = useDispatch()

    useFocusEffect(
        React.useCallback(() => {
            from = route.params?.from || ""
            if (from == "EditProfileScreen") {
                //API Call
                callProfileAPI(currentUser.id)
            }
            return (() => {
                route.params = {}
            })

        }, [route.params])

    );

    useEffect(() => {
        if (otherUserId != -1) {
            callProfileAPI(otherUserId)
        }
    }, []);

    const handleEditProfile = (navigation: any) => {
        navigation.navigate("EditProfileScreen")
    }

    useEffect(() => {
        {
            (otherUserId == -1) &&

                navigation.setOptions({
                    headerRight: () => (
                        <Pressable
                            onPress={() => { return handleEditProfile(navigation) }}
                        >
                            <CSText style={styles.txtEdit} type={TextType.body3}>Edit</CSText>
                        </Pressable>
                    )
                });

        }
    }, [navigation, handleEditProfile]);


    const callLogoutAPI = async () => {
        const response = await callApiWith(
            `logout`,
            'POST',
            currentUser.token,
            {
                id: currentUser.id,
            })
        if (response) {
            await AsyncStorage.removeItem('notification_token');
            dispatch(removeUser(null))
        }
        showIsLoading(false)
    }

    const showAlert = (title: string, description: string, onPress: () => void) => {
        Alert.alert(title, description, [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Yes', onPress: onPress
            },
        ]);
    }
    const handleLogout = () => {
        showAlert('Logout', "Are you sure ?", (() => {
            showIsLoading(true)
            //API Call
            callLogoutAPI()
        }))
    }

    const handlePrivacyPolicy = async () => {
        const url = 'https://hibuddy007.s3.eu-north-1.amazonaws.com/Hibuddy_Privacy_Policy.html';
        await Linking.openURL(url);
    }

    const handleBlock = () => {
        showAlert('Block', "Are you sure ?", (() => {
            showIsLoading(true)
            //API Call
            callBlackAPI()
        }))
    }

    const handleUnBlock = () => {
        showAlert('Unblock', "Are you sure ?", (() => {
            showIsLoading(true)
            //API Call
            callUnblackAPI()
        }))
    }

    const callProfileAPI = async (id: number) => {
        showIsLoading(true)
        const user: ModelUser = await callApiWith(
            `profile/${id}`,
            undefined,
            currentUser.token)
        if (id == currentUser.id) {
            dispatch(setUser(user))
        } else {
            setOtherUser(user)
        }
        showIsLoading(false)
    }

    const callBlackAPI = async () => {
        showIsLoading(true)
        const response: [] = await callApiWith(
            `block_user`,
            "POST",
            currentUser.token,
            {
                user_id: currentUser.id,
                block_user_id: otherUserId,
            })
        if (response) {
            navigation.navigate('ChatScreen', { isYouBlocked: true })
        }
        showIsLoading(false)
    }

    const callUnblackAPI = async () => {
        showIsLoading(true)
        const response: [] = await callApiWith(
            `unblock_user`,
            "POST",
            currentUser.token,
            {
                user_id: currentUser.id,
                block_user_id: otherUserId,
            })
        if (response) {
            navigation.navigate('ChatScreen', { isYouBlocked: false })
        }
        showIsLoading(false)
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image source={(otherUser?.image != null)
                ? { uri: `${base_url}/uploads/${otherUser.image}` }
                : ((currentUser.image != null)
                    ? { uri: `${base_url}/uploads/${currentUser.image}` }
                    : require('../assets/images/imgDefaultProfile.png'))
            }
                style={styles.imgProfileBG} />
            <View style={styles.viewProfileBack}>
            </View>
            <Image source={(otherUser?.image != null)
                ? { uri: `${base_url}/uploads/${otherUser.image}` }
                : ((currentUser.image != null)
                    ? { uri: `${base_url}/uploads/${currentUser.image}` }
                    : require('../assets/images/imgDefaultProfile.png'))
            }
                style={styles.imgProfile} />
            <CSText type={TextType.body3}>
                {(otherUserId == -1) ? currentUser.username : otherUser?.username}
            </CSText>
            <ViewProfileOption
                value={(otherUserId == -1) ? currentUser.username : otherUser?.username ?? ""}
                title={'Username'}
                editable={false}
            />
            <ViewProfileOption
                value={(otherUserId == -1) ? currentUser.name : otherUser?.name ?? ""}
                title={'Name'}
                editable={false}
            />
            {(isLoading) && <View style={styles.containerLoader}>
                <ActivityIndicator></ActivityIndicator>
            </View>}
            {(otherUserId == -1) ?
            (
            <View style={styles.viewBG2}>
                <CSButton
                    style={{ width: "90%",marginBottom:20}}
                    title='Privacy Policy'
                    onPress={handlePrivacyPolicy} />
                <CSButton
                    style={{ width: "90%"}}
                    title='Logout'
                    onPress={handleLogout} />

            </View>
            ) :
            (
            <View style={styles.viewBG2}>
                <CSButton
                    style={{ width: "90%" }}
                    title={isYouBlocked
                            ? 'Unblock'
                            : 'Block'
                    }
                    onPress={isYouBlocked
                            ? handleUnBlock
                            : handleBlock
                    } />
            </View>
            )}
        </SafeAreaView >
    )
}

export default ProfileScreen

export const ViewProfileOption = (props: { title: string, value: string, onChange?: (text: string) => void, editable: boolean }) => {
    return (
        <View style={styles.viewProfileOption}>
            <CSText type={TextType.body3}>
                {props.title}
            </CSText>
            <CSIntput
                style={styles.text_input_password}
                onChangeText={props.onChange}
                value={props.value}
                editable={props.editable}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    txtEdit: {
        padding: 5,
        color: "white"
    },
    container: {
        flex: 1,
        backgroundColor: Color.main_bg,
        alignItems: "center"
    },
    containerLoader: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    viewBG1: {
        height: "25%",
        width: "100%",
    },
    viewBG2: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        paddingBottom: 20,
        backgroundColor: Color.main_text_helper
    },
    viewProfileBack: {
        height: "25%",
        width: "100%",
        backgroundColor: Color.main_btn,
        opacity: 0.5
    },
    imgProfileBG: {
        position: "absolute",
        height: "25%",
        width: "100%",
        //resizeMode: "cover"
    },
    imgProfile: {
        width: 120,
        height: 120,
        borderRadius: 60,
        bottom: 60,
        marginBottom: -60,
        borderWidth: 2,
        borderColor: "white",
    },
    text_input_password: {
        marginTop: 5,
        marginBottom: 30,
    },
    viewProfileOption: {
        width: "90%",
    }
})
