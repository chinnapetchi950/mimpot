// Tabs.js
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "articles" && styles.activeTab]}
        onPress={() => setActiveTab("articles")}
      >
        <Text style={[styles.label, activeTab === "articles" && styles.activeLabel]}>
          Articles
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === "videos" && styles.activeTab]}
        onPress={() => setActiveTab("videos")}
      >
        <Text style={[styles.label, activeTab === "videos" && styles.activeLabel]}>
          Videos
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 30,
    alignItems: "center",
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: "#ff9d27",
  },
  label: {
    fontSize: 16,
    color: "#444",
  },
  activeLabel: {
    color: "#fff",
    fontWeight: "bold",
  },
});
