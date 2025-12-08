import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import Tabs from "../components/Tabs";
import VideoCard from "../components/VideoCard";
import ArticleCard from "../components/ArticleCard";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../components/CustomHeader";
import Ionicons from "react-native-vector-icons/Ionicons";
import { authService } from '../api/authService';

export default function TaxRegulation({ navigation, route }) {
  const { categoryId } = route.params;

  const [activeTab, setActiveTab] = useState("videos");
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    resetAndFetch();
  }, [activeTab]);

  const resetAndFetch = () => {
    setList([]);
    setPage(1);
    fetchDocuments(1);
  };

  const fetchDocuments = async (pageNumber = 1) => {
  try {
    if (pageNumber === 1) setLoading(true);

    const type = activeTab === "videos" ? "video" : "article";
console.log("type",type);

    const res = await authService.getDocumentsByCategory(categoryId, type, pageNumber);
    const response = res.data?.data;
console.log("docresponsevideoe==============>",response?.data);
console.log("docresponseartcles==============>",response?.data);

    // Ensure response.data is always an array
    const data = Array.isArray(response?.data) ? response.data : [];

    if (pageNumber === 1) {
      setList(data);
    } else {
      setList(prev => [...prev, ...data]);
    }

    setLastPage(response?.last_page || 1);
  } catch (err) {
    console.log("Pagination Error:", err);
  } finally {
    setLoading(false);
    setLoadingMore(false);
  }
};


  const loadMore = () => {
    if (loadingMore || page >= lastPage) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);

    fetchDocuments(nextPage);
  };

  if (loading && page === 1) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
// if (!loading && list.length === 0) {
//   return (
//     <View style={styles.noDataContainer}>
//       <Text style={styles.noDataText}>No Data Available</Text>
//     </View>
//   );
// }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <CustomHeader
        headertextstyle={{ textAlign: "center", marginLeft: 70 }}
        title="Tax Regulation"
        rightComponent={() => null}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
        }
      />

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "videos" ? (
        <FlatList
          key={"videos"}
          data={list}
          renderItem={({ item }) => <VideoCard  onPress={(selectedItem) => {
    console.log("Card clicked:", item);
    navigation.navigate("DetailsScreen", { categoryId: item.id });
  }} item={item} />}
          keyExtractor={(i, index) => index.toString()}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null
          }
          ListEmptyComponent={
    !loading && (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No Data Available</Text>
      </View>
    )
  }
        />
      ) : (
        <FlatList
          key={"articles"}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 15,
          }}
          contentContainerStyle={{ paddingTop: 10 }}
          data={list}
          renderItem={({ item }) => <ArticleCard onPress={(selectedItem) => {
    console.log("Card clicked:", item);
    navigation.navigate("ArticleDetailsScreen", { categoryId: item.id });
  }} item={item} />} 
          keyExtractor={(i, index) => index.toString()}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null
          }
          ListEmptyComponent={
    !loading && (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No Data Available</Text>
      </View>
    )
  }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    color: "#999",
    fontWeight: "500",
  },
});