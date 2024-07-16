import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Color } from '../assets/colors/colors'
import ChatInput from '../components/MyInput'
import { useSelector } from 'react-redux'
import { ModelUser, ModelMessage, ModelChatList, ModelOnlineStatus } from '../models/Models'
import formatTime from '../utils/timeFormater'
import moment from 'moment'
import CSText, { TextType } from '../components/CSText';
import callApiWith from '../utils/Api';
import { useSocket } from '../utils/SocketManager'

type RouteParams = {
    modelChatListParam?: ModelChatList;
    isYouBlocked?: boolean
};

interface LogoTitleParam {
    title: string | undefined
    status: string
}

const LogoTitle = (props: LogoTitleParam) => {
    return (
        <View>
            <CSText style={styles.txtHeaderTitle} type={TextType.body2}>{props.title}</CSText>
            <CSText style={styles.txtHeaderStatus} type={TextType.body3}>{props.status}</CSText>
        </View>
    );
}



const ChatScreen = ({ navigation, route }: any) => {

    const socket = useSocket();
    const [messages, setMessages] = useState<ModelMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [allLoaded, setAllLoaded] = useState(false);
    const [page, setPage] = useState(1);
    const [modelChatList, setModelChatList] = useState<ModelChatList | null>(null);
    const modelChatListRef = useRef<ModelChatList>()
    const currentUser = useSelector((state: any): ModelUser => { return state.user })
    const { modelChatListParam, isYouBlocked }: RouteParams = route.params || {};
    const flatListRef = useRef(null);

    useEffect(() => {
        if (modelChatListParam) {
            modelChatListRef.current = modelChatListParam
            setModelChatList(modelChatListParam)
        }
        if ((isYouBlocked != null) && modelChatListRef.current) {
            modelChatListRef.current = {
                ...modelChatListRef.current,
                block_user: {
                    isYouBlocked: isYouBlocked,
                    isTheyBlocked: modelChatListRef.current.block_user.isTheyBlocked
                }
            }
            setModelChatList(modelChatListRef.current)
        }
    }, [route.params]);

    const handleProfileClick = () => {
        navigation.push('ProfileScreen', {
            otherUserId: modelChatListRef.current?.chat_with_user.id,
            isYouBlocked: modelChatListRef.current?.block_user.isYouBlocked
        })
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={handleProfileClick}>
                    <CSText style={styles.txtProfile} type={TextType.body3}>Profile</CSText>
                </Pressable>
            ),
            headerTitle: () => (
                <LogoTitle
                    title={modelChatList?.chat_with_user.name}
                    status={modelChatList?.chat_with_user.is_online ? "Online"
                        : `Last Seen: ${formatTime(modelChatList?.chat_with_user.last_seen)}`} 
                />
            ),
        });
    }, [navigation, modelChatList]);

    useEffect(() => {
        loadMoreMessages()

        if (modelChatListRef.current) {
            socket?.onOnlineStatusFor(
                modelChatListRef.current.chat_with_user.id, 
                (receivedOnlineStatus: ModelOnlineStatus) => {
                if (modelChatListRef.current) {
                    const updatedModelChatList = {
                        ...modelChatListRef.current,
                        chat_with_user: {
                            ...modelChatListRef.current.chat_with_user,
                            is_online: receivedOnlineStatus.isOnline,
                            last_seen: receivedOnlineStatus.lastSeen,
                        },
                    };
                    modelChatListRef.current = updatedModelChatList;
                    setModelChatList(updatedModelChatList);
                }
            })
        }

        socket?.onReceiveMessageFor(currentUser.id, (receivedMessage: ModelMessage) => {
            setMessages(prevChat => [receivedMessage, ...prevChat]);
        })

        return (() => {
            socket?.offReceiveMessageFor(currentUser.id)
            socket?.offOnlineStatusFor(currentUser.id)
        })
    }, []);

    const callChatAPI = async (): Promise<ModelMessage[]> => {
        const messages: ModelMessage[] = await callApiWith(
            `chat/${modelChatListRef.current?.id}`,
            'POST',
            currentUser.token,
            {
                page: page
            })
        return messages ?? []
    }


    const loadMoreMessages = async () => {
        if (isLoading || allLoaded) return;
        setIsLoading(true);
        const newMessages = await callChatAPI(); // Adjust the limit as needed
        if (newMessages.length === 0) {
            setAllLoaded(true);
        } else {
            setMessages((prevMessages) => [...prevMessages, ...newMessages]);
            setPage(page + 1);
        }
        setIsLoading(false);
    };

    const handleSendMessage = (message: string) => {
        let modelMessage: ModelMessage = {
            sender_id: currentUser.id,
            sender_name: currentUser.name,
            receiver_id: modelChatList?.chat_with_user.id ?? -1,
            message: message,
            chat_list_id: modelChatList?.id ?? -1,
            id: 0,
            created_at: moment().format("YYYY-MM-DD HH:mm:ss")
        }
        socket?.emitSendMessage(modelMessage)
    };

    return (
        <SafeAreaView style={[styles.container]}>
            <FlatList
                ref={flatListRef}
                ListHeaderComponent={() => <View style={styles.chatHeader} />}
                data={messages}
                renderItem={({ item, index }) => { return <MessageRow modelMessage={item} currentUser={currentUser} /> }}
                keyExtractor={item => item.id.toString()}
                inverted
                onEndReached={loadMoreMessages}
                onEndReachedThreshold={0.1}
                ListFooterComponent={isLoading ? <ActivityIndicator size="small" /> : null}
            >
            </FlatList>
            {(modelChatList?.block_user.isYouBlocked || modelChatList?.block_user.isTheyBlocked) ?
                <CSText style={styles.txtBlock} type={TextType.body3}>
                    {modelChatList.block_user.isYouBlocked ? "You Blocked This User" : "You'r Blocked By This User"}
                </CSText> :
                <ChatInput onSendMessage={handleSendMessage} />
            }
        </SafeAreaView>
    )
}

export default ChatScreen

interface propsMessageRow {
    modelMessage: ModelMessage
    currentUser: ModelUser
}

const MessageRow = (props: propsMessageRow) => {
    const isSent = props.modelMessage.sender_id == props.currentUser.id
    return (
        <View
            style={isSent ? styles.chatRowViewSent : styles.chatRowViewReceive}>
            <CSText style={isSent ? styles.textMessageLeft : styles.textMessageRight} numberOfLines={2} type={TextType.body3}>
                {props.modelMessage.message}
            </CSText>
            <CSText style={isSent ? styles.textTimeRight : styles.textTimeLeft} type={TextType.body3}>
                {formatTime(props.modelMessage.created_at)}
            </CSText>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.main_bg,
    },
    chatHeader: {
        height: 10,
    },
    chatRowViewSent: {
        alignSelf: "flex-end",
        paddingHorizontal: 10,
        padding: 5,
        marginVertical: 5,
        marginRight: 5,
        borderRadius: 10,
        maxWidth: "85%",
        backgroundColor: Color.main_btn
    },
    chatRowViewReceive: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        padding: 5,
        marginVertical: 5,
        marginLeft: 5,
        borderRadius: 10,
        maxWidth: "85%",
        backgroundColor: "white"
    },
    textMessageLeft: {
        color: "#FFFFFF",
    },
    textMessageRight: {
        color: Color.main_text,
    },
    textTimeLeft: {
        color: Color.main_text_helper,
        alignSelf: "flex-start"
    }
    , textTimeRight: {
        color: Color.main_text_helper,
        alignSelf: "flex-end"
    },
    txtProfile: {
        padding: 5,
        color: "white"
    },
    txtHeaderTitle: {
        color: "white"
    },
    txtHeaderStatus: {
        color: Color.main_text_helper
    },
    txtBlock: {
        padding: 10,
        alignSelf: "center"
    }
})