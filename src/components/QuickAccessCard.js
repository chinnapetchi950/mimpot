import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../styles/theme';
import { useTranslation } from 'react-i18next';
import { useDevice } from '../utils/useDeviceLayout';

export default function QuickAccessCard({ title, onPress }) {
  const { t } = useTranslation();
  const { width, deviceType, ui } = useDevice();

  /* 🔢 Columns by device */
  const columns =
    deviceType === 'tablet'
      ? 3
      : deviceType === 'unfolded'
      ? 3
      : 3;

  const spacing = ui.spacing.sm;
  const cardWidth =
    (width - 15 * (columns + 1)) / columns;

  const styles = createStyles(cardWidth, ui);

  const iconName =
    title === t('home.bookmarked')
      ? 'bookmark'
      : title === t('home.downloaded')
      ? 'download'
      : 'folder-sharp';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.icon}>
        <Ionicons
          name={iconName}
          size={ui.font.h2}
          color={colors.primary}
        />
      </View>

      <Text numberOfLines={2} style={styles.title}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}


const createStyles = (width, ui) =>
  StyleSheet.create({
    card: {
      width,
      backgroundColor: '#fff',
      paddingVertical: ui.spacing.md,
      borderRadius: 12,
      alignItems: 'center',
      elevation: 2,
      marginBottom: ui.spacing.md,
    },

    icon: {
      width: ui.image.avatar * 0.35,
      height: ui.image.avatar * 0.35,
      borderRadius: 12,
      backgroundColor: '#E6F6FF',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: ui.spacing.sm,
    },

    title: {
      fontSize: ui.font.small,
      textAlign: 'center',
      fontWeight: '600',
      color: '#111',
    },
  });

