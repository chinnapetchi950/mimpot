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



export default function QuickActionsScreen({route, navigation }) {
      const { title } = route.params; // contains { id }

  const [topLawData, setTopLawData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [learning, setLearning] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState(''); // ✅ search text
const [activeTab, setActiveTab] = useState('all'); // 'all' or 'news'

const tabsData = [
  { key: 'all', label: 'BookMark' },
  { key: 'news', label: 'News Bookmark' },
];

  const dispatch = useDispatch();
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

    if (title === "Bookmarked") {
      res =
        activeTab === 'news'
          ? await authService.newsBookmarklist()
          : await authService.bookmarked();
    } else if (title === "Recently Viewed") {
      res = await authService.recent_viewed();
    } else {
      res = await authService.downloads();
    }

    const rawData = res?.data?.data;

    const apiData = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.data)
      ? rawData.data
      : [];

    const videoData = apiData.filter(item => item?.type === "video");
    const newsData = apiData.filter(item => item?.type !== "video");

    setNews(newsData);
    setLearning(videoData);
    
  } catch (error) {
    console.log("fetchquickActions error", error);
  } finally {
    setLoading(false); 
  }
};


 

 useEffect(() => {
  fetchquickActions();
}, [activeTab]); 
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 10 }}>Loading...</Text>
        </View>
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

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        backgroundColor={'#FFFFFF'}
        barStyle={'dark-content'}
      ></StatusBar>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={{ width: 30 }} />
        </View>
        {title === 'Bookmarked' && (
  <Tabs tabs={tabsData} activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        
{/* {title === 'Bookmarked' && (
  
  <View style={styles.tabContainer}>
    {['All', 'News'].map(tab => (
      <TouchableOpacity
        key={tab}
        style={[styles.tabButton, activeTab === tab && styles.activeTab]}
        onPress={() => setActiveTab(tab)}
      >
        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
          {tab}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
)} */}
{title === 'Bookmarked' ? (
  <>
    {activeTab === 'news' ? (
      news?.length > 0 ? (
        <View style={styles.newsGrid}>
          {news.map(item => (
            <NewsCard
              key={item.id}
              item={item}
              onPress={() => navigation.navigate('NewDetailsScreen', { item })}
            />
          ))}
        </View>
      ) : (
        <Text style={styles.noData}>No News Found</Text>
      )
    ) : (
      // 'All' tab
      <>
        {news?.length === 0 && learning?.length === 0 ? (
          <Text style={styles.noData}>No Data Found</Text>
        ) : (
          <>
            <View style={styles.newsGrid}>
              {news.map(item => (
                <NewsCard
                  key={item.id}
                  item={item}
                  onPress={() => navigation.navigate('NewDetailsScreen', { item })}
                />
              ))}
            </View>
            {learning?.map(l => (
              <LearningCard
                key={l.id}
                item={l}
                onPress={() => navigation.navigate('DetailsScreen', { categoryId: l.id })}
              />
            ))}
          </>
        )}
      </>
    )}
  </>
) : (<>
        {news?.length === 0 && learning?.length === 0? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            {/* <Ionicons name="information-circle-outline" size={40} color="#888" /> */}
            <Text style={{ fontSize: 14, color: '#888', marginTop: 10 }}>
              No Data Found
            </Text>
          </View>
        ) : (
          <View style={styles.newsGrid}>
            {news.map(item => (
              <NewsCard
                onPress={() => {
                  console.log(item),
                    navigation.navigate('NewDetailsScreen', { item });
                }}
                key={item.id}
                item={item}
              />
            ))}
          </View>
        )}
       
          {learning?.map(l => (
            <LearningCard
              onPress={selectedItem => {
                console.log('Card clicked:', l);
                navigation.navigate('DetailsScreen', { categoryId: l.id });
              }}
              key={l.id}
              item={l}
            />
          ))}
        
</>)}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
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
