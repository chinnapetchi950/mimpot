import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function InputField(props) {
  return (
    <View style={styles.container}>
      <TextInput {...props} style={[styles.input, props.style]} placeholderTextColor="#999" />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{marginVertical:10},
  input:{borderWidth:2,fontSize:16, borderColor:'#00000036', borderRadius:12, padding:15}
});
