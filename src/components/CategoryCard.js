import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../styles/theme';import { onPress } from 'deprecated-react-native-prop-types/DeprecatedTextPropTypes';
;
import ImageWithLoader from './ImageWithloader';
export default function CategoryCard({ item,onPress }) {
   const BASE_URL = 'http://testlink2.pillersofttechnologies.com/storage/'; // Your base URL
    
  
    
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.iconWrap}>
       <ImageWithLoader source={{ uri: `${BASE_URL}${item.image}` }}
        style={styles.icon} />
      </View>
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: '30%', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, alignItems: 'flex-start', elevation: 2, marginHorizontal: 6 },
  iconWrap: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#F3F8FF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  icon: { width: 28, height: 28 },
  title: { fontSize: 13, fontWeight: '600', color: colors.text }
});
