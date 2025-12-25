import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { authService } from "../api/authService";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageWithLoader from "../components/ImageWithloader";

export default function ExploreScreen({navigation}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 10;
  const BASE_URL = 'http://testlink2.pillersofttechnologies.com/storage/'; // Your base URL

  const fetchDocuments = async (newPage = 1, searchQuery =search) => {
    if (newPage === 1) setLoading(true);
    else setLoadingMore(true);
console.log("searchQuery",searchQuery);

    try {

      const res = await authService.getDocumentsByCategory_explore(
        2,
        newPage,
        PAGE_SIZE,
        searchQuery
      );

      console.log("API Response:", res?.data);

      const data = res?.data?.data?.data ?? [];

      if (newPage === 1) setDocuments(data);
      else setDocuments((prev) => [...prev, ...data]);

      setHasMore(data.length === PAGE_SIZE);
      setPage(newPage);

    } catch (err) {
      console.log("API ERROR:", err.response?.data || err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

 const handleSearch = (text = search) => {
  fetchDocuments(1, text);
};

  const handleLoadMore = () => {
    if (hasMore && !loadingMore && !loading) {
      fetchDocuments(page + 1, search);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={()=>navigation.navigate("TaxDetailsScreen", { item })} style={styles.card}>
      <ImageWithLoader source={{ uri:`${BASE_URL}${item.image}`}} style={styles.cardImage} />

      <Text numberOfLines={2} style={styles.cardTitle}>
        {item.title || t('explore.no_title')}
      </Text>

      <Text numberOfLines={3} style={styles.cardDesc}>
        {item.description || t('details.no_description_available')}
      </Text>

      <View style={styles.row}>
        <Text style={styles.date}>
          {moment(item.created_at).format("DD-MM-YYYY")}
        </Text>

        <TouchableOpacity onPress={()=>navigation.navigate("TaxDetailsScreen", { item })}>
          <Text style={styles.read}>{t('articles.read_more')}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={{ marginTop: 50, alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: "#666" }}>{t('explore.no_data_available')}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      <Text style={styles.header}>{t('explore.explore_laws_updates')}</Text>

      <View style={styles.searchBox}>
         <TouchableOpacity onPress={()=>handleSearch(search)}>
          <Ionicons name="search" size={20} />
        </TouchableOpacity>
        {/* <Ionicons name="search" size={20} /> */}
        <TextInput
          placeholder={t('explore.search_placeholder')}
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
              onSubmitEditing={() => handleSearch(search)}

        />
        <TouchableOpacity   onPress={() => {
    setSearch('');
    handleSearch(''); // ✅ explicitly pass empty string
  }}>
          <Ionicons name="close" size={20} />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#1E90FF" />}

      <FlatList
        data={documents}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color="#1E90FF" />
          ) : null
        }
      />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "700", marginVertical: 15 },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 50,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardImage: { width: "100%", height: 110, borderRadius: 10 },
  cardTitle: { fontSize: 15, fontWeight: "700", marginTop: 6 },
  cardDesc: { fontSize: 12, color: "#555", marginVertical: 8 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  date: { fontSize: 11, color: "#999" },
  read: { color: "#2563EB", fontSize: 12, fontWeight: "600" },
});
