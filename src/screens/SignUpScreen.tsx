import { View, StyleSheet, Pressable, ActivityIndicator, Alert, Linking } from 'react-native'
import React, { useState } from 'react'
import { Color } from '../assets/colors/colors'
import CSIntput from '../components/CSIntput'
import CSButton from '../components/CSButtons'
import { setUser } from '../redux/slice/userSlice'
import { ModelUser, ValidationResult } from '../models/Models';
import { useDispatch } from 'react-redux'
import CSText, { TextType } from '../components/CSText'
import callApiWith from '../utils/Api'
import retrieveNotificationToken from '../utils/Function'

const SignUpScreen = ({ navigation, route }: any) => {
    const dispatch = useDispatch()
    const isFromSignin = route.params

    const [userName, setUserName] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, showIsLoading] = useState(false)

    const handleLoginPress = () => {
        if (isFromSignin) {
            navigation.pop()
        } else {
            navigation.push("SignInScreen", { isFromSignUp: true })
        }
    }

    const handlePrivacyPolicyPress = async () => {
        const url = 'https://hibuddy007.s3.eu-north-1.amazonaws.com/Hibuddy_Privacy_Policy.html';
        await Linking.openURL(url);
    }

    const handleSignupPress = async () => {

        const validation = validateForm();
        if (!validation.valid) {
            Alert.alert('Validation Error', validation.message);
            return;
        }

        showIsLoading(true)
        await retrieveNotificationToken().then(async notification_token => {
            //API Call
            await callSignupAPI(notification_token)
        }
        )
        showIsLoading(false)
    }

    const validateForm = (): ValidationResult => {
        if (!userName || userName.length < 5 || userName.includes(' ')) {
            return { valid: false, message: 'User name should be at least 5 characters long without space ' };
        }

        if (!name || name.length < 3) {
            return { valid: false, message: 'Name should be at least 3 characters long' };
        }

        if (!password || password.length < 6) {
            return { valid: false, message: 'Password should be at least 6 characters long' };
        }

        if (password !== confirmPassword) {
            return { valid: false, message: 'Confirm password should match the password' };
        }
        return { valid: true, message: '' };
    }

    const callSignupAPI = async (notification_token: string) => {
        const user: ModelUser = await callApiWith(
            `sign_up`,
            'POST',
            undefined,
            {
                name: name,
                username: userName,
                password: password,
                notification_token: notification_token
            })
        if (user) {
            dispatch(setUser(user))
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.view_BG2}>
            </View>
            <View style={styles.view_BG1}>
                <CSText type={TextType.body1}>
                    Sign up
                </CSText>
                <CSText style={styles.text_please_register} type={TextType.body3}>
                    Please enter details to sign up
                </CSText>
                <CSIntput
                    style={styles.text_input_user_name}
                    placeholder='User name'
                    onChangeText={setUserName}
                    value={userName} />
                <CSIntput
                    style={styles.text_input_name}
                    placeholder='Name'
                    onChangeText={setName}
                    value={name} />
                <CSIntput
                    secureTextEntry={true}
                    style={styles.text_input_password}
                    placeholder='Password'
                    onChangeText={setPassword}
                    value={password} />
                <CSIntput
                    secureTextEntry={true}
                    style={styles.text_input_confirm_password}
                    placeholder='Confirm Password'
                    onChangeText={setConfirmPassword}
                    value={confirmPassword} />
                <CSButton title={'Sign up'} onPress={handleSignupPress} />
                <View style={styles.view_bottom}>
                    <CSText style={styles.text_already_have} type={TextType.body3}>
                        Already have an account?
                    </CSText>
                    <Pressable onPress={handleLoginPress}>
                        <CSText style={styles.text_login} type={TextType.body3}>
                            Sign in
                        </CSText>
                    </Pressable>
                </View>
            </View>
            <View style={styles.view_BG2}>

                <View style={styles.view_bottom}>
                    <CSText style={styles.text_accept_policy} type={TextType.body3}>
                        by signing up you agree to our
                    </CSText>
                    <Pressable onPress={handlePrivacyPolicyPress}>
                        <CSText style={styles.text_login} type={TextType.body3}>
                            Privacy Policy.
                        </CSText>
                    </Pressable>
                </View>
                {/* <CSText style={styles.text_dont_forget} type={TextType.body3}>
                    *Don't forget your password; without it, you won't be able to access your account.
                </CSText> */}
            </View>
            {(isLoading) && <View style={styles.containerLoader}>
                <ActivityIndicator></ActivityIndicator>
            </View>}
        </View>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.main_bg,
        alignItems: "center",
        justifyContent: "center"
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
    view_BG1: {
        width: "90%",
    },
    view_BG2: {
        //flexDirection: "column-reverse",
        justifyContent: "flex-end",
        flex: 1,
        width: "90%",
    },
    text_please_register: {
        fontWeight: "400",
        color: Color.main_text,
        marginBottom: 20
    },
    text_input_user_name: {
        marginBottom: 20
    },
    text_input_name: {
        marginBottom: 20
    },
    text_input_password: {
        marginBottom: 20
    },
    text_input_confirm_password: {
        marginBottom: 50
    },
    view_bottom: {
        paddingTop: 5,
        alignItems: "center",
        flexDirection: "row",
    },
    text_login: {
        minWidth: 48,
        minHeight: 48,
        textAlignVertical: "center"
    },
    text_already_have: {
        fontWeight: "400",
        color: Color.main_text,

    },
    text_accept_policy: {
        justifyContent: "flex-end",
        fontWeight: "400",
        color: Color.main_text,
        paddingRight: 5

    },
    text_dont_forget: {
        color: Color.main_text,
        marginBottom: 20
    },
})