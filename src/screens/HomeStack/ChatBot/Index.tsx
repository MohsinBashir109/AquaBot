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
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeWrapper from '../../../../Wrappers/HomeWrapper';
import { UserHeader } from '../../../components/Header';
import { fontPixel, heightPixel, widthPixel } from '../../../utils/constants';
import { fontFamilies } from '../../../utils/fontfamilies';
import { colors } from '../../../utils/colors';
import { useThemeContext } from '../../../theme/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  chatbotService,
  ChatMessage as ServiceChatMessage,
} from '../../../service/chatbotService';
import { showCustomFlash } from '../../../utils/flash';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  createConversation,
  addMessage,
  ChatMessage as StoreChatMessage,
  ChatConversation,
} from '../../../store/chatSlice';
import { routes } from '../../../utils/routes';
import ThemeText from '../../../components/ThemeComponents/ThemeText';
import { useSpeechToText } from '../../../hooks/useSpeechToText';
import { textToSpeechService } from '../../../utils/textToSpeech';

// Storage key for language preference
const CHAT_LANGUAGE_KEY = 'chatbot_selected_language';

const getSpeakableText = (value: any): string => {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object') {
    if (value.text || value.message || value.Message) {
      return getSpeakableText(value.text || value.message || value.Message);
    }
    try {
      return JSON.stringify(value);
    } catch (err) {
      console.warn('🔊 [TTS] Unable to stringify value for speech:', err);
      return '';
    }
  }
  return String(value);
};

const Index = () => {
  const { isDark } = useThemeContext();
  const { locale, t } = useLanguage();
  const themeColors = colors[isDark ? 'dark' : 'light'];
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const { conversations, activeConversationId } = useAppSelector(
    state => state.chat,
  );

  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ur' | null>(
    null, // Will be loaded from storage
  );
  const [isLoadingLanguage, setIsLoadingLanguage] = useState(true);

  // Speech-to-Text hook
  const {
    isRecording,
    recognizedText,
    error: sttError,
    startRecording,
    stopRecording,
    clearText,
  } = useSpeechToText();

  // Load saved language preference
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(CHAT_LANGUAGE_KEY);
        if (savedLanguage === 'en' || savedLanguage === 'ur') {
          setSelectedLanguage(savedLanguage);
        } else {
          // Default to app locale if no preference saved
          setSelectedLanguage(locale === 'ur' ? 'ur' : 'en');
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
        // Default to app locale on error
        setSelectedLanguage(locale === 'ur' ? 'ur' : 'en');
      } finally {
        setIsLoadingLanguage(false);
      }
    };

    loadLanguagePreference();
  }, [locale]);

  // Save language preference when it changes
  useEffect(() => {
    const saveLanguagePreference = async () => {
      if (!isLoadingLanguage && selectedLanguage) {
        try {
          await AsyncStorage.setItem(CHAT_LANGUAGE_KEY, selectedLanguage);
        } catch (error) {
          console.error('Error saving language preference:', error);
        }
      }
    };

    saveLanguagePreference();
  }, [selectedLanguage, isLoadingLanguage]);

  // Update input text when speech recognition completes
  useEffect(() => {
    if (recognizedText && !isRecording) {
      setInputText(recognizedText);
      clearText();
    }
  }, [recognizedText, isRecording, clearText]);

  // Show STT errors
  useEffect(() => {
    if (sttError) {
      showCustomFlash(sttError, 'danger');
    }
  }, [sttError]);

  // Get current conversation
  const currentConversation: ChatConversation | undefined = activeConversationId
    ? conversations.find(conv => conv.id === activeConversationId)
    : undefined;

  // Get messages from current conversation or show welcome message
  const messages: (StoreChatMessage & { id: string })[] = currentConversation
    ? currentConversation.messages.map(msg => ({
        ...msg,
        id: msg.id,
      }))
    : [];

  // Initialize conversation if none exists or if activeConversationId is null (new chat)
  useEffect(() => {
    if (!activeConversationId) {
      // Create a new conversation when activeConversationId is null
      // createConversation automatically sets activeConversationId
      const conversationId = `conv-${Date.now()}`;
      dispatch(createConversation({ conversationId }));
    }
  }, [activeConversationId, dispatch]);

  // Focus input when conversation is ready (optional - can be removed if causing issues)
  // useEffect(() => {
  //   if (currentConversation && !isProcessing) {
  //     // Small delay to ensure screen is fully rendered
  //     setTimeout(() => {
  //       inputRef.current?.focus();
  //     }, 300);
  //   }
  // }, [currentConversation?.id, isProcessing]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // Send message
  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim()) {
        return;
      }

      // Ensure we have a conversation
      let conversationId: string;
      let currentConv = currentConversation;

      if (!currentConv) {
        // Create new conversation
        conversationId = `conv-${Date.now()}`;
        dispatch(createConversation({ conversationId }));
        // Create a temporary conversation object for immediate use
        currentConv = {
          id: `conv-${Date.now()}`,
          conversationId: conversationId,
          title: 'New Chat',
          lastMessage: '',
          lastMessageTime: new Date(),
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } else {
        conversationId = currentConv.conversationId;
      }

      // Create user message
      const userMessage: StoreChatMessage = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content: messageText.trim(),
        timestamp: new Date(),
      };

      // Add user message to Redux
      dispatch(
        addMessage({
          conversationId: conversationId,
          message: userMessage,
        }),
      );

      setInputText('');
      setIsProcessing(true);

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      try {
        // Get updated conversation from Redux state
        const updatedConversations = [...conversations];
        let updatedConv = updatedConversations.find(
          conv => conv.conversationId === conversationId,
        );

        // If conversation not found, use currentConv with the new message
        if (!updatedConv) {
          updatedConv = {
            ...currentConv,
            messages: [...currentConv.messages, userMessage],
          };
        }

        // Convert messages to format for backend (exclude current user message)
        const messagesForBackend: ServiceChatMessage[] = updatedConv.messages
          .filter(msg => msg.id !== userMessage.id)
          .map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp:
              msg.timestamp instanceof Date
                ? msg.timestamp
                : msg.timestamp
                ? new Date(msg.timestamp)
                : undefined,
          }));

        // Use selected language or default to app locale
        const languageToSend =
          selectedLanguage || (locale === 'ur' ? 'ur' : 'en');

        const response = await chatbotService.sendMessage(
          messageText.trim(),
          conversationId,
          messagesForBackend,
          languageToSend, // Pass selected language
        );

        if (response.success && response.replyText) {
          // Create assistant message
          const assistantMessage: StoreChatMessage = {
            id: `msg-${Date.now()}-assistant`,
            role: 'assistant',
            content: response.replyText,
            timestamp: new Date(),
          };

          // Add assistant message to Redux
          dispatch(
            addMessage({
              conversationId: conversationId,
              message: assistantMessage,
            }),
          );

          // Scroll to bottom after response
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        } else {
          showCustomFlash(
            response.error ||
              t('chatbot.errorSending') ||
              'Failed to get response. Please try again.',
            'danger',
          );
        }
      } catch (error: any) {
        console.error('Chat error:', error);

        // Handle different error types with appropriate messages
        let errorMessage =
          t('chatbot.errorSending') ||
          'Failed to send message. Please try again.';

        if (error.message) {
          errorMessage = error.message;
        } else if (error.isAuthError) {
          errorMessage =
            locale === 'ur'
              ? 'براہ کرم جاری رکھنے کے لیے لاگ ان کریں۔'
              : 'Please login to continue.';
        } else if (error.isNetworkError) {
          errorMessage =
            locale === 'ur'
              ? 'سرور سے رابطہ قائم نہیں ہو سکا۔ براہ کرم اپنا انٹرنیٹ کنکشن چیک کریں۔'
              : 'Unable to connect to server. Please check your internet connection.';
        } else if (error.isTimeoutError) {
          errorMessage =
            locale === 'ur'
              ? 'درخواست کا وقت ختم ہو گیا۔ AI کو جواب دینے میں زیادہ وقت لگ رہا ہے۔ براہ کرم دوبارہ کوشش کریں۔'
              : 'Request timed out. The AI is taking too long to respond. Please try again.';
        }

        showCustomFlash(errorMessage, 'danger');
      } finally {
        setIsProcessing(false);
      }
    },
    [currentConversation, conversations, dispatch, locale, t, selectedLanguage],
  );

  const speakMessage = useCallback(
    async (content: any) => {
      // Normalize content to string first
      const speakableText = getSpeakableText(content);
      if (!speakableText || !speakableText.trim()) {
        console.warn('🔊 [TTS] No speakable text found in content:', content);
        return;
      }

      try {
        const languageCode = textToSpeechService.getLanguageCode(
          selectedLanguage || (locale === 'ur' ? 'ur' : 'en'),
        );
        // Pass the normalized string - textToSpeechService will normalize again as safety
        await textToSpeechService.speak(speakableText, {
          language: languageCode,
        });
      } catch (error) {
        console.error('🔊 [TTS] Failed to speak message:', error);
        console.error('🔊 [TTS] Content type:', typeof content);
        console.error('🔊 [TTS] Content value:', content);
        showCustomFlash(
          t('chatbot.speakingError') || 'Unable to read the message aloud.',
          'danger',
        );
      }
    },
    [locale, selectedLanguage, t],
  );

  // Handle send button
  const handleSend = useCallback(() => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
    }
  }, [inputText, sendMessage]);

  // Handle microphone button - toggle recording
  const handleMicrophonePress = useCallback(async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      // Use selected language or default to app locale
      const languageToUse = selectedLanguage || (locale === 'ur' ? 'ur' : 'en');
      await startRecording(languageToUse);
    }
  }, [isRecording, startRecording, stopRecording, selectedLanguage, locale]);

  // Handle back button - navigate to chat list or go back
  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(routes.chatList as never);
    }
  }, [navigation]);

  // Show welcome message if no messages
  const displayMessages =
    messages.length === 0 && currentConversation
      ? [
          {
            id: `msg-${Date.now()}-welcome`,
            role: 'assistant' as const,
            content: t('chatbot.welcomeMessage'),
            timestamp: new Date(),
          },
        ]
      : messages;

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <HomeWrapper>
        <UserHeader
          showDrawerButton={false}
          showBackButton={true}
          onBackPress={handleBack}
          screenTitle="AquaBot"
        />
        <View style={styles.chatWrapper}>
          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {displayMessages.map(message => (
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
                  <View style={styles.messageContentRow}>
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

                    {message.role === 'assistant' &&
                      message.content?.trim() && (
                        <TouchableOpacity
                          style={styles.speakButton}
                          onPress={() => speakMessage(message.content)}
                        >
                          <Icon
                            name="volume-up"
                            size={fontPixel(16)}
                            color={
                              isDark ? themeColors.white : themeColors.primary
                            }
                          />
                        </TouchableOpacity>
                      )}
                  </View>
                  {message.role === 'assistant' && message.content?.trim() && (
                    <TouchableOpacity
                      style={styles.readButton}
                      onPress={() => speakMessage(message.content)}
                    >
                      <Icon
                        name="volume-up"
                        size={fontPixel(18)}
                        color={themeColors.primary}
                      />
                      <Text
                        style={[
                          styles.readButtonText,
                          { color: themeColors.primary },
                        ]}
                      >
                        {t('chatbot.readAloud') || 'Read aloud'}
                      </Text>
                    </TouchableOpacity>
                  )}
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

          {/* Language Selector */}
          <View
            style={[
              styles.languageSelector,
              { backgroundColor: themeColors.background },
            ]}
          >
            <ThemeText color="secondaryText" style={styles.languageLabel}>
              {t('chatbot.responseLanguage') || 'Response Language:'}
            </ThemeText>
            <View style={styles.languageButtons}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  {
                    backgroundColor:
                      selectedLanguage === 'en'
                        ? themeColors.primary
                        : themeColors.gray6,
                    borderColor:
                      selectedLanguage === 'en'
                        ? themeColors.primary
                        : themeColors.gray3,
                  },
                ]}
                onPress={async () => {
                  setSelectedLanguage('en');
                  // Save immediately
                  try {
                    await AsyncStorage.setItem(CHAT_LANGUAGE_KEY, 'en');
                  } catch (error) {
                    console.error('Error saving language:', error);
                  }
                }}
                disabled={isProcessing || isLoadingLanguage}
              >
                <Text
                  style={[
                    styles.languageButtonText,
                    {
                      color:
                        selectedLanguage === 'en'
                          ? themeColors.white
                          : themeColors.text,
                    },
                  ]}
                >
                  {t('chatbot.english')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  {
                    backgroundColor:
                      selectedLanguage === 'ur'
                        ? themeColors.primary
                        : themeColors.gray6,
                    borderColor:
                      selectedLanguage === 'ur'
                        ? themeColors.primary
                        : themeColors.gray3,
                  },
                ]}
                onPress={async () => {
                  setSelectedLanguage('ur');
                  // Save immediately
                  try {
                    await AsyncStorage.setItem(CHAT_LANGUAGE_KEY, 'ur');
                  } catch (error) {
                    console.error('Error saving language:', error);
                  }
                }}
                disabled={isProcessing || isLoadingLanguage}
              >
                <Text
                  style={[
                    styles.languageButtonText,
                    {
                      color:
                        selectedLanguage === 'ur'
                          ? themeColors.white
                          : themeColors.text,
                    },
                  ]}
                >
                  اردو
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Input Area */}
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: themeColors.background },
            ]}
          >
            {/* Microphone Button */}
            <TouchableOpacity
              style={[
                styles.microphoneButton,
                {
                  backgroundColor: isRecording
                    ? themeColors.primary
                    : themeColors.gray6,
                  borderColor: isRecording
                    ? themeColors.primary
                    : themeColors.gray3,
                },
              ]}
              onPress={handleMicrophonePress}
              disabled={isProcessing}
            >
              <Icon
                name={isRecording ? 'mic' : 'mic-none'}
                size={fontPixel(20)}
                color={isRecording ? themeColors.white : themeColors.text}
              />
            </TouchableOpacity>

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
              editable={!isProcessing && !isRecording}
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
              disabled={!inputText.trim() || isProcessing || isRecording}
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
  messageContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(8),
  },
  speakButton: {
    padding: widthPixel(4),
    borderRadius: widthPixel(12),
  },
  readButton: {
    marginTop: heightPixel(6),
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(6),
  },
  readButtonText: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.medium,
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
  microphoneButton: {
    width: widthPixel(44),
    height: heightPixel(44),
    borderRadius: widthPixel(22),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  languageSelector: {
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(10),
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageLabel: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.medium,
    marginRight: widthPixel(12),
  },
  languageButtons: {
    flexDirection: 'row',
    gap: widthPixel(8),
  },
  languageButton: {
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(6),
    borderRadius: widthPixel(16),
    borderWidth: 1,
    minWidth: widthPixel(70),
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageButtonText: {
    fontSize: fontPixel(13),
    fontFamily: fontFamilies.semibold,
  },
});
