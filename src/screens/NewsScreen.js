import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator,TouchableOpacity, Text } from "react-native";
import NewsCard from "../components/NewsCard";
import { authService } from "../api/authService"; // make sure this is correctly imported
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../components/CustomHeader";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { getLocalizedValue } from "../utils/localization";
import i18n from "../localization/i18n";

export default function NewsScreen({ navigation }) {
  const { t } = useTranslation();
  const [newsList, setNewsList] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
const currentLang = i18n.language || 'en';

  useEffect(() => {
    fetchNews(1);
  }, []);

  const fetchNews = async (pageNumber = 1) => {
    try {
      if (pageNumber === 1) setLoading(true);

      const res = await authService.getNewsList(pageNumber); // create this API in authService
      const response = res.data?.data;
console.log("response",response?.data);

      const data = Array.isArray(response?.data) ? response.data : [];

      if (pageNumber === 1) {
        setNewsList(data);
      } else {
        setNewsList(prev => [...prev, ...data]);
      }

      setLastPage(response?.last_page || 1);
    } catch (err) {
      console.log("Fetch News Error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (loadingMore || page >= lastPage) return;

    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    fetchNews(nextPage);
  };

  if (loading && page === 1) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex:1}}>
        <CustomHeader
        headertextstyle={{ textAlign: "center", marginLeft: 50 }}
        title={t('news.latest_news_updates')}
        rightComponent={() => null}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
        }
      />
    <View style={styles.container}>
      <FlatList
  data={newsList}
  numColumns={2}
  contentContainerStyle={{ padding: 15 }}
  columnWrapperStyle={{ justifyContent: 'space-between' }}
  keyExtractor={(item, index) => item.id?.toString() || index.toString()}
  onEndReached={loadMore}
  onEndReachedThreshold={0.3}
  ListFooterComponent={
    loadingMore ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null
  }
  ListEmptyComponent={
    !loading && (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>
          {t('news.no_data_available')}
        </Text>
      </View>
    )
  }
  renderItem={({ item }) => {
    const title = getLocalizedValue(item, 'title',currentLang);
    const description = getLocalizedValue(item, 'description',currentLang);
        const excerpt = getLocalizedValue(item, 'excerpt',currentLang);


    return (
      <NewsCard
        item={{
          ...item,
          title,        // ✅ localized title
          description, 
          excerpt // ✅ localized description
        }}
        onPress={() => {
          console.log('News clicked:', item);

          navigation.navigate('NewDetailsScreen', {
            item: {
              ...item,
              title,
              description,
            },
          });
        }}
      />
    );
  }}
/>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  noDataContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  noDataText: { fontSize: 18, color: "#999", fontWeight: "500" },
});
