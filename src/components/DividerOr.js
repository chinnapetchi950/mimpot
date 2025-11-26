import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DividerOr(){
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.or}>OR</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flexDirection:'row', alignItems:'center', marginTop:18 },
  line:{ flex:1, height:1, backgroundColor:'#e6e6e6' },
  or:{ marginHorizontal:12, color:'#9b9b9b' }
});
