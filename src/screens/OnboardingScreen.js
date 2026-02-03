import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import FeatureSlide from '../components/FeatureSlide';
import { colors } from '../styles/theme';
import { useDevice } from '../utils/useDeviceLayout';

export default function OnboardingScreen({ navigation }) {
  const { t } = useTranslation();
  const { width, ui, isTablet, isFolded } = useDevice();

  const [index, setIndex] = useState(0);
  const ref = useRef(null);

  const slides = [
    {
      key: '1',
      image: require('../assets/images/mask2.png'),
      title: t('onboarding.explore_tax_laws'),
      text: t('onboarding.explore_tax_laws_description'),
      text2: t('onboarding.explore_tax_laws_description2'),
    },
    {
      key: '2',
      image: require('../assets/images/mask1.png'),
      title: t('onboarding.stay_updated'),
      text: t('onboarding.stay_updated_description'),
      text2: '',
    },
  ];

  const onViewRef = useRef(({ changed }) => {
    if (changed && changed.length) {
      setIndex(changed[0].index);
    }
  });

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  return (
 <View style={{ flex: 1, backgroundColor: '#000' }}>
      
      {/* TRANSPARENT STATUS BAR */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <FlatList
        ref={ref}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <FeatureSlide
            {...item}
            containerWidth={width}
            imageSize={ui.image.hero}
            titleSize={ui.font.h1}
            textSize={ui.font.body}
          />
        )}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />

      {/* FOOTER */}
      <View
        style={[
          styles.footer,
          {
            paddingHorizontal: ui.padding,
            paddingVertical: isTablet || isFolded ? 28 : 20,
          },
        ]}
      >
        {/* DOTS */}
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={[
            styles.getStarted,
            {
              paddingVertical: isTablet ? 16 : 12,
              paddingHorizontal: isTablet ? 32 : 22,
              borderRadius: ui.radius,
            },
          ]}
          onPress={() => {
            if (index === slides.length - 1) {
              navigation.replace('Welcome');
            } else {
              ref.current.scrollToIndex({ index: index + 1 });
            }
          }}
        >
          <Text
            style={[
              styles.getText,
              { fontSize: ui.button.text },
            ]}
          >
            {index === slides.length - 1
              ? t('onboarding.get_started')
              : t('onboarding.next_button')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container:{flex:1,
    //backgroundColor:'#fff'
  },
  footer:{flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:20,backgroundColor:'#fff'},
  dots:{flexDirection:'row', alignItems:'center', gap:8},
  dot:{width:8,height:8, borderRadius:4, borderWidth:1, borderColor:'#8fbfdd', marginRight:8},
  activeDot:{width:12, height:12, borderRadius:6, backgroundColor: colors.primary, borderWidth:0},
  getStarted:{backgroundColor:colors.primary, paddingVertical:12, paddingHorizontal:22, borderRadius:24},
  getText:{color:'#fff',fontSize:16, fontWeight:'700'}
});
