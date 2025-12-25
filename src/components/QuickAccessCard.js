import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from '../styles/theme';
import { useTranslation } from 'react-i18next';

export default function QuickAccessCard({ title,onPress }) {
  const { t } = useTranslation();
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.icon} >
                    <Ionicons style={{alignSelf:'center',marginTop:6}} name={title===t('home.bookmarked')?"bookmark":title===t('home.downloaded') ?'download':'folder-sharp'}size={20} color={colors.primary} />

      </View>
      
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: '30%', backgroundColor: '#fff', paddingVertical: 18, borderRadius: 12, alignItems: 'center', elevation: 2,alignSelf:'center' },
  icon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#E6F6FF', marginBottom: 8 },
  title: { fontSize: 13, textAlign: 'center', fontWeight: '600' }
});
