import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import moment from 'moment';
import ImageWithLoader from './ImageWithloader';
import { useTranslation } from 'react-i18next';

export default function NewsCard({ item, onPress }) {
  const { t } = useTranslation();
  const BASE_URL = 'http://testlink2.pillersofttechnologies.com/storage/';
const imageUrl = item.image?.startsWith('http')
  ? item.image
  : `${BASE_URL}${item.image}`;
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <ImageWithLoader
        source={{ uri:imageUrl }}
        style={styles.image}
      />
      <View style={styles.body}>
        <Text style={styles.title}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.excerpt}>
          {item.excerpt}
        </Text>
        <View style={styles.row}>
          <Text style={styles.date}>
            {moment(item.created_at).format('DD-MM-YYYY')}
          </Text>
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.read}>{t('news.read_more')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 12, elevation: 2 },
  image: { width: '100%', height: 100 },
  body: { padding: 10 },
  title: { fontWeight: '700', fontSize: 13, marginBottom: 6 },
  excerpt: { color: '#6B7280', fontSize: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  date: { color: '#9CA3AF', fontSize: 11 },
  read: { color: '#2563EB', fontSize: 12, fontWeight: '600' }
});
