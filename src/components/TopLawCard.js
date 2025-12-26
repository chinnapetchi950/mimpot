import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import ImageWithLoader from './ImageWithloader';
const { width } = Dimensions.get('window');

export default function TopLawCard({ item ,onPress }) {
  console.log("item---->",item);
  const BASE_URL = 'http://testlink2.pillersofttechnologies.com/storage/'; // Your base URL
  

  return (
    <TouchableOpacity onPress={()=>onPress()} style={styles.card}>
      <ImageWithLoader source={{ uri: `${BASE_URL}${item.image}` }}  
      style={styles.image} />
      <View style={styles.badge}><Text style={styles.badgeText}>{item.name}</Text></View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: 160, height: 100, borderRadius: 12, marginRight: 12, overflow: 'hidden', backgroundColor: '#eee' },
  image: { width: '100%', height: '100%' },
  badge: { position: 'absolute', left: 8, bottom: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6 },
  badgeText: { color: '#fff', fontSize: 13, fontWeight: '700' }
});
