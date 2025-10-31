import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../../utils/colors';
import { useThemeContext } from '../../theme/ThemeContext';
import { fontPixel, heightPixel, widthPixel } from '../../utils/constants';
import { fontFamilies } from '../../utils/fontfamilies';

type Props = {
  icon: string;
  label: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  containerStyle?: ViewStyle;
  showChevron?: boolean;
};

const SettingsRow: React.FC<Props> = ({
  icon,
  label,
  onPress,
  rightElement,
  containerStyle,
  showChevron = true,
}) => {
  const { isDark } = useThemeContext();
  const themeColors = colors[isDark ? 'dark' : 'light'];
  const RowWrapper: any = onPress ? TouchableOpacity : View;

  return (
    <RowWrapper
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.item,
        { backgroundColor: themeColors.background },
        containerStyle,
      ]}
    >
      <Text style={styles.itemIcon}>{icon}</Text>
      <Text style={[styles.itemText, { color: themeColors.text }]}>
        {label}
      </Text>
      {rightElement}
      {showChevron && !rightElement ? (
        <Text style={styles.chevron}>›</Text>
      ) : null}
    </RowWrapper>
  );
};

export default SettingsRow;

const styles = StyleSheet.create({
  item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: heightPixel(12),
    paddingHorizontal: widthPixel(14),
    borderRadius: widthPixel(10),
    marginBottom: heightPixel(8),
    elevation: 1,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
  },
  itemIcon: {
    width: widthPixel(24),
    textAlign: 'center',
    marginRight: widthPixel(10),
  },
  itemText: {
    flex: 1,
    fontSize: fontPixel(15),
    fontFamily: fontFamilies.regular,
  },
  chevron: {
    fontSize: fontPixel(18),
    opacity: 0.5,
  },
});
