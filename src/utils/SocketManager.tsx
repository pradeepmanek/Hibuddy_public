import io from 'socket.io-client';
import { createContext, useContext, useRef } from 'react';
import { base_url } from './constant';
import { ModelMessage, ModelOnlineStatus } from '../models/Models';

interface SocketContextType {
    connectSocket: () => void;
    disconnectSocket: () => void;
    emitSendMessage: (message: ModelMessage) => void;
    emitSendOnlineStatus: (onlineStatus: ModelOnlineStatus) => void;
    onReceiveMessageFor: (id: number, receivedMessage: (message: any) => void) => void;
    offReceiveMessageFor: (id: number) => void;
    onOnlineStatusFor: (id: number, onlineStatus: (status: any) => void) => void;
    offOnlineStatusFor: (id: number) => void;
}

const SocketContext = createContext<SocketContextType | null>(null)

const SocketProvider = ({ children }:any) => {
    let socket = useRef<any>(null)

    // useEffect(() => {
    //     socket.current = io(`${base_url}`);
    //   }, []);

    const connectSocket = () => {
        if (socket.current){return}
        socket.current = io(`${base_url}`);
    }
    const disconnectSocket = () => {
        if (!socket.current){return}
        socket.current.disconnect()
    }
    const emitSendMessage = (message:ModelMessage) => {
        socket.current?.emit('send_message', message);
    }
    const onReceiveMessageFor = (id:number,receivedMessage:any) => {
        socket.current?.on(`receive_message_${id}`,receivedMessage);
    }
    const offReceiveMessageFor = (id:number) => {
        socket.current?.off(`receive_message_${id}`);
    }
    const emitSendOnlineStatus = (onlineStatus:ModelOnlineStatus) => {
        socket.current?.emit('online_status', onlineStatus);
    }
    const onOnlineStatusFor = (id:number,onlineStatus:any) => {
        socket.current?.on(`online_status_${id}`,onlineStatus);
    }
    const offOnlineStatusFor = (id:number) => {
        socket.current?.off(`online_status_${id}`);
    }
    return (<SocketContext.Provider value={{
        connectSocket,
        disconnectSocket,
        emitSendMessage,
        emitSendOnlineStatus,
        onReceiveMessageFor,
        offReceiveMessageFor,
        onOnlineStatusFor,
        offOnlineStatusFor
    }}>
        {children}
        </SocketContext.Provider>)
}

export const useSocket = () => useContext(SocketContext);

export default SocketProvider