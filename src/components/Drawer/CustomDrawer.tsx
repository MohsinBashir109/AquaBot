import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import {
  useNavigation,
  DrawerContentComponentProps,
  useRoute,
} from '@react-navigation/native';
import { useAppSelector } from '../../store/hooks';
import { useAuth } from '../../context/AuthContext';
import { useThemeContext } from '../../theme/ThemeContext';
import { colors } from '../../utils/colors';
import { fontPixel, heightPixel, widthPixel } from '../../utils/constants';
import { fontFamilies } from '../../utils/fontfamilies';
import { showCustomFlash } from '../../utils/flash';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DrawerItem {
  id: string;
  title: string;
  icon: string;
  screen: string;
  onPress?: () => void;
}

const CustomDrawer: React.FC<DrawerContentComponentProps> = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAppSelector(state => state.user);
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useThemeContext();
  const insets = useSafeAreaInsets();
  const themeColors = colors[isDark ? 'dark' : 'light'];

  // Debug Redux data
  console.log('CustomDrawer - Redux user data:', user);
  console.log('CustomDrawer - User name:', user?.userName);
  console.log('CustomDrawer - User email:', user?.email);
  console.log('CustomDrawer - Drawer props:', props);
  console.log('CustomDrawer - Current route:', route.name);

  // Function to check if a screen is currently active
  const isActiveScreen = (screenName: string) => {
    // Get the current navigation state to find the active tab
    const state = props.navigation.getState();
    console.log('Navigation state:', state);

    // Navigate through the state to find the active tab
    let activeTab = '';
    if (state.routes && state.routes.length > 0) {
      const mainTabsRoute = state.routes.find(
        route => route.name === 'MainTabs',
      );
      if (mainTabsRoute && mainTabsRoute.state) {
        const tabState = mainTabsRoute.state;
        if (tabState.routes && tabState.routes.length > 0) {
          activeTab = tabState.routes[tabState.index || 0].name;
        }
      }
    }

    console.log('Active tab:', activeTab, 'Checking screen:', screenName);

    // Map screen names to route names
    const screenMap: { [key: string]: string } = {
      Home: 'Home',
      Profile: 'Profile',
      ChatBot: 'ChatBot',
      Settings: 'Settings',
      GovernmentGuidelines: 'Analyze',
    };

    return screenMap[screenName] === activeTab;
  };

  const handleLogout = async () => {
    console.log('Logout button pressed in drawer');
    console.log('User data before logout:', user);
    try {
      await logout();
      showCustomFlash('Logged out successfully!', 'success');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      showCustomFlash('Logout failed. Please try again.', 'danger');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const drawerItems: DrawerItem[] = [
    {
      id: 'home',
      title: 'Home',
      icon: '🏠',
      screen: 'Home',
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: '👤',
      screen: 'Profile',
    },
    {
      id: 'chatbot',
      title: 'Messages',
      icon: '💬',
      screen: 'ChatBot',
    },
    {
      id: 'guidelines',
      title: 'Moments',
      icon: '⏰',
      screen: 'GovernmentGuidelines',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: '⚙️',
      screen: 'Settings',
    },
  ];

  const bottomItems: DrawerItem[] = [
    {
      id: 'tell-friend',
      title: 'Tell a friend',
      icon: '📤',
      screen: '',
    },
    {
      id: 'sign-out',
      title: 'Sign Out',
      icon: '🚪',
      screen: '',
      onPress: handleLogout,
    },
  ];

  const handleItemPress = (item: DrawerItem) => {
    console.log('Drawer item pressed:', item.title, 'Screen:', item.screen);
    console.log('Navigation object:', props.navigation);
    console.log('Available navigation methods:', Object.keys(props.navigation));

    if (item.onPress) {
      item.onPress();
    } else {
      try {
        // Close drawer first using props
        props.navigation.closeDrawer();

        // Navigate to the appropriate tab within the MainTabs navigator
        switch (item.screen) {
          case 'Home':
            console.log('Navigating to Home');
            props.navigation.navigate('MainTabs', { screen: 'Home' });
            break;
          case 'Profile':
            console.log('Navigating to Profile');
            props.navigation.navigate('MainTabs', { screen: 'Profile' });
            break;
          case 'ChatBot':
            console.log('Navigating to ChatBot');
            props.navigation.navigate('MainTabs', { screen: 'ChatBot' });
            break;
          case 'Settings':
            console.log('Navigating to Settings');
            props.navigation.navigate('MainTabs', { screen: 'Settings' });
            break;
          case 'GovernmentGuidelines':
            console.log('Navigating to Analyze');
            props.navigation.navigate('MainTabs', { screen: 'Analyze' });
            break;
          default:
            console.log('Unknown screen:', item.screen);
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: 'white',
        },
      ]}
    >
      {console.log('CustomDrawer rendering with user:', user)}
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Header Section - Using Your Color Scheme */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: themeColors.primary, // Your primary color #30A7FB
            paddingTop: insets.top + heightPixel(20),
            paddingBottom: heightPixel(30),
          },
        ]}
      >
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: 'white' }]}>
              <Text style={[styles.avatarText, { color: themeColors.primary }]}>
                {getInitials(user?.userName || 'User')}
              </Text>
            </View>
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: 'white' }]}>
              {user?.userName || 'User'}
            </Text>
            <Text style={[styles.userEmail, { color: 'white', opacity: 0.8 }]}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
        </View>
      </View>

      {/* Navigation Items */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsContainer}>
          {drawerItems.map((item, index) => {
            const isActive = isActiveScreen(item.screen);
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.drawerItem,
                  { backgroundColor: 'transparent' },
                  isActive && styles.activeItem, // Highlight active item
                ]}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.itemIcon,
                    { color: isActive ? 'white' : '#6B7280' },
                  ]}
                >
                  {item.icon}
                </Text>
                <Text
                  style={[
                    styles.itemTitle,
                    {
                      color: isActive ? 'white' : '#374151',
                      fontWeight: isActive ? '600' : '400',
                    },
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Theme Toggle */}
        <View style={styles.themeContainer}>
          <TouchableOpacity
            style={[styles.themeToggle, { backgroundColor: 'transparent' }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Text style={[styles.themeIcon, { color: '#6B7280' }]}>
              {isDark ? '☀️' : '🌙'}
            </Text>
            <Text style={[styles.themeText, { color: '#374151' }]}>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Items - Tell a friend and Sign Out */}
        <View style={styles.bottomItemsContainer}>
          {bottomItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.drawerItem, { backgroundColor: 'transparent' }]}
              onPress={() => handleItemPress(item)}
              activeOpacity={0.7}
            >
              <Text style={[styles.itemIcon, { color: '#6B7280' }]}>
                {item.icon}
              </Text>
              <Text
                style={[
                  styles.itemTitle,
                  {
                    color: '#374151',
                    fontWeight: '400',
                  },
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: widthPixel(20),
    paddingVertical: heightPixel(20),
    borderBottomLeftRadius: widthPixel(0),
    borderBottomRightRadius: widthPixel(0),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: widthPixel(15),
  },
  avatar: {
    width: widthPixel(60),
    height: widthPixel(60),
    borderRadius: widthPixel(30),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatarText: {
    fontSize: fontPixel(20),
    fontFamily: fontFamilies.bold,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: widthPixel(16),
    height: widthPixel(16),
    borderRadius: widthPixel(8),
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: fontPixel(18),
    fontFamily: fontFamilies.bold,
    marginBottom: heightPixel(4),
  },
  userEmail: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingTop: heightPixel(20),
  },
  itemsContainer: {
    paddingHorizontal: widthPixel(20),
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: heightPixel(12),
    paddingHorizontal: widthPixel(20),
    marginBottom: heightPixel(2),
    borderRadius: widthPixel(8),
  },
  activeItem: {
    backgroundColor: '#30A7FB', // Your primary color
    marginHorizontal: widthPixel(15),
    borderRadius: widthPixel(8),
  },
  itemIcon: {
    fontSize: fontPixel(18),
    marginRight: widthPixel(12),
    width: widthPixel(25),
  },
  itemTitle: {
    flex: 1,
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.medium,
  },
  themeContainer: {
    paddingHorizontal: widthPixel(20),
    marginTop: heightPixel(20),
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: heightPixel(12),
    paddingHorizontal: widthPixel(15),
    borderRadius: widthPixel(10),
  },
  themeIcon: {
    fontSize: fontPixel(18),
    marginRight: widthPixel(12),
  },
  themeText: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.medium,
  },
  bottomItemsContainer: {
    paddingHorizontal: widthPixel(20),
    marginTop: heightPixel(20),
    paddingBottom: heightPixel(20),
  },
  footer: {
    paddingHorizontal: widthPixel(20),
    paddingVertical: heightPixel(20),
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: heightPixel(10),
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: heightPixel(12),
    paddingHorizontal: widthPixel(20),
    borderRadius: widthPixel(8),
    backgroundColor: '#FF4444',
    width: '100%',
    maxWidth: widthPixel(200),
  },
  logoutIcon: {
    fontSize: fontPixel(16),
    marginRight: widthPixel(8),
  },
  logoutText: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.semibold,
  },
});

export default CustomDrawer;
