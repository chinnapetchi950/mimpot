import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";

import Icon from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { authService } from "../api/authService";

import TopLawCard from "../components/TopLawCard";
import CategoryCard from "../components/CategoryCard";
import LearningCard from "../components/LearningCard"; // VIDEO CARD
import NewsCard from "../components/NewsCard";

export default function SearchResultScreen({ route, navigation }) {
  const keyword = route.params?.keyword || "";

  const [loading, setLoading] = useState(false);
  const [mergedList, setMergedList] = useState([]); // 🔥 unified list


  /* -------------------------------------------------------
        API CALL — ALL SEARCH DATA
  -------------------------------------------------------*/
  const fetchResults = async () => {
    setLoading(true);

    try {
      const res = await authService.home_search(keyword);
      const api = res.data?.data;

      // Merge all items into one list
      const finalList = [];

      api?.explore_tax_laws?.forEach((i) =>
        finalList.push({ type: "taxlaw", data: i })
      );

      api?.legal_categories?.forEach((i) =>
        finalList.push({ type: "category", data: i })
      );

      api?.learning_hub?.forEach((i) =>
        finalList.push({ type: "video", data: i })
      );

      api?.news?.forEach((i) =>
        finalList.push({ type: "news", data: i })
      );

      setMergedList(finalList);
    } catch (error) {
      console.log("Search API Error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keyword.trim() !== "") {
      fetchResults();
    }
  }, [keyword]);


  /* -------------------------------------------------------
        RENDER EACH CARD TYPE
  -------------------------------------------------------*/
  const renderItem = ({ item }) => {
    const obj = item.data;

    switch (item.type) {
      case "taxlaw":
        return (
          <TopLawCard
            item={obj}
            onPress={() =>
              navigation.navigate("TaxRegulation", { categoryId: obj.id })
            }
            style={{ width: "48%" }}
          />
        );

      case "category":
        return (
            <View style={{marginTop:10}}>

            
          <CategoryCard
            item={obj}
            onPress={() =>
              navigation.navigate("TaxRegulation", { categoryId: obj.id })
            }
          />
          </View>
        );

      case "video":
        return (
          <LearningCard
            item={obj}
            onPress={() =>
              navigation.navigate("DetailsScreen", { categoryId: obj.id })
            }
          />
        );

      case "news":
        return (
          <NewsCard
            item={obj}
            onPress={() =>
              navigation.navigate("NewDetailsScreen", { item: obj })
            }
          />
        );

      default:
        return null;
    }
  };
//   const renderItem = ({ item }) => {
//     if (item.type === "tax_law") {
//       return (
//         <TopLawCard
//           item={item}
//           onPress={() =>
//             navigation.navigate("TaxRegulation", { categoryId: item.id })
//           }
//         />
//       );
//     }

//     if (item.type === "category") {
//       return (
//         <CategoryCard
//           item={item}
//           onPress={() =>
//             navigation.navigate("TaxRegulation", { categoryId: item.id })
//           }
//         />
//       );
//     }

//     if (item.type === "learning") {
//       return (
//         <LearningCard
//           item={item}
//           onPress={() => navigation.navigate("DetailsScreen", { categoryId: item.id })}
//         />
//       );
//     }

//     if (item.type === "news") {
//       return (
//         <NewsCard
//           item={item}
//           onPress={() => navigation.navigate("NewDetailsScreen", { item })}
//         />
//       );
//     }

//     return null;
//   };


  /* -------------------------------------------------------
        LOADING
  -------------------------------------------------------*/
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 10 }}>Searching...</Text>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.safe}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>

        
        <Text style={styles.headerTitle}>Results for "{keyword}"</Text>

        <View style={{ width: 30 }} />
      </View>


      {/* NO RESULTS */}
      {mergedList.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 16, color: "#777" }}>
            No results found
          </Text>
        </View>
      ) : (

        /* ONE SINGLE FLATLIST — NO TITLES */
        <FlatList
        data={mergedList}
        keyExtractor={(item) => item.id + "_" + item.type}
        contentContainerStyle={styles.listContainer}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ marginTop: 60, alignItems: "center" }}>
            <Text style={{ fontSize: 15, color: "#777" }}>
              No results found
            </Text>
          </View>
        }
      />
      )}

    </SafeAreaView>
  );
}


/* -------------------------------------------------------
        STYLES
-------------------------------------------------------*/
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 10,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 40,
    marginTop:10
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
