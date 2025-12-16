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
  Alert
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { authService } from "../api/authService"; // <-- API FILE
import moment from "moment";
import ImageWithLoader from "../components/ImageWithloader";
export default function ArticleDetailsScreen({ route, navigation }) {
      const { categoryId } = route.params || {};

//   const { item } = route.params; // item.id is coming
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
const [isBookmarked, setIsBookmarked] = useState(false);
const [bookmarkLoading, setBookmarkLoading] = useState(false);
const [downloadLoading, setIsdownloadLoading] = useState(false);

  const fetchDocumentDetails = async () => {
    try {
      const res = await authService.getDocumentById(categoryId); 
      console.log("detailssres",res);
      
      // API: api/user/documents/{id}
      setDetails(res?.data?.data); 
    } catch (error) {
      console.log("Document API Error:", error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };
const handleShare = async () => {
  try {
    const result = await Share.share({
      message: "Hi  this is M.Impot!",   // Your text
      url: "url",           // Optional URL
      title: "M.Impot",                   // Optional title
    });
  } catch (error) {
    console.log(error);
  }
};
  useEffect(() => {
    fetchDocumentDetails();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }
const onClickbookMark = async () => {
  try {
    setBookmarkLoading(true);

    const res = await authService.toggleBookmark(categoryId);
console.log(res, "reeeeeeee");

    // API returns true or false status
    if (res?.status) {
      setIsBookmarked(prev => !prev);
    }

  } catch (error) {
    console.log("Bookmark Error:", error?.response);
  } finally {
    setBookmarkLoading(false);
  }
};
const onClickDownload = async (item) => {
  if (item?.is_paid === true) {
    Alert.alert(
      'Payment Required',
      'Please complete the payment to download this file.',
    );
    return;
  }

  // continue normal flow
  try {
    setIsdownloadLoading(true);

    const res = await authService.downloadDocument(item.id);

    if (res?.status) {
      Alert.alert('Success', 'File downloaded successfully');
    }
  } catch (e) {
    console.log(e);
  } finally {
    setIsdownloadLoading(false);
  }
};
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details View</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Image */}
        <ImageWithLoader
          source={{
            uri:
              details?.image &&
              `http://testlink2.pillersofttechnologies.com/storage/${details.image}`,
          }}
          style={styles.heroImage}
        />

        {/* Date + Icons */}
        <View style={styles.row}>
          <Text style={styles.date}>{moment(details?.created_at).format('DD-MM-YYYY') || "No date"}</Text>

          <View style={styles.iconRow}>
            <Icon onPress={handleShare} name="share-outline" size={24} color="#000" />
             {details?.file_path!=null?
            <TouchableOpacity onPress={()=>onClickDownload(details)} style={styles.iconBtn}>
     
  {downloadLoading ? (
    <ActivityIndicator size={16} color="#000" />
  ) : (
            <Ionicons
              name="download-outline"
              size={24}
              color="#000"
              style={{ marginHorizontal: 18 }}
            />)}
            </TouchableOpacity>:null}

<TouchableOpacity onPress={()=>onClickbookMark()} style={styles.iconBtn}>
      
  {bookmarkLoading ? (
    <ActivityIndicator size={16} color="#000" />
  ) : (
    <Ionicons
      name={isBookmarked||details?.is_bookmarked ? "bookmark" : "bookmark-outline"}
      size={24}
      color="#000"
    />
  )}
</TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{details?.title}</Text>

        {/* Description */}
        <Text style={styles.desc}>{details?.description}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "#ddd",
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
});
