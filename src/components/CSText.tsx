import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Color } from '../assets/colors/colors';

export enum TextType  {
    body1 ,
    body2 ,
    body3 ,
    body4
  };

  let getStyle=(type:TextType):TextStyle=>{
    switch(type) {

      case TextType.body1:
        return textStyles.body1;
         
      case TextType.body2:
        return textStyles.body2;

      case TextType.body3:
        return textStyles.body3;
    
    case TextType.body4:
            return textStyles.body4;

      default:
        return textStyles.body2;     
      }
  }

const CSText = ({ style, children,type, ...props }:any) => {
    const defaultStyle = getStyle(type)

  return (
    <Text style={[defaultStyle, style]} {...props}>
      {children}
    </Text>
  );
};

export const textStyles = StyleSheet.create({
    body1: {
        fontSize: 30,
        fontWeight: "500",
        color: Color.main_text // Replace with your desired color
  },body2: {
    fontSize: 20,
    fontWeight: "500",
    color: Color.main_text, // Replace with your desired color
  },body3: {
    fontSize: 15,
    fontWeight: "500",
    color: Color.main_text, // Replace with your desired color
  },body4: {
    fontSize: 10,
    fontWeight: "500",
    color: Color.main_text,  // Replace with your desired color
  }
});

export default CSText;
