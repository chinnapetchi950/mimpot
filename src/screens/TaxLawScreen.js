import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import DownloadModal from "../components/DownloadModal";
import TaxCard from "../components/TaxCard";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UnderstandingTaxScreen({ navigation }) {
  const [showDownload, setShowDownload] = useState(false);

  const topPicks = [
    {
      id: 1,
      title: "Tax Compliance, Legal Insight",
      image: require("../assets/images/tax.png"),
    },
  ];

  const mostViewed = [
    {
      id: 2,
      title: "Stay Informed On Tax Laws",
      image: require("../assets/images/tax.png"),
    },
    {
      id: 3,
      title: "How To Create An Enterprice",
      image: require("../assets/images/tax.png"),
    },
  ];

  return (
    <SafeAreaView style={{flex:1}}>

    
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>UnderStanding Tax</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.countText}>20 Tax Law Results</Text>

        <Text style={styles.sectionTitle}>Top Picks</Text>
        {topPicks.map((item) => (
          <TaxCard
            key={item.id}
            item={item}
            onRead={() =>
              navigation.navigate("TaxDetailsScreen", { item })
            }
            onDownload={() => setShowDownload(true)}
          />
        ))}

        <Text style={styles.sectionTitle}>Most Viewed</Text>
        {mostViewed.map((item) => (
          <TaxCard
            key={item.id}
            item={item}
            onRead={() =>
              navigation.navigate("TaxDetailsScreen", { item })
            }
            onDownload={() => setShowDownload(true)}
          />
        ))}
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
    marginTop:10,
  },
  countText: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 10,
  },
});
