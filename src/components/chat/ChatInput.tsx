import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useChat } from '../../contexts/ChatContext';
import { MaterialIcons } from '@expo/vector-icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export interface ChatInputRef {
  focus: () => void;
}

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({ onSendMessage }, ref) => {
  const [message, setMessage] = useState('');
  const { isGeneratingResponse } = useChat();
  const textInputRef = React.useRef<TextInput>(null);

  // Expose focus method to parent component
  useImperativeHandle(ref, () => ({
    focus: () => {
      textInputRef.current?.focus();
    }
  }));

  const handleSend = () => {
    if (message.trim() && !isGeneratingResponse) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'android' ? 90 : 0}
    >
      <View style={styles.container}>
        <TextInput
          ref={textInputRef}
          style={[styles.input, isGeneratingResponse && styles.inputDisabled]}
          value={message}
          onChangeText={setMessage}
          placeholder={isGeneratingResponse ? "AI is thinking..." : "Type a message..."}
          multiline
          editable={!isGeneratingResponse}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[
            styles.sendButton, 
            (!message.trim() || isGeneratingResponse) && styles.sendButtonDisabled
          ]}
          onPress={handleSend}
          disabled={!message.trim() || isGeneratingResponse}
        >
          <MaterialIcons 
            name="send" 
            size={24} 
            color={isGeneratingResponse ? "#999999" : "#FFFFFF"} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    marginRight: 8,
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#999999',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
});

export default ChatInput;