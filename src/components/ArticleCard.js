// ArticleCard.js
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import moment from "moment";
import { onPress } from "deprecated-react-native-prop-types/DeprecatedTextPropTypes";
import ImageWithLoader from "./ImageWithloader";

export default function ArticleCard({ item,onPress }) {
    const BASE_URL = 'http://testlink2.pillersofttechnologies.com/storage/'; // Your base URL
      
     console.log(`${BASE_URL}${item.image}`,"api===>");
     
  return (
    <TouchableOpacity onPress={()=>onPress()}style={styles.card}>
      <ImageWithLoader source={{ uri:  `${BASE_URL}${item.image}` }} style={styles.img} />

      <Text style={styles.title}>{item.title}</Text>

      <Text style={styles.desc}>{item?.description}
        {/* {item.desc.substring(0, 60)}... */}
      </Text>

      <View style={styles.row}>
        <Text style={styles.date}>{moment(item.created_at).format('DD-MM-YYYY')}</Text>
        <TouchableOpacity>
          <Text style={styles.readMore}>Read More</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 18,
    paddingBottom: 12,
    elevation: 3,
  },
  img: {
    width: "100%",
    height: 130,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    padding: 8,
    fontSize: 15,
    fontWeight: "700",
  },
  desc: {
    paddingHorizontal: 8,
    fontSize: 12,
    color: "#666",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 6,
  },
  date: {
    fontSize: 12,
    color: "#777",
  },
  readMore: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#ff9d27",
  },
});
