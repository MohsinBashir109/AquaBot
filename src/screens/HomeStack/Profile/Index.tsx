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

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <HomeWrapper>
      <UserHeader
        showDrawerButton={true}
        showBackButton={false}
        screenTitle="Profile"
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileContainer}>
          <Text style={[styles.title, { color: themeColors.text }]}>
            👤 Profile
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.secondaryText }]}>
            Manage your account and preferences
          </Text>

          <View
            style={[
              styles.comingSoonCard,
              { backgroundColor: themeColors.gray6 },
            ]}
          >
            <Text style={[styles.comingSoonText, { color: themeColors.text }]}>
              Profile features coming soon! 🚀
            </Text>
            <Text
              style={[
                styles.comingSoonSubtext,
                { color: themeColors.secondaryText },
              ]}
            >
              We're working on bringing you comprehensive profile management
              features.
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
    // Removed paddingHorizontal as it's already handled by HomeWrapper
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: heightPixel(10), // Reduced top margin for better spacing
    paddingHorizontal: widthPixel(20), // Add padding here instead of content
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
