import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/theme';
import ImageWithLoader from './ImageWithloader';
import { useDevice } from '../utils/useDeviceLayout'; // adjust path

export default function CategoryCard({ item, onPress }) {
  const { width, deviceType, ui } = useDevice();

  const BASE_URL = 'http://testlink2.pillersofttechnologies.com/storage/';
  const styles = createStyles(width, deviceType, ui);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.card}>
      <View style={styles.iconWrap}>
        <ImageWithLoader
          source={{ uri: `${BASE_URL}${item.image}` }}
          style={styles.icon}
        />
      </View>
      <Text numberOfLines={2} style={styles.title}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}

const createStyles = (width, deviceType, ui) => {
  // Number of columns based on device type
  const columns = deviceType === 'tablet' ? 3 : deviceType === 'unfolded' ? 4 : 3;
  const spacing = ui.spacing.md;
  const horizontalPadding = spacing * 2; // container padding

  const cardWidth = (width - horizontalPadding - spacing * (columns - 1)) / columns;

  return StyleSheet.create({
    card: {
      width: cardWidth,
      backgroundColor: '#fff',
        borderRadius: 12,
    // padding: 14,
      padding: ui.spacing.sm,
      marginBottom: spacing,
      alignItems: 'center',
      elevation: 2,
    },
    iconWrap: {
      width: deviceType === 'tablet' ? 56 : deviceType === 'unfolded' ? 50 : 44,
      height: deviceType === 'tablet' ? 56 : deviceType === 'unfolded' ? 50 : 44,
      borderRadius: 12,
      backgroundColor: '#F3F8FF',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: ui.spacing.sm,
    },
    icon: {
      width: deviceType === 'tablet' ? 34 : deviceType === 'unfolded' ? 30 : 28,
      height: deviceType === 'tablet' ? 34 : deviceType === 'unfolded' ? 30 : 28,
      resizeMode: 'contain',
    },
    title: {
      fontSize: deviceType === 'tablet' ? 15 : deviceType === 'unfolded' ? 14 : 13,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
  });
};


// export default function CategoryCard({ item,onPress }) {
//    const BASE_URL = 'http://testlink2.pillersofttechnologies.com/storage/'; // Your base URL
    
  
    
//   return (
//     <TouchableOpacity onPress={onPress} style={styles.card}>
//       <View style={styles.iconWrap}>
//        <ImageWithLoader source={{ uri: `${BASE_URL}${item.image}` }}
//         style={styles.icon} />
//       </View>
//       <Text style={styles.title}>{item.name}</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   card: { width: '30%', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, alignItems: 'flex-start', elevation: 2, marginHorizontal: 6 },
//   iconWrap: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#F3F8FF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
//   icon: { width: 28, height: 28 },
//   title: { fontSize: 13, fontWeight: '600', color: colors.text }
// });
