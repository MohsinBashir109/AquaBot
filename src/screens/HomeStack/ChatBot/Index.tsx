import { StyleSheet, Text, View, ScrollView } from 'react-native';

import HomeWrapper from '../../../../Wrappers/HomeWrapper';
import React from 'react';
import { UserHeader } from '../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { fontPixel, heightPixel, widthPixel } from '../../../utils/constants';
import { fontFamilies } from '../../../utils/fontfamilies';
import { colors } from '../../../utils/colors';
import { useThemeContext } from '../../../theme/ThemeContext';

const Index = () => {
  const navigation = useNavigation();
  const { isDark } = useThemeContext();
  const themeColors = colors[isDark ? 'dark' : 'light'];

  const handleSettingsPress = () => {
    navigation.navigate('Settings' as never);
  };

  return (
    <HomeWrapper>
      <UserHeader showDrawerButton={true} showBackButton={false} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.chatContainer}>
          <Text style={[styles.title, { color: themeColors.text }]}>
            🤖 AI Chat Assistant
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.secondaryText }]}>
            Ask me anything about irrigation, farming, or water management!
          </Text>

          <View
            style={[
              styles.comingSoonCard,
              { backgroundColor: themeColors.gray6 },
            ]}
          >
            <Text style={[styles.comingSoonText, { color: themeColors.text }]}>
              Chat feature coming soon! 🚀
            </Text>
            <Text
              style={[
                styles.comingSoonSubtext,
                { color: themeColors.secondaryText },
              ]}
            >
              We're working on bringing you an intelligent AI assistant to help
              with your farming questions.
            </Text>
          </View>
        </View>
      </ScrollView>
    </HomeWrapper>
  );
};

export default Index;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: widthPixel(20),
  },
  chatContainer: {
    alignItems: 'center',
    marginTop: heightPixel(20),
  },
  title: {
    fontSize: fontPixel(24),
    fontFamily: fontFamilies.bold,
    textAlign: 'center',
    marginBottom: heightPixel(8),
  },
  subtitle: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.regular,
    textAlign: 'center',
    marginBottom: heightPixel(30),
  },
  comingSoonCard: {
    padding: widthPixel(20),
    borderRadius: widthPixel(12),
    alignItems: 'center',
    width: '100%',
  },
  comingSoonText: {
    fontSize: fontPixel(18),
    fontFamily: fontFamilies.semibold,
    textAlign: 'center',
    marginBottom: heightPixel(8),
  },
  comingSoonSubtext: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    textAlign: 'center',
    lineHeight: fontPixel(20),
  },
});
