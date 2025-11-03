import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';

import HomeWrapper from '../../../../Wrappers/HomeWrapper';
import { UserHeader } from '../../../components/Header';
import { fontPixel, heightPixel, widthPixel } from '../../../utils/constants';
import { fontFamilies } from '../../../utils/fontfamilies';
import { colors } from '../../../utils/colors';
import { useThemeContext } from '../../../theme/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { chatbotService, ChatMessage } from '../../../service/chatbotService';
import { showCustomFlash } from '../../../utils/flash';

const Index = () => {
  const { isDark } = useThemeContext();
  const { locale, t } = useLanguage();
  const themeColors = colors[isDark ? 'dark' : 'light'];
  const scrollViewRef = useRef<ScrollView>(null);

  // State - initialize with empty array, will be set in useEffect
  const [messages, setMessages] = useState<(ChatMessage & { id: string })[]>(
    [],
  );
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize and setup initial welcome message
  useEffect(() => {
    // Initialize welcome message only if messages array is empty
    setMessages(prev => {
      if (prev.length === 0) {
        const welcomeContent =
          locale === 'ur'
            ? 'خوش آمدید! میں آپ کی آبپاشی اور کھیتی باڑی میں مدد کر سکتا ہوں۔'
            : 'Welcome! I can help you with irrigation and farming questions. How can I assist you today?';
        return [
          {
            id: `msg-${Date.now()}-welcome`,
            role: 'assistant',
            content: welcomeContent,
            timestamp: new Date(),
          },
        ];
      }
      // Update welcome message content if locale changes and it's the only message
      if (prev.length === 1 && prev[0].role === 'assistant') {
        const welcomeContent =
          locale === 'ur'
            ? 'خوش آمدید! میں آپ کی آبپاشی اور کھیتی باڑی میں مدد کر سکتا ہوں۔'
            : 'Welcome! I can help you with irrigation and farming questions. How can I assist you today?';
        if (prev[0].content !== welcomeContent) {
          return [
            {
              ...prev[0],
              content: welcomeContent,
            },
          ];
        }
      }
      return prev;
    });
  }, [locale]);

  // Send message
  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim()) {
        return;
      }

      const userMessage: ChatMessage & { id: string } = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content: messageText.trim(),
        timestamp: new Date(),
      };

      // Add user message to chat
      setMessages(prev => [...prev, userMessage]);
      setInputText('');
      setIsProcessing(true);

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      try {
        // Get language code for backend (ur, en)
        const languageCode = locale === 'ur' ? 'ur' : 'en';

        // Send to backend - convert messages to ChatMessage format (without id)
        const messagesForBackend: ChatMessage[] = messages.map(
          ({ id: _id, ...msg }) => msg,
        );

        const response = await chatbotService.sendMessage(
          messageText.trim(),
          languageCode,
          messagesForBackend,
        );

        if (response.success && response.response) {
          const assistantMessage: ChatMessage & { id: string } = {
            id: `msg-${Date.now()}-assistant`,
            role: 'assistant',
            content: response.response,
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, assistantMessage]);

          // Scroll to bottom after response
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        } else {
          showCustomFlash(
            response.message ||
              t('chatbot.errorSending') ||
              'Failed to get response. Please try again.',
            'danger',
          );
        }
      } catch (error: any) {
        console.error('Chat error:', error);
        showCustomFlash(
          t('chatbot.errorSending') ||
            'Failed to send message. Please try again.',
          'danger',
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [messages, locale, t],
  );

  // Handle send button
  const handleSend = useCallback(() => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
    }
  }, [inputText, sendMessage]);

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <HomeWrapper>
        <UserHeader showDrawerButton={true} showBackButton={false} />
        <View style={styles.chatWrapper}>
          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(message => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.role === 'user'
                    ? styles.userMessage
                    : styles.assistantMessage,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    {
                      backgroundColor:
                        message.role === 'user'
                          ? themeColors.primary
                          : themeColors.gray6,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      {
                        color:
                          message.role === 'user'
                            ? themeColors.white
                            : themeColors.text,
                      },
                    ]}
                  >
                    {message.content}
                  </Text>
                </View>
              </View>
            ))}

            {isProcessing && (
              <View key="processing-indicator" style={styles.messageContainer}>
                <View
                  style={[
                    styles.messageBubble,
                    { backgroundColor: themeColors.gray6 },
                  ]}
                >
                  <ActivityIndicator size="small" color={themeColors.primary} />
                  <Text
                    style={[
                      styles.messageText,
                      styles.processingText,
                      { color: themeColors.secondaryText },
                    ]}
                  >
                    {t('chatbot.processing') || 'Processing...'}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Area */}
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: themeColors.background },
            ]}
          >
            {/* Text Input */}
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: themeColors.gray6,
                  color: themeColors.text,
                  borderColor: themeColors.gray3,
                },
              ]}
              placeholder={t('chatbot.placeholder') || 'Type your message...'}
              placeholderTextColor={themeColors.secondaryText}
              value={inputText}
              onChangeText={setInputText}
              multiline
              editable={!isProcessing}
            />

            {/* Send Button */}
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: themeColors.primary,
                },
                inputText.trim().length > 0
                  ? styles.sendButtonEnabled
                  : styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText.trim() || isProcessing}
            >
              <Text style={styles.sendButtonText}>
                {t('chatbot.send') || 'Send'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </HomeWrapper>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatWrapper: {
    flex: 1,
    width: '100%',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: widthPixel(16),
    paddingTop: heightPixel(16),
  },
  messagesContent: {
    paddingBottom: heightPixel(16),
  },
  messageContainer: {
    marginBottom: heightPixel(12),
    flexDirection: 'row',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(12),
    borderRadius: widthPixel(16),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageText: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    lineHeight: fontPixel(20),
  },
  processingText: {
    marginLeft: widthPixel(10),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(12),
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    gap: widthPixel(8),
  },
  textInput: {
    flex: 1,
    minHeight: heightPixel(44),
    maxHeight: heightPixel(100),
    borderRadius: widthPixel(22),
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(12),
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    borderWidth: 1,
    textAlignVertical: 'center',
  },
  sendButton: {
    paddingHorizontal: widthPixel(20),
    paddingVertical: heightPixel(12),
    borderRadius: widthPixel(22),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sendButtonEnabled: {
    opacity: 1,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.semibold,
  },
});
