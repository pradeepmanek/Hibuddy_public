import { View, StyleSheet, Pressable, Image } from 'react-native'
import React from 'react'
import { Color } from '../assets/colors/colors'
import CSButton from '../components/CSButtons'
import CSText, { TextType } from '../components/CSText'

const WelcomeScreen = ({ navigation }: any) => {

    const handleLoginPress = () => {
        navigation.push("SignInScreen")
    }

    const handleRegisterPress = () => {
        navigation.push("SignUpScreen")
    }

    return (
        <View style={styles.container}>
            <Image
                style={[
                    styles.imgSearch
                ]}
                source={require('../assets/images/search.png')}
            />

            <CSText style={styles.text_welcome} type={TextType.body2}>
                Welcome to Hibuddy!
            </CSText>
            <CSText style={styles.text_discove_world} type={TextType.body3}>
                Connect Globally, One Conversation at a Time. Discover Hidden Stories, Every Search Unlocks a New Adventure!
            </CSText>

            <CSButton
                style={styles.btnSignup} title={'Sign up'}
                onPress={handleRegisterPress} />
            <Pressable onPress={handleLoginPress}>
                <CSText style={styles.text_register} type={TextType.body3}>
                    Sign in
                </CSText>
            </Pressable>
        </View>
    )
}

export default WelcomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.main_bg,
        alignItems: "center",
        justifyContent: "center"
    },
    text_welcome: {
        marginBottom: 10,
        textAlign: "center"
    },
    text_discove_world: {
        width: "70%",
        fontWeight: "400",
        color: Color.main_text_helper,
        marginBottom: 20,
        textAlign: "center"
    },
    text_register: {
        minHeight:48,
        minWidth:48,
        marginBottom: 10
    },
    imgSearch: {
        height: 200,
        width: 200,
        marginBottom: 50
    },
    btnSignup: {
        width: "80%",
        marginBottom: 30
    },
})