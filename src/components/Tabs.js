// Tabs.js
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Tabs({ tabs = [], activeTab, setActiveTab }) {
  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => setActiveTab(tab.key)}
        >
          <Text style={[styles.label, activeTab === tab.key && styles.activeLabel]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
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
    paddingVertical: 15,
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
