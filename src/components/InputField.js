// import React from 'react';
// import { View, TextInput, StyleSheet } from 'react-native';

// export default function InputField(props) {
//   return (
//     <View style={styles.container}>
//       <TextInput {...props} style={[styles.input, props.style]} placeholderTextColor="#999" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container:{marginVertical:10},
//   input:{borderWidth:2,fontSize:16, borderColor:'#00000036', borderRadius:12, padding:15}
// });
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default function InputField({
  placeholder,
  value,
  onChangeText,
  onBlur,
  secureTextEntry,
  rightIcon,
  style,
  ...props
}) {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#999"
        {...props}
      />
      {rightIcon && (
        <TouchableOpacity onPress={rightIcon.onPress} style={styles.icon}>
          <Feather name={rightIcon.name} size={20} color="#555" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    position: 'relative',
  },
  input: {
    borderWidth: 2,
    fontSize: 16,
    borderColor: '#00000036',
    borderRadius: 12,
    padding: 15,
    paddingRight: 45, // Add padding to leave space for the icon
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
});
