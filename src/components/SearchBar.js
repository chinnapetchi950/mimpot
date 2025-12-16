import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../styles/theme';
import strings from '../localization/en';

export default function SearchBar({ value, onChangeText, onSearch, onFilterPress }) {
  return (
    <View style={styles.wrap}>
      {/* Search Input with Icon */}
      <View style={styles.search}>
        <TouchableOpacity onPress={onSearch}>
          <Ionicons name="search" size={18} color="#9AA0A6" />
        </TouchableOpacity>
        <TextInput
          placeholder={strings.search.search_placeholder}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          onSubmitEditing={onSearch} // allows search on keyboard "search"
        />
        {value.length > 0 ?
        <TouchableOpacity onPress={() => onChangeText("")}>
          <Ionicons name="close" size={20} color="#666" style={{ marginRight: 8 }} />
        </TouchableOpacity>:null}
      </View>

      {/* Filter Button */}
      {/* <TouchableOpacity style={styles.filter} onPress={onFilterPress}>
        <Ionicons name="filter" size={18} color={colors.primary} />
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, marginTop: 12 },
  search: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  input: { marginLeft: 8, fontSize: 15, color: colors.text, flex: 1 },
  filter: { marginLeft: 12, backgroundColor: '#fff', padding: 10, borderRadius: 10, elevation: 2 },
});
