import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function QuickAccessCard({ title }) {
  return (
    <View style={styles.card}>
      <View style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '30%', backgroundColor: '#fff', paddingVertical: 18, borderRadius: 12, alignItems: 'center', elevation: 2 },
  icon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#E6F6FF', marginBottom: 8 },
  title: { fontSize: 13, textAlign: 'center', fontWeight: '600' }
});
