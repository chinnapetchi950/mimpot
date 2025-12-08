// VideoCard.js
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function VideoCard({ item ,onPress}) {
    const BASE_URL = 'http://testlink2.pillersofttechnologies.com/storage/'; // Your base URL
      
    
    
  return (
    <TouchableOpacity onPress={()=>onPress()} style={styles.card}>
      <View>
        <Image source={{ uri: `${BASE_URL}${item.image}` }} style={styles.thumbnail} />

        <TouchableOpacity style={styles.playBtn}>
          <Icon name="play" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

<View style={{flexDirection:'column'}}>
<Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>By {'M.impot'}</Text>
</View>
      

      <View style={{ flexDirection: "row", marginVertical: 3 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Icon
            key={i}
            name="star"
            size={16}
            color={i <= item.stars ? "#ff9d27" : "#ccc"}
          />
        ))}
      </View>
      </View>

      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 25,
    paddingHorizontal: 15,
  },
  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  playBtn: {
    position: "absolute",
    top: "40%",
    left: "45%",
    backgroundColor: "#ffffffaa",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "700",
  },
  author: {
    color: "#777",
    marginVertical: 3,
  },
  description: {
    color: "#555",
    marginTop: 6,
  },
});
