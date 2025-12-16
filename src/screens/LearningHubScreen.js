import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator,TouchableOpacity,Text } from "react-native";
import VideoCard from "../components/VideoCard";
import { authService } from "../api/authService"; // Make sure this exists
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../components/CustomHeader";
import Ionicons from "react-native-vector-icons/Ionicons";
import strings from "../localization/en";

export default function LearningHubScreen({ navigation }) {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchVideos(1);
  }, []);

  // 📌 Fetch Videos API
  const fetchVideos = async (pageNumber = 1) => {
    try {
      if (pageNumber === 1) setLoading(true);

      const res = await authService.getDocumentsList(pageNumber, "video");
      console.log("res===>",res);
      
      const response = res.data?.data;

      if (response?.data) {
        if (pageNumber === 1) {
          setVideos(response.data);
        } else {
          setVideos(prev => [...prev, ...response.data]);
        }

        setLastPage(response.last_page);
      }
    } catch (e) {
      console.log("Video Fetch Error:", e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 📌 Load More Pagination
  const loadMore = () => {
    if (loadingMore || page >= lastPage) return;

    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    fetchVideos(nextPage);
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
        title={strings.learning.your_legal_learning_hub}
        rightComponent={() => null}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
        }
      />
      <FlatList
      data={videos}
      contentContainerStyle={{ paddingTop: 25 }}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <VideoCard
          item={item}
          onPress={(selectedItem) => {
      console.log("Card clicked:", item);
      navigation.navigate("DetailsScreen", { categoryId: item.id });
    }}
          // onPress={() => navigation.navigate("Details", { video: item })}
        />
      )}
      onEndReached={loadMore}
      onEndReachedThreshold={0.3}
      ListFooterComponent={
        loadingMore ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null
      }
      ListEmptyComponent={
    !loading && (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>{strings.learning.no_data_available}</Text>
      </View>
    )
  }
    />
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
