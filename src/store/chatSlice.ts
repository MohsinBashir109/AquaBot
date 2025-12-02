import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date | string;
}

export interface ChatConversation {
  id: string;
  conversationId: string;
  title: string; // First user message or "New Chat"
  lastMessage: string;
  lastMessageTime: Date | string;
  messages: ChatMessage[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ChatState {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  activeConversationId: null,
  loading: false,
  error: null,
};

// Storage key
const CHAT_STORAGE_KEY = 'redux_chat_conversations';

// Helper to save to AsyncStorage
const saveToStorage = async (conversations: ChatConversation[]) => {
  try {
    await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error('Error saving chats to storage:', error);
  }
};

// Helper to load from AsyncStorage
export const loadChatsFromStorage = async (): Promise<ChatConversation[]> => {
  try {
    const data = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
    if (data) {
      const conversations = JSON.parse(data);
      // Parse dates back to Date objects
      return conversations.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        lastMessageTime: new Date(conv.lastMessageTime),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
    }
  } catch (error) {
    console.error('Error loading chats from storage:', error);
  }
  return [];
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Load conversations from storage
    loadConversations: (
      state,
      action: PayloadAction<ChatConversation[]>,
    ) => {
      state.conversations = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Create a new conversation
    createConversation: (
      state,
      action: PayloadAction<{
        conversationId: string;
        title?: string;
      }>,
    ) => {
      const newConversation: ChatConversation = {
        id: `conv-${Date.now()}`,
        conversationId: action.payload.conversationId,
        title: action.payload.title || 'New Chat',
        lastMessage: '',
        lastMessageTime: new Date(),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      state.conversations.unshift(newConversation); // Add to beginning
      state.activeConversationId = newConversation.id;
      saveToStorage(state.conversations);
    },

    // Add message to a conversation
    addMessage: (
      state,
      action: PayloadAction<{
        conversationId: string;
        message: ChatMessage;
      }>,
    ) => {
      const conversation = state.conversations.find(
        conv => conv.conversationId === action.payload.conversationId,
      );

      if (conversation) {
        conversation.messages.push(action.payload.message);
        conversation.lastMessage =
          action.payload.message.content.substring(0, 50) + '...';
        conversation.lastMessageTime = action.payload.message.timestamp;
        conversation.updatedAt = new Date();

        // Update title if it's the first user message
        if (
          conversation.title === 'New Chat' &&
          action.payload.message.role === 'user'
        ) {
          conversation.title =
            action.payload.message.content.substring(0, 30) + '...';
        }

        // Sort conversations by updatedAt (most recent first)
        state.conversations.sort((a, b) => {
          const timeA = new Date(a.updatedAt).getTime();
          const timeB = new Date(b.updatedAt).getTime();
          return timeB - timeA;
        });

        saveToStorage(state.conversations);
      }
    },

    // Set active conversation
    setActiveConversation: (
      state,
      action: PayloadAction<string | null>,
    ) => {
      state.activeConversationId = action.payload;
    },

    // Update conversation title
    updateConversationTitle: (
      state,
      action: PayloadAction<{
        conversationId: string;
        title: string;
      }>,
    ) => {
      const conversation = state.conversations.find(
        conv => conv.conversationId === action.payload.conversationId,
      );
      if (conversation) {
        conversation.title = action.payload.title;
        conversation.updatedAt = new Date();
        saveToStorage(state.conversations);
      }
    },

    // Delete a conversation
    deleteConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(
        conv => conv.id !== action.payload,
      );
      if (state.activeConversationId === action.payload) {
        state.activeConversationId = null;
      }
      saveToStorage(state.conversations);
    },

    // Clear all conversations
    clearAllConversations: state => {
      state.conversations = [];
      state.activeConversationId = null;
      AsyncStorage.removeItem(CHAT_STORAGE_KEY);
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  loadConversations,
  createConversation,
  addMessage,
  setActiveConversation,
  updateConversationTitle,
  deleteConversation,
  clearAllConversations,
  setLoading,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer;

