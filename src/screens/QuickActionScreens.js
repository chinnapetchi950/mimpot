import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../styles/theme';
import SearchBar from '../components/SearchBar';
import TopLawCard from '../components/TopLawCard';
import CategoryCard from '../components/CategoryCard';
import LearningCard from '../components/LearningCard';
import QuickAccessCard from '../components/QuickAccessCard';
import NewsCard from '../components/NewsCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../api/authService';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../components/CustomHeader';
import Storage from '../utils/storage';
import { setUser, setToken } from '../store/userSlice';
const { width } = Dimensions.get('window');
import Tabs from '../components/Tabs';
import { useTranslation } from 'react-i18next';
import { getLocalizedValue } from '../utils/localization';
import i18n from '../localization/i18n';
import ArticleCard from '../components/ArticleCard';
import { useDevice } from '../utils/useDeviceLayout';

export default function QuickActionsScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { title, type } = route.params;
  const currentLang = i18n.language || 'en';
 const { ui } = useDevice();

  const [topLawData, setTopLawData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [learning, setLearning] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState(''); // ✅ search text
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'news'

  const dispatch = useDispatch();

  const tabsData = [
    { key: 'all', label: t('quick_actions.bookmark') },
    { key: 'news', label: t('quick_actions.news_bookmark') },
  ];
  const { user, token } = useSelector(state => state.user);
  console.log(user?.user, 'Redux user data'); //console.log(user,"data");
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = await Storage.getItem('userData');
      const storedToken = await Storage.getItem('token');

      dispatch(setUser(storedUser));
      dispatch(setToken(storedToken));
    };

    checkAuth();
  }, []); // only once

  const fetchquickActions = async () => {
    try {
      setLoading(true); // ✅ START loader

      let res = null;

      if (type === 'bookmarked') {
        res =
          activeTab === 'news'
            ? await authService.newsBookmarklist()
            : await authService.bookmarked();
      } else if (type === 'recent') {
        res = await authService.recent_viewed();
      } else {
        res = await authService.downloads();
      }
      console.log(res, 'bookmark');

      const rawData = res?.data?.data;

      const apiData = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];

      const videoData = apiData.filter(item => item?.type === 'video');
      const newsData = apiData.filter(item => item?.type !== 'video');
      console.log(videoData, newsData, 'newsData');

      setNews(newsData);
      setLearning(videoData);
    } catch (error) {
      console.log('fetchquickActions error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchquickActions();
  }, [activeTab]);
  if (loading) {
    return (
       <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: ui.spacing.sm }}>{t('quick_actions.loading')}</Text>
      </SafeAreaView>
    );
  }
  const handleSearch = () => {
    fetchHome_search();
  };
  const isAllEmpty =
    topLawData?.length === 0 &&
    categories?.length === 0 &&
    learning?.length === 0 &&
    news?.length === 0;
  const normalizeNewsItem = item => {
    return {
      ...item,
      title: getLocalizedValue(item, 'title', currentLang),
      description: getLocalizedValue(item, 'description', currentLang),
      excerpt: getLocalizedValue(item, 'excerpt', currentLang),
    };
  };
  return (
  <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomHeader
      
        title={title}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={ui.font.h2} color="#000" />
          </TouchableOpacity>
        }
        rightComponent={() => <View style={{ width: ui.spacing.lg }} />}
      />

      {type === 'bookmarked' && (
        <Tabs tabs={tabsData} activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <ScrollView contentContainerStyle={{ padding: ui.spacing.md }}>
        {isAllEmpty ? (
          <Text style={{ textAlign: 'center', marginTop: ui.spacing.xl, fontSize: ui.font.body, color: '#888' }}>
            {t('quick_actions.no_data_found')}
          </Text>
        ) : (
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {news.map(item => {
                const normalized = normalizeNewsItem(item);
                return (
                  <ArticleCard
                    key={item.id}
                    item={normalized}
                    onPress={() =>
                      navigation.navigate('ArticleDetailsScreen', { categoryId: item.id })
                    }
                    onDownload={() => console.log('Download', item.id)}
                  />
                );
              })}
            </View>

            {learning.map(item => {
              const title = getLocalizedValue(item, 'title');
              const description = getLocalizedValue(item, 'description');

              return (
                <LearningCard
                  key={item.id}
                  item={{ ...item, title, description }}
                  onPress={() =>
                    navigation.navigate('DetailsScreen', { categoryId: item.id })
                  }
                />
              );
            })}
          </>
        )}

        <View style={{ height: ui.spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { paddingBottom: 20 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 8,
  },
  greeting: { fontSize: 20, fontWeight: '700', color: colors.text },
  flag: { width: 36, height: 36, borderRadius: 18 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 18,
    paddingHorizontal: 18,
    color: colors.text,
  },
  seeAll: { color: colors.muted, fontSize: 13, marginRight: 18 },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginTop: 8,
  },
  newsGrid: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  langBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  flag: {
    width: 22,
    height: 22,
    borderRadius: 50,
    marginRight: 5,
  },

  langText: {
    fontSize: 14,
    marginRight: 4,
    color: '#000',
  },
  header: {
    paddingTop: 15,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 15,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    marginRight: 25,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  noData: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
    color: '#888',
  },
});
