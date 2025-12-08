import React from "react"; 
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export default function TaxDetailsScreen({ route, navigation }) {
  const { item } = route.params;

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
        <Image source={item?.image} style={styles.heroImage} />

        <View style={styles.row}>
          <Text style={styles.date}>05-08-2025</Text>
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

        <Text style={styles.title}>{item?.title}</Text>

        <Text style={styles.desc}>
          Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do
          Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua.
        </Text>

        <Text style={styles.desc}>
          Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do
          Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua.
        </Text>

        <Text style={styles.desc}>
          Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do
          Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua.
        </Text>
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
