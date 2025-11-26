import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import theme from '../styles/theme';

export default function PrimaryButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} accessibilityRole="button" accessible>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn:{backgroundColor: theme.colors.primary, paddingVertical:14, borderRadius:28, alignItems:'center', marginTop:12},
  text:{color:'#fff', fontWeight:'700', fontSize:16}
});
