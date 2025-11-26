import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={{fontSize:20,fontWeight:'700'}}>Home</Text>
      <Text style={{marginTop:8}}>Welcome to M.impôt</Text>
    </View>
  );
}
const styles = StyleSheet.create({container:{flex:1,alignItems:'center',justifyContent:'center'}})
