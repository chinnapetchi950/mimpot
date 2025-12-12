import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/theme';

import SearchBar from '../components/SearchBar';
import TopLawCard from '../components/TopLawCard';
import CategoryCard from '../components/CategoryCard';
import LearningCard from '../components/LearningCard';
import QuickAccessCard from '../components/QuickAccessCard';
import NewsCard from '../components/NewsCard';

import Storage from '../utils/storage';
import CustomHeader from '../components/CustomHeader';

import { authService } from '../api/authService';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setToken } from '../store/userSlice';

const { width } = Dimensions.get('window');


/* --------------------------------------------
    ⭐ GLOBAL SEARCH KEYWORDS  
----------------------------------------------*/
const globalSearchList = [
  { key: "tax", screen: "TaxRegulation", params: { categoryId: 1 } },
  { key: "gst", screen: "TaxRegulation", params: { categoryId: 2 } },
  { key: "income tax", screen: "TaxRegulation", params: { categoryId: 3 } },

  { key: "legal category", screen: "CategoriesScreen" },
  { key: "category", screen: "CategoriesScreen" },

  { key: "learning", screen: "LearningHubScreen" },
  { key: "learning hub", screen: "LearningHubScreen" },

  { key: "news", screen: "NewsScreen" },
  { key: "latest news", screen: "NewsScreen" },

  { key: "bookmarked", screen: "QuickActionsScreen", params: { title: "Bookmarked" }},
  { key: "downloaded", screen: "QuickActionsScreen", params: { title: "Downloaded" }},
  { key: "recently viewed", screen: "QuickActionsScreen", params: { title: "Recently Viewed" }},
];


export default function HomeScreen({ navigation }) {

  const [topLawData, setTopLawData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [learning, setLearning] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.user);

  /* -------------------------------------------------------
        LOAD USER DETAILS FROM STORAGE
  -------------------------------------------------------*/
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = await Storage.getItem("userData");
      const storedToken = await Storage.getItem("token");

      dispatch(setUser(storedUser));
      dispatch(setToken(storedToken));
    };

    checkAuth();
  }, []);


  /* -------------------------------------------------------
      GLOBAL SEARCH SUGGESTION HANDLER
  -------------------------------------------------------*/
  const handleTextChange = (text) => {
    setSearchText(text);

    if (text.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = globalSearchList.filter(item =>
      item.key.toLowerCase().includes(text.toLowerCase())
    );

    setSuggestions(filtered);
  };


  /* -------------------------------------------------------
      API FORMATTER
  -------------------------------------------------------*/
  const formatTopLawData = (exploreTaxLaws) => {
    if (!exploreTaxLaws || !exploreTaxLaws.category) return [];

    const { category, documents } = exploreTaxLaws;
    return documents.map((doc) => ({
      id: doc.id.toString(),
      title: doc.title,
      image: doc.image
        ? `http://testlink2.pillersofttechnologies.com/storage/${doc.image}`
        : `https://picsum.photos/300/200?random=${doc.id}`,
    }));
  };


  /* -------------------------------------------------------
      HOME API
  -------------------------------------------------------*/
  const fetchHome = async () => {
    setLoading(true);
    try {
      const res = await authService.home(searchText);
      const apiData = res.data?.data;

      setTopLawData(apiData?.explore_tax_laws || []);
      setCategories(apiData?.legal_categories);
      setLearning(apiData?.learning_hub || []);
      setNews(apiData?.news || []);
    } catch (error) {
      console.log('home ERROR:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };


  /* -------------------------------------------------------
      HOME SEARCH API
  -------------------------------------------------------*/
  const fetchHome_search = async () => {
    setLoading(true);
    try {
      const res = await authService.home_search(searchText);
      const apiData = res.data?.data;

      setTopLawData(apiData?.explore_tax_laws || []);
      setCategories(apiData?.legal_categories);
      setLearning(apiData?.learning_hub || []);
      setNews(apiData?.news || []);
    } catch (error) {
      console.log('home ERROR:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };


  /* -------------------------------------------------------
      INITIAL LOAD
  -------------------------------------------------------*/
  useEffect(() => {
    fetchHome();
  }, []);


  const handleSearch = () => {
    fetchHome_search();
  };


  /* -------------------------------------------------------
      LOADING UI
  -------------------------------------------------------*/
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 10 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={"#FFFFFF"} barStyle={'dark-content'} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <CustomHeader
          title={`Hi ${[user?.user?.firstname, user?.user?.lastname].filter(Boolean).join(" ")}`}
          showLanguage={true}
        />

        {/* 🔍 SEARCH BAR */}
        <SearchBar
          value={searchText}
          onChangeText={handleTextChange}
          onSearch={handleSearch}
        />

        {/* ⭐ GLOBAL SUGGESTIONS LIST */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionBox}>
            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSuggestions([]);
                  setSearchText("");
                  navigation.navigate(item.screen, item.params || {});
                }}
                style={styles.suggestionItem}
              >
                <Text style={{ fontSize: 16 }}>{item.key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* REMAINING UI — SAME as your original code */}
        <Text style={styles.sectionTitle}>Explore Tax Laws</Text>

        {topLawData?.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ fontSize: 14, color: "#888", marginTop: 10 }}>
              No Data Found
            </Text>
          </View>
        ) : (
          <FlatList
            data={topLawData}
            horizontal
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            renderItem={({ item }) =>
              <TopLawCard
                onPress={() => navigation.navigate("TaxRegulation", { categoryId: item.id })}
                item={item}
              />
            }
          />
        )}

        {/* ----- Categories Section ----- */}
        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Explore Legal Categories</Text>

          {categories?.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('CategoriesScreen')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          )}
        </View>

        {categories?.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ fontSize: 14, color: "#888" }}>No Data Found</Text>
          </View>
        ) : (
          <View style={styles.categoriesWrap}>
            {categories.map(cat =>
              <CategoryCard
                key={cat.id}
                onPress={() => navigation.navigate("TaxRegulation", { categoryId: cat.id })}
                item={cat}
              />
            )}
          </View>
        )}

        {/* ----- Learning Hub ----- */}
        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Your Legal Learning Hub</Text>
          {learning?.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('LearningHubScreen')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          )}
        </View>

        {learning?.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ fontSize: 14, color: "#888" }}>No Data Found</Text>
          </View>
        ) : (
          learning.map(l => (
            <LearningCard
              key={l.id}
              item={l}
              onPress={() => navigation.navigate("DetailsScreen", { categoryId: l.id })}
            />
          ))
        )}

        {/* ----- Quick Access ----- */}
        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Quick Access</Text>
        <View style={styles.quickRow}>
          <QuickAccessCard
            title="Bookmarked"
            onPress={() => navigation.navigate("QuickActionsScreen", { title: "Bookmarked" })}
          />
          <QuickAccessCard
            title="Downloaded"
            onPress={() => navigation.navigate("QuickActionsScreen", { title: "Downloaded" })}
          />
          <QuickAccessCard
            title="Recently Viewed"
            onPress={() => navigation.navigate("QuickActionsScreen", { title: "Recently Viewed" })}
          />
        </View>

        {/* ----- News Section ----- */}
        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Latest News Updates</Text>
          {news?.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('NewsScreen')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          )}
        </View>

        {news?.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ fontSize: 14, color: "#888" }}>No Data Found</Text>
          </View>
        ) : (
          <View style={styles.newsGrid}>
            {news.map(item =>
              <NewsCard
                key={item.id}
                item={item}
                onPress={() => navigation.navigate("NewDetailsScreen", { item })}
              />
            )}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}


/* --------------------------------------------
    STYLES
----------------------------------------------*/
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { paddingBottom: 20 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 18,
    paddingHorizontal: 18,
    color: colors.text,
  },

  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },

  seeAll: { color: colors.muted, fontSize: 13, marginRight: 18 },

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

  /* ⭐ NEW STYLES FOR SUGGESTION BOX */
  suggestionBox: {
    backgroundColor: "#fff",
    marginHorizontal: 18,
    marginTop: 4,
    paddingVertical: 6,
    borderRadius: 8,
    elevation: 3,
  },

  suggestionItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    paddingHorizontal: 10,
  },
});
