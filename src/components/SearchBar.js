import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../styles/theme';

export default function SearchBar() {
  return (
    <View style={styles.wrap}>
      <View style={styles.search}>
        <Ionicons name="search" size={18} color="#9AA0A6" />
        <TextInput placeholder="Search laws, articles, or advice..." style={styles.input} />
      </View>
      <TouchableOpacity style={styles.filter}>
        <Ionicons name="filter" size={18} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, marginTop: 12 },
  search: { flex: 1, backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  input: { marginLeft: 8, fontSize: 15, color: theme.colors.text, flex: 1 },
  filter: { marginLeft: 12, backgroundColor: '#fff', padding: 10, borderRadius: 10, elevation: 2 }
});
