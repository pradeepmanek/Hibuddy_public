import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Color } from '../assets/colors/colors'
import { ModelUser, ModelChatList } from '../models/Models'
import { base_url } from '../utils/constant'
import formatTime from '../utils/timeFormater'
import { useSelector } from 'react-redux'
import CSText, { TextType } from '../components/CSText'
import { useFocusEffect } from '@react-navigation/native'
import callApiWith from '../utils/Api'

const ChatListScreen = ({ navigation}: any) => {
    const [chatList, setChatList] = useState<ModelChatList[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const currentUser = useSelector((state: any): ModelUser => { return state.user })

    useFocusEffect(
        React.useCallback(() => {
        //API Call
        callChatlistAPI()
        }, [])
      );


    const callChatlistAPI = async () => {
        const responseChatList: ModelChatList[] = await callApiWith(`chat_list/${currentUser.id}`,undefined,currentUser.token,undefined)
        setChatList(responseChatList)
        setIsLoading(false)
    }

    const handleRowPress = (index: number) => {
        navigation.navigate('ChatScreen', { modelChatListParam: chatList[index] });
    }

    return (
        (isLoading) ?
            <View style={styles.container}>
                <ActivityIndicator />
            </View> :
            <FlatList
                style={styles.containerFlatList}
                ListHeaderComponent={() => <View style={styles.chatHeader} />}
                data={chatList}
                renderItem={({ item, index }) => {
                    return <ChatRow
                        index={index}
                        onPress={handleRowPress}
                        chat={chatList[index]}
                        totalCount={chatList.length} />
                }}
                keyExtractor={item => item.id.toString()}
            >
            </FlatList>

    )
}
export default ChatListScreen

const ChatRow = (props: {
    chat: ModelChatList,
    totalCount: number,
    index: number,
    onPress: (index: number) => void
}) => {
    const uri = (props.chat.chat_with_user.image == null) ?
        require('../assets/images/imgDefaultProfile.png') :
        { uri: `${base_url}/uploads/${props.chat.chat_with_user.image}` }

    return (
        <Pressable style={styles.chatRowView} onPress={() => props.onPress(props.index)}>
            <Image source={uri}
                style={styles.imgIcon}>
            </Image>
            <View style={styles.viewContainerNameMsg}>
                <View style={styles.view_bg}>

                    <CSText style={styles.text_Name} type={TextType.body3}>
                        {props.chat.chat_with_user.name}
                    </CSText>
                    <CSText style={styles.text_Date} type={TextType.body3}>
                    {(props.chat.last_message.created_at) ? formatTime(props.chat.last_message.created_at ?? "") : ""}
                    </CSText>
                </View>
                <CSText style={styles.text_LastChat} numberOfLines={1} type={TextType.body3}>
                    {props.chat.last_message.message}
                </CSText>
                {(props.index !== (props.totalCount - 1)) &&
                    <View style={styles.viewSaperator}></View>}
            </View>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Color.main_bg,
    },
    containerFlatList: {
        backgroundColor: Color.main_bg,
    },
    chatHeader: {
        height: 10,
    },
    chatRowView: {
        flexDirection: "row",
        marginBottom: 10,
        paddingHorizontal: 10
    },
    view_bg: {
        flexDirection: "row" ,
        marginTop: 5
    },
    text_Name: {
        flex: 1,
        color: Color.main_text
    },
    text_Date: {
        color: Color.main_text_helper
    },
    text_LastChat: {
        color: Color.main_text_helper
    },
    imgIcon: {
        marginTop: 5,
        height: 40,
        width: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Color.main_btn
    },
    viewContainerNameMsg: {
        flex: 1,
        paddingLeft: 10
    },
    viewSaperator: {
        marginTop: 5,
        height: 1,
        backgroundColor: Color.main_text_helper,
    }
})