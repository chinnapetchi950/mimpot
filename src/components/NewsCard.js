import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import ImageWithLoader from './ImageWithloader';
import { useTranslation } from 'react-i18next';
import { useDevice } from '../utils/useDeviceLayout'; // adjust path

export default function NewsCard({ item, onPress }) {
  const { t } = useTranslation();
  const { width, deviceType, ui } = useDevice();

  const BASE_URL = 'http://testlink2.pillersofttechnologies.com/storage/';

  const imageUrl = item.image?.startsWith('http')
    ? item.image
    : `${BASE_URL}${item.image}`;

  // 🔥 dynamic grid width
  const columns =
    deviceType === 'tablet'
      ? 3
      : deviceType === 'unfolded'
      ? 3
      : 2;

  const spacing = ui.spacing.md;
  const cardWidth =
    (width - spacing * (columns + 1)) / columns;

  const styles = createStyles(cardWidth, deviceType, ui);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.card}
    >
      <ImageWithLoader
        source={{ uri: imageUrl }}
        style={styles.image}
      />

      <View style={styles.body}>
        <Text numberOfLines={2} style={styles.title}>
          {item.title}
        </Text>

        <Text numberOfLines={2} style={styles.excerpt}>
          {item.excerpt}
        </Text>

        <View style={styles.row}>
          <Text style={styles.date}>
            {moment(item.created_at).format('DD-MM-YYYY')}
          </Text>

          <Text style={styles.read}>
            {t('news.read_more')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}


const createStyles = (width, deviceType, ui) =>
  StyleSheet.create({
    card: {
      width,
      backgroundColor: '#fff',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: ui.spacing.md,
      elevation: 2,
    },

    image: {
      width: '100%',
      height:
        deviceType === 'tablet'
          ? 160
          : deviceType === 'unfolded'
          ? 140
          : 110,
      resizeMode: 'cover',
    },

    body: {
      padding: ui.spacing.sm,
    },

    title: {
      fontWeight: '700',
      fontSize: ui.font.body,
      marginBottom: 6,
      color: '#111',
    },

    excerpt: {
      color: '#6B7280',
      fontSize: ui.font.small,
    },

    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: ui.spacing.sm,
    },

    date: {
      color: '#9CA3AF',
      fontSize: ui.font.small - 1,
    },

    read: {
      color: '#2563EB',
      fontSize: ui.font.small,
      fontWeight: '600',
    },
  });


