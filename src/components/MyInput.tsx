import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  TextInputSubmitEditingEventData, 
  Image 
} from 'react-native';
import { Color } from '../assets/colors/colors';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState<string>('');

  const handleSend = () => {
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleChangeText = (text: string) => {
    setMessage(text);
  };

  const handleSubmitEditing = (event: { nativeEvent: TextInputSubmitEditingEventData }) => {
    handleSend();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type your message..."
        value={message}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmitEditing}
        blurOnSubmit={false}
      />
      <TouchableOpacity onPress={handleSend}>
        <Image 
            source={require('../assets/images/imgSendMessage.png')} 
            style={styles.imgSend}>
        </Image>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  imgSend: {
    height: 24,
    width: 24
  },
});

export default ChatInput;
