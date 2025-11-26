import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, FlatList, TouchableOpacity,StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeatureSlide from '../components/FeatureSlide';
import theme from '../styles/theme';
const { width } = Dimensions.get('window');

const slides = [
  //{ key: '1', image: require('../assets/images/hero.png'), title: 'SMART SEARCH & DOWNLOAD', text: 'Easily search and find legal texts using powerful keyword and category filters, designed for quick access.' },
  { key: '1', image: require('../assets/images/mask2.png'), title: 'EXPLORE TAX LAWS', text: 'Browse and explore comprehensive legal documents, tax articles, and official decrees, all in one platform.',text2:'Stay informed, updated, and  tax law insights anytime.' },
  { key: '2', image: require('../assets/images/mask1.png'), title: 'STAY UPDATED', text: 'Download documents instantly for offline reading and stay informed with latest tax law updates.',text2:'' },
];

export default function OnboardingScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const ref = useRef(null);

  const onViewRef = React.useRef(({ changed }) => {
    if (changed && changed.length) setIndex(changed[0].index);
  });
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
  translucent
  backgroundColor="transparent"
  barStyle="dark-content"
/>
      <FlatList
        ref={ref}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item=>item.key}
        renderItem={({item})=> <FeatureSlide {...item} />}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i===index && styles.activeDot]} />
          ))}
        </View>

        <TouchableOpacity style={styles.getStarted} onPress={()=> {
          if(index === slides.length-1) navigation.replace('Welcome');
          else ref.current.scrollToIndex({index: index+1});
        }}>
          <Text style={styles.getText}>{ index === slides.length-1 ? 'Get Started' : 'Next' }</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#fff'},
  footer:{flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:20,backgroundColor:'#fff'},
  dots:{flexDirection:'row', alignItems:'center', gap:8},
  dot:{width:8,height:8, borderRadius:4, borderWidth:1, borderColor:'#8fbfdd', marginRight:8},
  activeDot:{width:12, height:12, borderRadius:6, backgroundColor: theme.colors.primary, borderWidth:0},
  getStarted:{backgroundColor:theme.colors.primary, paddingVertical:12, paddingHorizontal:22, borderRadius:24},
  getText:{color:'#fff',fontSize:16, fontWeight:'700'}
});
