import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default function TopLawCard({ item }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.badge}><Text style={styles.badgeText}>{item.title}</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: 160, height: 100, borderRadius: 12, marginRight: 12, overflow: 'hidden', backgroundColor: '#eee' },
  image: { width: '100%', height: '100%' },
  badge: { position: 'absolute', left: 8, bottom: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6 },
  badgeText: { color: '#fff', fontSize: 13, fontWeight: '700' }
});
