import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TaxLawScreen() {
  return (
    <View style={styles.center}><Text>Tax Law Screen</Text></View>
  );
}
const styles = StyleSheet.create({ center: { flex:1, alignItems:'center', justifyContent:'center' }});
