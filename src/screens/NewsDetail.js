import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  TextInput
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { authService, imageUrl } from "../api/authService";
import moment from "moment";
import ImageWithLoader from "../components/ImageWithloader";
import { useTranslation } from "react-i18next";
import { getLocalizedValue } from "../utils/localization";
import i18n from "../localization/i18n";
import { SafeAreaView } from "react-native-safe-area-context";
export default function NewDetailsScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { item } = route.params; // contains { id }
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
const [isBookmarked, setIsBookmarked] = useState(false);
const [bookmarkLoading, setBookmarkLoading] = useState(false);
  // ✅ Search states
const [showSearchBar, setShowSearchBar] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
const [searchResult, setSearchResult] = useState(null);

  const baseURL = "http://testlink2.pillersofttechnologies.com";
const currentLang = i18n.language || 'en';

  useEffect(() => {
    fetchDetails();
  }, []);

  // 📌 API CALL
  const fetchDetails = async () => {
    console.log(item);
    
    try {
      const response = await  authService.newsdetail(item.id)
     const result = response?.data;
console.log(result, 'result');
      setDetails(result.data);         // <-- store API result
    } catch (err) {
      console.log("API Error:", err?.response);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = () => {
  if (!searchQuery.trim()) {
    setSearchResult(null);
    return;
  }

  const query = searchQuery.toLowerCase();

  // Combine all searchable text
  const allText = `
    ${title}
    ${excerpt}
  `.toLowerCase();

  if (allText.includes(query)) {
    setSearchResult(true);
  } else {
    setSearchResult(false);
  }
};

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // if (!details) {
  //   return (
  //     <View style={styles.loader}>
  //       <Text>No details found</Text>
  //     </View>
  //   );
  // }

  const fullImage = `${details?.image}`;
const onClickbookMark = async () => {
  console.log("reeeeeeee");

  try {
    setBookmarkLoading(true);

    const res = await authService.news_bookmarks(details?.id);
console.log(res, "reeeeeeee");

    // API returns true or false status
    if (res?.status) {
      setIsBookmarked(prev => !prev);
    }

  } catch (error) {
    console.log("Bookmark Error:", error);
  } finally {
    setBookmarkLoading(false);
  }
};
const handleShare = async (data) => {
  try {
    const message = buildShareMessage(data);

    await Share.share({
      title: 'M.Impot',
      message: message,
    });
  } catch (error) {
    console.log('Share Error:', error);
  }
};
const buildShareMessage = (data) => {
  return `
📰 *${getLocalizedValue(data, 'title', currentLang)}*

📅 ${t('news.published_on')}: ${data?.published_date || '-'}
👁 ${t('news.views')}: ${data?.views_count || 0}

📝 ${t('news.summary')}:
${getLocalizedValue(data, 'excerpt', currentLang) || t('news.no_summary_available')}

📲 ${t('news.share_footer')}
`;
};

const title = getLocalizedValue(details, 'title', currentLang);
const excerpt = getLocalizedValue(details, 'excerpt', currentLang);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.header}>
        {/* Back */}
        <TouchableOpacity
          onPress={() => {
            // sendViewDuration();
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
      
        {/* Title */}
        <Text style={styles.headerTitle}>
          {t("details.details_view")}
        </Text>
      
        {/* 🔍 Search Icon */}
        <TouchableOpacity
          onPress={() => setShowSearchBar(!showSearchBar)}
        >
          <Ionicons name="search-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      {showSearchBar && (
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search in title, description..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setSearchResult(null);
            }}
            style={styles.searchInput}
          />
      
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={handleSearch}
          >
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
     

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* IMAGE */}
        <ImageWithLoader
          source={{ uri: fullImage }}
          style={styles.heroImage}
        />

        {/* DATE + ACTIONS */}
        <View style={styles.row}>
          <Text style={styles.date}>{moment(details?.date||details?.created_at).format("DD-MM-YYYY")}</Text>

          <View style={styles.iconRow}>
            <TouchableOpacity onPress={()=>handleShare(details)}>
            <Icon name="share-outline" size={24} color="#000" />

            </TouchableOpacity>

            {/* <Ionicons
              name="download-outline"
              size={24}
              color="#000"
              style={{ marginHorizontal: 18 }}
            /> */}

            <TouchableOpacity onPress={()=>onClickbookMark()} style={styles.iconBtn}>
                  
              {bookmarkLoading ? (
                <ActivityIndicator size={16} color="#000" />
              ) : (
                <Ionicons
                  name={isBookmarked || details?.is_bookmarked? "bookmark" : "bookmark-outline"}
                  size={24}
                  color="#000"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* TITLE */}
        <Text style={styles.title}>
          {title.split(new RegExp(`(${searchQuery})`, "gi")).map((part, i) =>
            part.toLowerCase() === searchQuery.toLowerCase() ? (
              <Text key={i} style={{ backgroundColor: "yellow" }}>
                {part}
              </Text>
            ) : (
              part
            )
          )}
        </Text>
<Text style={styles.desc}>
  {excerpt.split(new RegExp(`(${searchQuery})`, "gi")).map((part, i) =>
    part.toLowerCase() === searchQuery.toLowerCase() ? (
      <Text key={i} style={{ backgroundColor: "yellow" }}>
        {part}
      </Text>
    ) : (
      part
    )
  )}
</Text>
        {/* ✅ DESCRIPTION WITH HIGHLIGHT */}
        {/* <Text style={styles.desc}>{highlightText(excerpt)}</Text> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 15,
    paddingBottom: 10,
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
  },
  heroImage: {
    width: "100%",
    height: 230,
    borderRadius: 12,
  },
  row: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 14,
    color: "#555",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 21,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 12,
  },
  desc: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
    marginBottom: 15,
  },
  searchContainer: {
  flexDirection: "row",
  alignItems: "center",
  marginHorizontal: 15,
  marginTop: 10,
  backgroundColor: "#f2f2f2",
  borderRadius: 10,
  paddingHorizontal: 10,
},

searchInput: {
  flex: 1,
  height: 45,
  fontSize: 14,
},

searchBtn: {
  backgroundColor: "#000",
  padding: 10,
  borderRadius: 8,
},

foundText: {
  marginLeft: 20,
  marginTop: 5,
  color: "green",
  fontWeight: "600",
},

notFoundText: {
  marginLeft: 20,
  marginTop: 5,
  color: "red",
  fontWeight: "600",
},
});
