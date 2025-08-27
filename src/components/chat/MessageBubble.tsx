import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Message } from '../../types';
import { MaterialIcons } from '@expo/vector-icons';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        {!isUser && (
          <View style={styles.assistantHeader}>
            <MaterialIcons name="smart-toy" size={16} color="#836cc7" />
            <Text style={styles.assistantLabel}>Lattice AI</Text>
          </View>
        )}
        {message.content ? (
          <Markdown
            style={
              isUser
                ? { body: styles.userText, code_block: styles.userCode }
                : { body: styles.assistantText, code_block: styles.assistantCode }
            }
          >
            {message.content}
          </Markdown>
        ) : (
          <View style={styles.thinkingDots}>
            <View style={styles.thinkingDot} />
            <View style={styles.thinkingDot} />
            <View style={styles.thinkingDot} />
          </View>
        )}
        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.assistantTimestamp]}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  assistantContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#836cc7',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  assistantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  assistantLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#836cc7',
    marginLeft: 4,
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
  },
  assistantText: {
    color: '#000000',
    fontSize: 16,
    lineHeight: 22,
  },
  userCode: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFFFFF',
    padding: 4,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  assistantCode: {
    backgroundColor: '#F0F0F0',
    color: '#000000',
    padding: 4,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  assistantTimestamp: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  thinkingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  thinkingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#999999',
    marginHorizontal: 2,
  },
});

export default MessageBubble;