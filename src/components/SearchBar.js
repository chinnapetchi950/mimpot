import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../styles/theme';
import { useTranslation } from 'react-i18next';

export default function SearchBar({ value, onChangeText, onSearch, onFilterPress }) {
  const { t } = useTranslation();
  return (
    <View style={styles.wrap}>
      {/* Search Input with Icon */}
      <View style={styles.search}>
        <TouchableOpacity onPress={onSearch}>
          <Ionicons name="search" size={18} color="#9AA0A6" />
        </TouchableOpacity>
        <TextInput
          placeholder={t('search.search_placeholder')}
            placeholderTextColor="#888"
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
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
      shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 6 },

  elevation: 14,
  },
  input: { marginLeft: 8, fontSize: 15, color: '#000', flex: 1,paddingTop: 10 },
  filter: { marginLeft: 12, backgroundColor: '#fff', padding: 10, borderRadius: 10, elevation: 2 },
});


// const styles = StyleSheet.create({
//   wrap: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 18,
//     marginTop: 12,
//   },
//   search: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 999,
//     paddingHorizontal: 14,
//     height: 48,  
//     width:'90%',             // ✅ fixed height
//     flexDirection: 'row',
//     alignItems: 'center',
//     elevation: 2,
//   },
//   input: {
//     marginLeft: 8,
//     fontSize: 15,
//     color: colors.text,
//     flex: 1,
//     height: '100%',           // ✅ fill container
//     paddingVertical: 0,       // ✅ no jumping
//     textAlignVertical: 'center', // ✅ Android fix
//   },
// });
// import React, { useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { colors } from '../styles/theme';
// import { useTranslation } from 'react-i18next';

// export default function AnimatedSearchBar({
//   value,
//   onChangeText,
//   onSearch,
// }) {
//   const { t } = useTranslation();

//   const animated = useRef(new Animated.Value(value ? 1 : 0)).current;

//   useEffect(() => {
//     Animated.timing(animated, {
//       toValue: value ? 1 : 0,
//       duration: 200,
//       useNativeDriver: false,
//     }).start();
//   }, [value]);

//   const labelStyle = {
//     position: 'absolute',
//     left: 44,
//     top: animated.interpolate({
//       inputRange: [0, 1],
//       outputRange: [12, -6],
//     }),
//     fontSize: animated.interpolate({
//       inputRange: [0, 1],
//       outputRange: [14, 11],
//     }),
//     color: animated.interpolate({
//       inputRange: [0, 1],
//       outputRange: ['#9AA0A6', '#6B7280'],
//     }),
//   };

//   return (
//     <View style={styles.wrap}>
//       <View style={styles.search}>
//         <TouchableOpacity onPress={onSearch}>
//           <Ionicons name="search" size={18} color="#9AA0A6" />
//         </TouchableOpacity>

//         <Animated.Text style={labelStyle}>
//           {t('search.search_placeholder')}
//         </Animated.Text>

//         <TextInput
//           style={styles.input}
//           value={value}
//           onChangeText={onChangeText}
//           onFocus={() =>
//             Animated.timing(animated, {
//               toValue: 1,
//               duration: 200,
//               useNativeDriver: false,
//             }).start()
//           }
//           onBlur={() => {
//             if (!value) {
//               Animated.timing(animated, {
//                 toValue: 0,
//                 duration: 200,
//                 useNativeDriver: false,
//               }).start();
//             }
//           }}
//           returnKeyType="search"
//           onSubmitEditing={onSearch}
//           underlineColorAndroid="transparent"
//         />

//         {value?.length > 0 && (
//           <TouchableOpacity onPress={() => onChangeText('')}>
//             <Ionicons name="close" size={20} color="#666" />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// }
