import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import HomeWrapper from '../../../../Wrappers/HomeWrapper';
import { UserHeader } from '../../../components/Header';
import { fontPixel, heightPixel, widthPixel } from '../../../utils/constants';
import { fontFamilies } from '../../../utils/fontfamilies';
import { colors } from '../../../utils/colors';
import { useThemeContext } from '../../../theme/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  loadConversations,
  setActiveConversation,
  deleteConversation,
  ChatConversation,
  loadChatsFromStorage,
} from '../../../store/chatSlice';
import ThemeText from '../../../components/ThemeComponents/ThemeText';
import { routes } from '../../../utils/routes';

const Index = () => {
  const { isDark } = useThemeContext();
  const { locale, t } = useLanguage();
  const themeColors = colors[isDark ? 'dark' : 'light'];
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const { conversations, loading } = useAppSelector(state => state.chat);

  // Load conversations on mount
  useEffect(() => {
    const loadChats = async () => {
      dispatch({ type: 'chat/setLoading', payload: true });
      try {
        const savedChats = await loadChatsFromStorage();
        dispatch(loadConversations(savedChats));
      } catch (error) {
        console.error('Error loading chats:', error);
      } finally {
        dispatch({ type: 'chat/setLoading', payload: false });
      }
    };

    loadChats();
  }, [dispatch]);

  // Navigate to chat screen
  const handleChatPress = useCallback(
    (conversation: ChatConversation) => {
      dispatch(setActiveConversation(conversation.id));
      navigation.navigate(routes.chatbot as never);
    },
    [dispatch, navigation],
  );

  // Create new chat
  const handleNewChat = useCallback(() => {
    dispatch(setActiveConversation(null));
    navigation.navigate(routes.chatbot as never);
  }, [dispatch, navigation]);

  // Delete conversation
  const handleDeleteChat = useCallback(
    (conversationId: string, event: any) => {
      event.stopPropagation();
      dispatch(deleteConversation(conversationId));
    },
    [dispatch],
  );

  // Format time
  const formatTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (days === 1) {
      return t('common.yesterday');
    } else if (days < 7) {
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const renderChatItem = ({ item }: { item: ChatConversation }) => (
    <TouchableOpacity
      style={[
        styles.chatItem,
        {
          backgroundColor: themeColors.white,
          borderBottomColor: themeColors.gray3,
        },
      ]}
      onPress={() => handleChatPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.chatContent}>
        <View style={styles.chatInfo}>
          <ThemeText
            color="text"
            style={styles.chatTitle}
            numberOfLines={1}
          >
            {item.title}
          </ThemeText>
          <ThemeText
            color="secondaryText"
            style={styles.chatPreview}
            numberOfLines={2}
          >
            {item.lastMessage || t('chatbot.noMessages') || 'No messages yet'}
          </ThemeText>
        </View>
        <View style={styles.chatMeta}>
          <ThemeText color="secondaryText" style={styles.chatTime}>
            {formatTime(item.lastMessageTime)}
          </ThemeText>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={e => handleDeleteChat(item.id, e)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.deleteButtonText, { color: themeColors.error || '#FF4444' }]}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <HomeWrapper>
        <UserHeader showDrawerButton={true} showBackButton={false} />
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <ThemeText color="text" style={styles.headerTitle}>
              {t('chatbot.chats') || 'Chats'}
            </ThemeText>
            <TouchableOpacity
              style={[
                styles.newChatButton,
                { backgroundColor: themeColors.primary },
              ]}
              onPress={handleNewChat}
            >
              <Text style={styles.newChatButtonText}>
                {t('chatbot.newChat') || '+ New Chat'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Chat List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={themeColors.primary}
              />
              <ThemeText color="secondaryText" style={styles.loadingText}>
                {t('chatbot.loading') || 'Loading chats...'}
              </ThemeText>
            </View>
          ) : conversations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ThemeText color="secondaryText" style={styles.emptyText}>
                {t('chatbot.noChats') || 'No chats yet. Start a new conversation!'}
              </ThemeText>
              <TouchableOpacity
                style={[
                  styles.emptyButton,
                  { backgroundColor: themeColors.primary },
                ]}
                onPress={handleNewChat}
              >
                <Text style={styles.emptyButtonText}>
                  {t('chatbot.startChat') || 'Start Chat'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={conversations}
              renderItem={renderChatItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
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
  content: {
    flex: 1,
    paddingHorizontal: widthPixel(16),
    paddingTop: heightPixel(10),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: heightPixel(20),
  },
  headerTitle: {
    fontSize: fontPixel(28),
    fontFamily: fontFamilies.bold,
  },
  newChatButton: {
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(8),
    borderRadius: widthPixel(20),
  },
  newChatButtonText: {
    color: '#FFFFFF',
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.semibold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: heightPixel(12),
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: widthPixel(40),
  },
  emptyText: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.medium,
    textAlign: 'center',
    marginBottom: heightPixel(24),
  },
  emptyButton: {
    paddingHorizontal: widthPixel(24),
    paddingVertical: heightPixel(12),
    borderRadius: widthPixel(24),
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.semibold,
  },
  listContent: {
    paddingBottom: heightPixel(20),
  },
  chatItem: {
    paddingVertical: heightPixel(16),
    paddingHorizontal: widthPixel(16),
    borderBottomWidth: 1,
    marginBottom: heightPixel(8),
    borderRadius: widthPixel(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    width: '100%',
  },
  chatContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  chatInfo: {
    flex: 1,
    marginRight: widthPixel(12),
    minWidth: 0, // Allows flex to shrink properly
  },
  chatTitle: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.semibold,
    marginBottom: heightPixel(4),
  },
  chatPreview: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    lineHeight: fontPixel(20),
    flexShrink: 1,
  },
  chatMeta: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    width: widthPixel(80),
    flexShrink: 0,
  },
  chatTime: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.regular,
    marginBottom: heightPixel(8),
  },
  deleteButton: {
    width: widthPixel(28),
    height: widthPixel(28),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: heightPixel(4),
  },
  deleteButtonText: {
    fontSize: fontPixel(18),
    fontWeight: 'bold',
  },
});

