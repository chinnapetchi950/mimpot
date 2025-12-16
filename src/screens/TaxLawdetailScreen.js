import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { authService, imageUrl } from "../api/authService";
import moment from "moment";
import ImageWithLoader from "../components/ImageWithloader";

export default function TaxDetailsScreen({ route, navigation }) {
  const { item } = route.params; // contains { id }
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
const [isBookmarked, setIsBookmarked] = useState(false);
const [bookmarkLoading, setBookmarkLoading] = useState(false);
const [downloadLoading, setIsdownloadLoading] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, []);

  // 📌 API CALL
  const fetchDetails = async () => {
    console.log(item);
    
    try {
      const response = await  authService.taxlawdetail(item.id)
     const result = response?.data;
console.log(result, 'result');
      setDetails(result.data);         // <-- store API result
    } catch (err) {
      console.log("API Error:", err);
    } finally {
      setLoading(false);
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
console.log(details);

  const fullImage = `${imageUrl}${details?.image}`;
const onClickbookMark = async () => {
  try {
    setBookmarkLoading(true);

    const res = await authService.toggleBookmark(item?.id);
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
console.log(res,'resresresres');

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
        {/* IMAGE */}
        <ImageWithLoader
          source={{ uri: fullImage }}
          style={styles.heroImage}
        />

        {/* DATE + ACTIONS */}
        <View style={styles.row}>
          <Text style={styles.date}>{moment(details?.date||details?.created_at).format("DD-MM-YYYY")}</Text>

          <View style={styles.iconRow}>
            <Icon name="share-outline" size={24} color="#000" />
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
      name={isBookmarked ||details?.is_bookmarked? "bookmark" : "bookmark-outline"}
      size={24}
      color="#000"
    />
  )}
</TouchableOpacity>          </View>
        </View>

        {/* TITLE */}
        <Text style={styles.title}>{details?.title}</Text>

        {/* DESCRIPTION */}
        <Text style={styles.desc}>{details?.description}</Text>
      </ScrollView>
    </View>
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
});
