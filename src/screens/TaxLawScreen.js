import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import DownloadModal from "../components/DownloadModal";
import TaxCard from "../components/TaxCard";
import { authService,imageUrl } from "../api/authService";

export default function UnderstandingTaxScreen({ navigation }) {
  const [showDownload, setShowDownload] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchDocuments(page);
  }, []);

  // API CALL
  const fetchDocuments = async (pageNumber = 1) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const result = await authService.taxlawlist(pageNumber)

      // const result = await response.json();
      console.log("result?.data?.data",result?.data?.data);
      

      if (result?.data?.data?.data) {
        setData(prev =>
          pageNumber === 1 ? result.data.data?.data : [...prev, ...result.data.data?.data]
        );

        setLastPage(result.data.last_page);
        setPage(result.data.current_page);
      }
    } catch (error) {
      console.log("❌ API ERROR:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (page < lastPage) {
      fetchDocuments(page + 1);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>UnderStanding Tax</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* MAIN CONTENT */}
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          onScroll={({ nativeEvent }) => {
            const bottom =
              nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
              nativeEvent.contentSize.height - 20;

            if (bottom && !loadingMore) {
              loadMore();
            }
          }}
          scrollEventThrottle={300}
        >
          <Text style={styles.countText}>
            {data.length} Tax Law Results
          </Text>

          {/* LOADER (Initial) */}
          {loading && (
            <ActivityIndicator size="large" color="#000" style={{ marginTop: 30 }} />
          )}

          {/* NO DATA */}
          {!loading && data.length === 0 && (
            <View style={styles.noDataBox}>
              
              <Text style={styles.noDataText}>No Documents Found</Text>
            </View>
          )}

          {/* LIST ITEMS */}
          {data.map((item, index) => (
            <TaxCard
              key={index}
              item={{
                id: item.id,
                title: item.title,
                image: `${imageUrl}${item.image}`,
              }}
              onRead={() => navigation.navigate("TaxDetailsScreen", { item })}
              onDownload={() => setShowDownload(true)}
            />
          ))}

          {/* LOAD MORE LOADER */}
          {loadingMore && (
            <ActivityIndicator size="small" style={{ marginVertical: 15 }} />
          )}
        </ScrollView>

        <DownloadModal visible={showDownload} onClose={() => setShowDownload(false)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 15,
    paddingBottom: 25,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 15,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    marginRight: 25,
    marginTop: 10,
  },
  countText: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 12,
  },
  noDataBox: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  noDataText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#777",
  },
});
