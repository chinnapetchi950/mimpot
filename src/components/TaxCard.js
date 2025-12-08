import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function TaxCard({ item, onRead, onDownload }) {
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.title}</Text>

        <View style={styles.row}>
          <TouchableOpacity style={styles.readBtn} onPress={onRead}>
            <Text style={styles.readText}>Read</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.downloadBtn} onPress={onDownload}>
            <Ionicons name="download-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ position: "relative" }}>
        <Image source={item.image} style={styles.image} />

        <TouchableOpacity style={styles.bookmarkWrap}>
          <Ionicons name="bookmark-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardTitle: {
    width: 170,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },
  image: {
    width: 130,
    height: 95,
    borderRadius: 10,
    marginLeft: 6,
  },
  readBtn: {
    marginTop: 12,
    paddingVertical: 8,
    backgroundColor: "#1E90FF",
    borderRadius: 8,
    width: 95,
    alignItems: "center",
  },
  readText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  rightIcons: {
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 8,
    paddingVertical: 4,
  },
    row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },



  downloadBtn: {
    marginLeft: 40,
    padding: 8,
  },


  bookmarkWrap: {
    position: "absolute",
    bottom: 6,
    right: -2,
    backgroundColor: "#4CAF50",
    padding: 6,
    borderRadius: 20,
    elevation: 5,
  },
});
// arrow-collapse-down


// import React from "react";
// import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";

// export default function TaxCard({ item, onRead, onDownload }) {
//   return (
//     <View style={styles.card}>

//       {/* LEFT SECTION */}
//       <View style={{ flex: 1 }}>
//         <Text style={styles.cardTitle}>{item.title}</Text>

//         {/* Read + Download Row */}
//         <View style={styles.row}>
//           <TouchableOpacity style={styles.readBtn} onPress={onRead}>
//             <Text style={styles.readText}>Read</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.downloadBtn} onPress={onDownload}>
//             <Ionicons name="download-outline" size={22} color="#000" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* IMAGE WITH BOOKMARK OVERLAY */}
//       <View style={{ position: "relative" }}>
//         <Image source={item.image} style={styles.image} />

//         <TouchableOpacity style={styles.bookmarkWrap}>
//           <Ionicons name="bookmark-outline" size={20} color="#0A7AFF" />
//         </TouchableOpacity>
//       </View>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#fff",
//     flexDirection: "row",
//     padding: 14,
//     borderRadius: 14,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "#eee",
//     alignItems: "center",
//   },

//   cardTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     lineHeight: 20,
//     color: "#000",
//   },

//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 12,
//   },

//   readBtn: {
//     backgroundColor: "#1E90FF",
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
//   readText: {
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "600",
//   },

//   downloadBtn: {
//     marginLeft: 10,
//     padding: 8,
//   },

//   image: {
//     width: 100,
//     height: 85,
//     borderRadius: 12,
//     marginLeft: 10,
//   },

//   bookmarkWrap: {
//     position: "absolute",
//     bottom: -8,
//     right: -8,
//     backgroundColor: "#fff",
//     padding: 6,
//     borderRadius: 20,
//     elevation: 5,
//   },
// });
