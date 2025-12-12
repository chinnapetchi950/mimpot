import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { authService, imageUrl } from "../api/authService";
import moment from "moment";

export default function NewDetailsScreen({ route, navigation }) {
  const { item } = route.params; // contains { id }
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseURL = "http://testlink2.pillersofttechnologies.com";

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

  const fullImage = `${details?.image}`;

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
        <Image
          source={{ uri: fullImage }}
          style={styles.heroImage}
        />

        {/* DATE + ACTIONS */}
        <View style={styles.row}>
          <Text style={styles.date}>{moment(details?.date||details?.created_at).format("DD-MM-YYYY")}</Text>

          <View style={styles.iconRow}>
            <Icon name="share-outline" size={24} color="#000" />

            <Ionicons
              name="download-outline"
              size={24}
              color="#000"
              style={{ marginHorizontal: 18 }}
            />

            <Ionicons name="bookmark-outline" size={24} color="#000" />
          </View>
        </View>

        {/* TITLE */}
        <Text style={styles.title}>{details?.title}</Text>

        {/* DESCRIPTION */}
        <Text style={styles.desc}>{details?.excerpt}</Text>
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
