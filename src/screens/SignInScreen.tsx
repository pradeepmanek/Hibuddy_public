import { View, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native'
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

const SignInScreen = ({ navigation, route }: any) => {
  const dispatch = useDispatch()
  const isFromSignUp = route.params

  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, showIsLoading] = useState(false)

  const handleLoginPress = async () => {
    const validation = validateForm();
    if (!validation.valid) {
      Alert.alert('Validation Error', validation.message);
      return;
    }
    showIsLoading(true)
    await retrieveNotificationToken().then( async notification_token => 
      {
        //API Call
        await callSigninAPI(notification_token)
      }
  )
    showIsLoading(false)
  }
  const handleSignUpPress = () => {
    console.log("click on signup")
    if (isFromSignUp) {
      navigation.pop()
    } else {
      navigation.push("SignUpScreen", { isFromSignIn: true })
    }
  }

  const validateForm = (): ValidationResult => {
    if (!userName || userName.length < 5 || userName.includes(' ')) {
        return { valid: false, message: 'User name should be at least 5 characters long without space ' };
    }

    if (!password || password.length < 6) {
        return { valid: false, message: 'Password should be at least 6 characters long' };
    }
    return { valid: true, message: '' };
}
  const isValidData = (): boolean => {
    return true
  }

  const callSigninAPI = async (notification_token:string)  => {
    const user: ModelUser = await callApiWith(
      `sign_in`,
      'POST',
      undefined,
      {
        username: userName,
        password: password,
        notification_token:notification_token
      })
    if (user) {
      dispatch(setUser(user))
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.view_BG}>
        <CSText type={TextType.body1}>
          Sign in
        </CSText>
        <CSText style={styles.text_please_login} type={TextType.body3}>
          Please Login to your account
        </CSText>
        <CSIntput
          style={styles.text_input_user_name}
          placeholder='User name'
          onChangeText={setUserName}
          value={userName} />
        <CSIntput
          secureTextEntry = {true}
          style={styles.text_input_password}
          placeholder='Password'
          onChangeText={setPassword}
          value={password} />
        <CSButton title={'Sign in'} onPress={handleLoginPress} />
        <View style={styles.view_bottom}>
          <CSText style={styles.text_dont_have} type={TextType.body3}>
            Don't have an account?
          </CSText>
          <Pressable onPress={handleSignUpPress}>
            <CSText style={styles.text_register} type={TextType.body3}>
              Sign up
            </CSText>
          </Pressable>
        </View>
      </View>
      {(isLoading) && <View style={styles.containerLoader}>
                <ActivityIndicator></ActivityIndicator>
            </View>}
    </View>
  )
}

export default SignInScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.main_bg,
    alignItems: "center",
    justifyContent: "center"
  },
  view_BG: {
    width: "90%",
  },
  text_please_login: {
    fontWeight: "400",
    color: Color.main_text,
    marginBottom: 20
  },
  text_input_user_name: {
    marginBottom: 20
  },
  text_input_password: {
    marginBottom: 50
  },
  view_bottom: {
    paddingTop:5,
    alignItems:"center",
    flexDirection: "row"
  },
  text_register: {
    minHeight:48,
    minWidth:48,
    textAlignVertical:"center"
  },
  text_dont_have: {
    fontWeight: "400",
    color: Color.main_text
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
  }
})