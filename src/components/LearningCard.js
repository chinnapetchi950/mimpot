import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function LearningCard({ item }) {
  return (
    <View style={styles.wrap}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <TouchableOpacity style={styles.play}>
        <Text style={{ fontSize: 18, color: '#fff' }}>▶</Text>
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.by}>{item.author}</Text>
        <Text numberOfLines={2} style={styles.desc}>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: 18, marginTop: 12, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 3 },
  image: { width: '100%', height: 180 },
  play: { position: 'absolute', left: '45%', top: 70, backgroundColor: 'rgba(42,168,242,0.95)', width: 54, height: 54, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  info: { padding: 14 },
  title: { fontSize: 16, fontWeight: '800' },
  by: { color: '#6B7280', marginTop: 6, fontSize: 13 },
  desc: { color: '#374151', marginTop: 8, fontSize: 13 }
});
