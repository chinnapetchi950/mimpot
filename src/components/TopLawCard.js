import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ImageWithLoader from './ImageWithloader';
import { useDevice } from '../utils/useDeviceLayout'; // adjust path

export default function TopLawCard({ item, onPress }) {
  const { deviceType, ui } = useDevice();

  const BASE_URL =
    'http://testlink2.pillersofttechnologies.com/storage/';

  const styles = createStyles(deviceType, ui);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.card}
    >
      <ImageWithLoader
        source={{ uri: `${BASE_URL}${item.image}` }}
        style={styles.image}
      />

      <View style={styles.badge}>
        <Text style={styles.badgeText} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}


const createStyles = (deviceType, ui) =>
  StyleSheet.create({
    card: {
      width:
        deviceType === 'tablet'
          ? 260
          : deviceType === 'unfolded'
          ? 220
          : 160,

      height:
        deviceType === 'tablet'
          ? 160
          : deviceType === 'unfolded'
          ? 130
          : 100,

      borderRadius:12,
      marginRight: ui.spacing.md,
      overflow: 'hidden',
      backgroundColor: '#eee',
    },

    image: {
      width: '100%',
      height: '100%',
    },

    badge: {
      position: 'absolute',
      left: ui.spacing.sm,
      bottom: ui.spacing.sm,
      backgroundColor: 'rgba(0,0,0,0.6)',
      paddingHorizontal: ui.spacing.sm,
      paddingVertical: 6,
      borderRadius: ui.radius / 3,
      maxWidth: '90%',
    },

    badgeText: {
      color: '#fff',
      fontSize:
        deviceType === 'tablet'
          ? 16
          : deviceType === 'unfolded'
          ? 15
          : 13,
      fontWeight: '700',
    },
  });

