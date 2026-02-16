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
import LearningCard from "../components/LearningCard";
import NewsCard from "../components/NewsCard";
import { useTranslation } from "react-i18next";
import { getLocalizedValue } from "../utils/localization";
import i18n from "../localization/i18n";
import { useDevice } from "../utils/useDeviceLayout"; // ✅ responsive
import ArticleCard from "../components/ArticleCard";

export default function SearchResultScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { ui } = useDevice();

  const keyword = route.params?.keyword || "";
  console.log("keyword is:",route.params?.keyword, keyword);

  const currentLang = i18n.language || "en";

  const [loading, setLoading] = useState(false);
  const [mergedList, setMergedList] = useState([]);

  const fetchResults = async () => {
      console.log("fetchResults called ✅");

    setLoading(true);
    try {
      const res = await authService.home_search(keyword);
      const api = res.data?.data;
console.log('api',res,api);

      const finalList = [];
      api?.explore_tax_laws?.forEach((i) => finalList.push({ type: "taxlaw", data: i }));
      api?.legal_categories?.forEach((i) => finalList.push({ type: "category", data: i }));
api?.learning_hub?.forEach((i) => {
  if (i.type === "article") {
    finalList.push({ type: "article", data: i });
  } else {
    finalList.push({ type: "video", data: i });
  }
});
      api?.news?.forEach((i) => finalList.push({ type: "news", data: i }));

      setMergedList(finalList);
    } catch (error) {
      console.log("Search API Error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  console.log("keyboard",keyword);
  
    if (keyword.trim() !== "") {
      fetchResults();
    }
  }, [keyword]);

  const renderItem = ({ item }) => {
    const obj = item.data;
    const localizedTitle = getLocalizedValue(obj, "title", currentLang);
    const localizedName = getLocalizedValue(obj, "name", currentLang);
    const localizedDescription = getLocalizedValue(obj, "description", currentLang);
    const localizedExcerpt = getLocalizedValue(obj, "excerpt", currentLang);

    switch (item.type) {
      case "taxlaw":
        return (
          <View style={{ marginTop: ui.spacing.sm }}>
            <TopLawCard
              item={{
                ...obj,
                name: localizedName,
                description: localizedDescription,
              }}
              onPress={() =>
                navigation.navigate("TaxRegulation", { categoryId: obj.id, name: localizedName })
              }
              style={{ width: "48%" }}
            />
          </View>
        );

      case "category":
        return (
          <View style={{ marginTop: ui.spacing.sm }}>
            <CategoryCard
              item={{
                ...obj,
                name: localizedName,
                description: localizedDescription,
              }}
              onPress={() =>
                navigation.navigate("TaxRegulation", { categoryId: obj.id, name: localizedName })
              }
            />
          </View>
        );
case "article":
  return (
    <View style={{ marginTop: ui.spacing.sm }}>
      <ArticleCard
        item={{
          ...obj,
          title: localizedTitle,
          description: localizedDescription,
        }}
        onPress={() =>
          navigation.navigate("ArticleDetailsScreen", { id: obj.id })
        }
      />
    </View>
  );

      case "video":
        return (
          <View style={{ marginTop: ui.spacing.sm }}>
            <LearningCard
              item={{
                ...obj,
                title: localizedTitle,
                description: localizedDescription,
              }}
              onPress={() =>
                navigation.navigate("DetailsScreen", { categoryId: obj.id })
              }
            />
          </View>
        );

      case "news":
        return (
          <View style={{ marginTop: ui.spacing.sm }}>
            <NewsCard
              item={{
                ...obj,
                title: localizedTitle,
                excerpt: localizedExcerpt,
              }}
              onPress={() => navigation.navigate("NewDetailsScreen", { item: obj })}
            />
          </View>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: ui.spacing.sm }}>{t("search.searching")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={[styles.header, { padding: ui.spacing.md, gap: ui.spacing.sm }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#000" />
        </TouchableOpacity>

        <Text style={{ fontSize: ui.font.h4, fontWeight: "700" }}>
          {t("search.results_for")} "{keyword}"
        </Text>

        <View style={{ width: ui.iconMedium }} />
      </View>

      {/* NO RESULTS */}
      {mergedList.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: ui.font.body, color: "#777" }}>
            {t("search.no_results_found")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={mergedList}
          keyExtractor={(item) => item.id + "_" + item.type}
          contentContainerStyle={{ paddingHorizontal: ui.spacing.md, paddingBottom: ui.spacing.lg, marginTop: ui.spacing.sm }}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ marginTop: ui.spacing.xl, alignItems: "center" }}>
              <Text style={{ fontSize: ui.font.body, color: "#777" }}>
                {t("search.no_results_found")}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF" },
  header: { flexDirection: "row", alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
