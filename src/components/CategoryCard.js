import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import theme from '../styles/theme';

export default function CategoryCard({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Image source={{ uri: item.icon }} style={styles.icon} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '30%', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, alignItems: 'flex-start', elevation: 2, marginHorizontal: 6 },
  iconWrap: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#F3F8FF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  icon: { width: 28, height: 28 },
  title: { fontSize: 13, fontWeight: '600', color: theme.colors.text }
});
