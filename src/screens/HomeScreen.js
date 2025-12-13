// 🔥 FULL UPDATED HOME SCREEN — WITH MYNTRA STYLE SEARCH SUGGESTIONS

import React, { useEffect, useState ,useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  BackHandler,
  Alert
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

import Icon from 'react-native-vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {

  const [topLawData, setTopLawData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [learning, setLearning] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);


  /* -------------------------------------------------------
        LOAD USER DETAILS 
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

useFocusEffect(
  useCallback(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit the app?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ],
      );
      return true; // block default back action
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => subscription.remove(); // ✅ correct cleanup
  }, []),
);
  /* -------------------------------------------------------
        SEARCH TEXT HANDLER (CALL API)
  -------------------------------------------------------*/
  const handleTextChange = async (text) => {
    setSearchText(text);

    if (text.trim() === "") {
      setSuggestions([]);
      return;
    }

    try {
      const res = await authService.globalsearch_suggestion(text); // YOUR API
      setSuggestions(res.data?.data || []);
    } catch (error) {
      console.log("Suggestion API Error:", error);
    }
  };


  /* -------------------------------------------------------
        HOME API
  -------------------------------------------------------*/
  const fetchHome = async () => {
    setLoading(true);
    try {
      const res = await authService.home("");
      const apiData = res.data?.data;

      setTopLawData(apiData?.explore_tax_laws || []);
      setCategories(apiData?.legal_categories);
      setLearning(apiData?.learning_hub);
      setNews(apiData?.news);
    } catch (error) {
      console.log("home ERROR:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHome();
  }, []);


  /* -------------------------------------------------------
        HIGHLIGHT MATCH TEXT
  -------------------------------------------------------*/
  const highlightText = (text, highlight) => {
    const index = text.toLowerCase().indexOf(highlight.toLowerCase());

    if (index === -1) return <Text>{text}</Text>;

    const before = text.substring(0, index);
    const match = text.substring(index, index + highlight.length);
    const after = text.substring(index + highlight.length);

    return (
      <Text>
        {before}
        <Text style={{ fontWeight: 'bold' }}>{match}</Text>
        {after}
      </Text>
    );
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
          onSearch={() =>
            navigation.navigate("SearchResultScreen", { keyword: searchText })
          }
        />

        {/* ⭐ SUGGESTION BOX */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionBox}>
            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => {
                  setSuggestions([]);
                  setSearchText(item.suggestion);
                  navigation.navigate("SearchResultScreen", {
                    keyword: item.suggestion,
                  });
                }}
              >
                <View style={styles.suggestionLeft}>
                  <Icon name="search" size={18} color="#666" />
                  <Text style={styles.suggestionText}>
                    {highlightText(item.suggestion, searchText)}
                  </Text>
                </View>

                <View style={styles.suggestionRight}>
                  <Text style={styles.countText}>{item.result_count}</Text>
                  <Icon name="chevron-right" size={20} color="#999" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ---------- REST OF YOUR ORIGINAL UI ---------- */}

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
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <TopLawCard
                item={item}
                onPress={() =>
                  navigation.navigate("TaxRegulation", { categoryId: item.id })
                }
              />
            )}
          />
        )}

        {/* ---- CATEGORIES ---- */}
        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Explore Legal Categories</Text>
          {categories?.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('CategoriesScreen')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.categoriesWrap}>
          {categories?.map((cat) => (
            <CategoryCard
              key={cat.id}
              item={cat}
              onPress={() =>
                navigation.navigate("TaxRegulation", { categoryId: cat.id })
              }
            />
          ))}
        </View>

        {/* ---- Learning Hub ---- */}
        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Your Legal Learning Hub</Text>
          {learning?.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('LearningHubScreen')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          )}
        </View>

        {learning?.map((l) => (
          <LearningCard
            key={l.id}
            item={l}
            onPress={() => navigation.navigate("DetailsScreen", { categoryId: l.id })}
          />
        ))}

        {/* ---- QUICK ACCESS ---- */}
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

        {/* ---- NEWS ---- */}
        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Latest News Updates</Text>
          {news?.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('NewsScreen')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.newsGrid}>
          {news?.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              onPress={() => navigation.navigate("NewDetailsScreen", { item })}
            />
          ))}
        </View>

        <View style={{ height: 120 }} />

      </ScrollView>
    </SafeAreaView>
  );
}



/* --------------------------------------------
    STYLES
----------------------------------------------*/
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { paddingBottom: 20 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 18,
    paddingHorizontal: 18,
    color: colors.text,
  },

  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },

  seeAll: { color: colors.muted, fontSize: 13, marginRight: 18 },

  categoriesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },

  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginTop: 8,
  },

  newsGrid: {
    paddingHorizontal: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },

  /* ⭐ SUGGESTIONS UI */
  suggestionBox: {
    backgroundColor: "#fff",
    marginHorizontal: 18,
    marginTop: 4,
    borderRadius: 10,
    elevation: 3,
    paddingVertical: 5,
  },

  suggestionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },

  suggestionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  suggestionText: {
    fontSize: 15,
    color: "#333",
  },

  suggestionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  countText: {
    fontSize: 14,
    color: "#777",
  },
});
