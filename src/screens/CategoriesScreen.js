import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity,Text } from "react-native";
import CategoryCard from "../components/CategoryCard";
import { authService } from "../api/authService"; // ensure correct import
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../components/CustomHeader";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function CategoriesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchCategories(1);
  }, []);

  const fetchCategories = async (pageNumber = 1) => {
    try {
      if (pageNumber === 1) setLoading(true);

      const res = await authService.getLegalCategories(pageNumber); // make this API function
      const response = res.data;

      const data = Array.isArray(response?.data) ? response.data : [];

      if (pageNumber === 1) {
        setCategories(data);
      } else {
        setCategories(prev => [...prev, ...data]);
      }

      setLastPage(response?.last_page || 1);
    } catch (err) {
      console.log("Fetch Categories Error:", err);
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
    fetchCategories(nextPage);
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
        headertextstyle={{ textAlign: "center", marginLeft: 30 }}
        title="Explore Legal Categories"
        rightComponent={() => null}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
        }
      />
    <View style={styles.container}>
      <FlatList
        data={categories}
        numColumns={3}
        contentContainerStyle={{ padding: 15 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <CategoryCard
            item={item}
            //onPress={() => navigation.navigate("LearningHub", { category: item })}
          />
        )}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
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
