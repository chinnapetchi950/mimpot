import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Image, Dimensions } from 'react-native';
import theme from '../styles/theme';
import SearchBar from '../components/SearchBar';
import TopLawCard from '../components/TopLawCard';
import CategoryCard from '../components/CategoryCard';
import LearningCard from '../components/LearningCard';
import QuickAccessCard from '../components/QuickAccessCard';
import NewsCard from '../components/NewsCard';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');

const topLawData = [
  { id: '1', title: 'Tax Regulation', image: 'https://picsum.photos/300/200?random=1' },
  { id: '2', title: 'Legal Tax Advices', image: 'https://picsum.photos/300/200?random=2' },
  { id: '3', title: 'Others Tax Laws', image: 'https://picsum.photos/300/200?random=3' },
  { id: '4', title: 'Tax Regulation', image: 'https://picsum.photos/300/200?random=4' },
];

const categories = [
  { id: 'c1', title: 'Civil Laws', icon: 'https://picsum.photos/60?random=11' },
  { id: 'c2', title: 'Criminal Laws', icon: 'https://picsum.photos/60?random=12' },
  { id: 'c3', title: 'Business & Corporate', icon: 'https://picsum.photos/60?random=13' },
  { id: 'c4', title: 'International Laws', icon: 'https://picsum.photos/60?random=14' },
  { id: 'c5', title: 'Constitutional Laws', icon: 'https://picsum.photos/60?random=15' },
];

const learning = [
  { id: 'l1', title: 'How To Create An Enterprise', author: 'By M.Jmpot', image: 'https://picsum.photos/800/450?random=21' },
  { id: 'l2', title: 'How To Create An Enterprise', author: 'By M.Jmpot', image: 'https://picsum.photos/800/450?random=22' },
];

const news = new Array(4).fill(0).map((_, i) => ({
  id: `n${i}`,
  title: 'New Tax Reform Act 2025 – What You Need to Know.',
  excerpt: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor...',
  date: '05-08-2025',
  image: 'https://picsum.photos/400/200?random=' + (30 + i),
}));

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>Hi Albert</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: 'https://picsum.photos/40' }} style={styles.flag} />
          </View>
        </View>

        <SearchBar />

        <Text style={styles.sectionTitle}>Explore Tax Laws</Text>
        <FlatList
          data={topLawData}
          keyExtractor={(i)=>i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          renderItem={({item}) => <TopLawCard item={item} />}
        />

        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Explore Legal Categories</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        <View style={styles.categoriesWrap}>
          {categories.map(cat => <CategoryCard key={cat.id} item={cat} />)}
        </View>

        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Your Legal Learning Hub</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        {learning.map(l => <LearningCard key={l.id} item={l} />)}

        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Quick Ascess</Text>
        <View style={styles.quickRow}>
          <QuickAccessCard title="Bookmarked" />
          <QuickAccessCard title="Downloaded" />
          <QuickAccessCard title="Recently Viewed" />
        </View>

        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Latest News Updates</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        <View style={styles.newsGrid}>
          {news.map(n => <NewsCard key={n.id} item={n} />)}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  container: { paddingBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, marginTop: 8 },
  greeting: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
  flag: { width: 36, height: 36, borderRadius: 18 },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginTop: 18, paddingHorizontal: 18, color: theme.colors.text },
  seeAll: { color: theme.colors.muted, fontSize: 13, marginRight: 18 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 },
  categoriesWrap: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, justifyContent: 'space-between' },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, marginTop: 8 },
  newsGrid: { paddingHorizontal: 12, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }
});
