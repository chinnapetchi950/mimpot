import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions,ImageBackground } from 'react-native';
import theme from '../styles/theme';
// import { ImageBackground } from 'react-native/types_generated/index';
const { width, height } = Dimensions.get('window');

export default function FeatureSlide({ image, title, text,text2 }) {
  return (
    <View style={styles.slide}>
      <ImageBackground source={image} style={styles.image} resizeMode="cover" accessible />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>

        <Text style={styles.text}>{text2}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide:{ width: width, alignItems:'center', backgroundColor:'#fff'},
  image:{ width: width, height: height*0.55 },
  content:{ padding:24, alignItems:'center' },
  title:{ fontSize:20, fontWeight:'700', textAlign:'center', marginBottom:14, color:'#1D1D1D' },
  text:{ fontSize:16, lineHeight:24, textAlign:'center', color:'#1D1D1D' }
});
