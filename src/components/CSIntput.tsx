import { StyleProp, StyleSheet, TextInput, TextStyle, View } from 'react-native'
import React from 'react'
import { Color } from '../assets/colors/colors'

interface propsCSIntput {
    style?: StyleProp<TextStyle>
    styleTextInput?: StyleProp<TextStyle>
    placeholder?: string
    onChangeText: any
    value:string
    editable?:boolean
    secureTextEntry?:boolean
}

const CSIntput = (props: propsCSIntput) => {
    return (
        <View style={[styles.container,props.style]}>
            <TextInput
                secureTextEntry={props.secureTextEntry ?? false}
                style={[styles.text_input,props.styleTextInput]}
                placeholder={props.placeholder} 
                onChangeText={props.onChangeText}
                value={props.value}
                editable={props.editable}
                placeholderTextColor={Color.placeholderTextColor}
                />
        </View>
    )
}

export default CSIntput

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: Color.main_text,
    },
    text_input: {
        height:48
    }
})