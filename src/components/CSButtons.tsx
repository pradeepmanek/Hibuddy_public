import { Pressable, StyleProp, StyleSheet, TextStyle, View } from 'react-native'
import React from 'react'
import { Color } from '../assets/colors/colors';
import CSText, { TextType } from './CSText';


interface propsMyButton {
    style?: StyleProp<TextStyle>
    title:string,
    onPress: ()=> void
}

export enum typeMyButton {
    pink,
    yellow
}

const CSButton = (props:propsMyButton) => {
  return (
    <Pressable onPress={props.onPress} style={[styles.container,props.style]}>
        <CSText style={styles.text} type={TextType.body3}>{props.title}</CSText>
    </Pressable>
  )
}

export default CSButton

const styles = StyleSheet.create({
    container: {
        paddingHorizontal:20,
        alignItems: "center",
        justifyContent: "center",
        height:48,
        borderRadius: 5,
        backgroundColor: Color.main_btn
    },
    text: {
        color: "white",
        fontWeight: "400",
    }
})