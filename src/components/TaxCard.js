import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useTranslation } from "react-i18next";
import ImageWithLoader from "./ImageWithloader";
import { useDevice } from "../utils/useDeviceLayout";

export default function TaxCard({ item, onRead, onDownload, onBookmark }) {
  const { t } = useTranslation();
  const { ui, width, deviceType } = useDevice();

  const IMAGE_WIDTH =
    deviceType === "tablet"
      ? 200
      : deviceType === "unfolded"
      ? 170
      : 130;

  const IMAGE_HEIGHT =
    deviceType === "tablet"
      ? 140
      : deviceType === "unfolded"
      ? 120
      : 95;

  return (
    <View
      style={[
        styles.card,
        {
         padding: 14,
    borderRadius: 14,
        },
      ]}
    >
      {/* LEFT CONTENT */}
      <View style={{ flex: 1, paddingRight: ui.spacing.md }}>
        <Text
          style={[
            styles.cardTitle,
            {
              fontSize: ui.font.body,
              maxWidth: width * 0.55,
            },
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <View style={[styles.row, { marginTop: ui.spacing.md }]}>
          <TouchableOpacity
            style={[
              styles.readBtn,
              {
                height: ui.button.height - 12,
                paddingHorizontal: ui.spacing.lg,
                borderRadius: 10,
              },
            ]}
            onPress={onRead}
          >
            <Text
              style={[
                styles.readText,
                { fontSize: ui.button.fontSize },
              ]}
            >
              {t("articles.read")}
            </Text>
          </TouchableOpacity>

          {item?.item?.file_path && (
            <TouchableOpacity
              style={[styles.downloadBtn, { marginLeft: deviceType === "tablet"?45: 25 }]}
              onPress={onDownload}
            >
              <FontAwesome
                name="file-pdf-o"
                size={ui.font.h2}
                color="red"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* IMAGE + BOOKMARK */}
      <View style={{ position: "relative" }}>
        <ImageWithLoader
          source={{ uri: item.image }}
          style={{
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
            borderRadius: 8,
          }}
        />

        <TouchableOpacity
          onPress={onBookmark}
          style={[
            styles.bookmarkWrap,
            {
              padding: ui.spacing.sm,
              borderRadius:20,
            },
          ]}
        >
          <Ionicons
            name={item?.is_bookmarked ? "bookmark" : "bookmark-outline"}
            size={ deviceType === "tablet"?34:24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 20,
      shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 6 },

  elevation: 14,
  },

  cardTitle: {
    fontWeight: "600",
    lineHeight: 22,
    color: "#000",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  readBtn: {
    backgroundColor: "#1E90FF",
    justifyContent: "center",
    alignItems: "center",
  },

  readText: {
    color: "#fff",
    fontWeight: "600",
  },

  downloadBtn: {
    justifyContent: "center",
    alignItems: "center",
  },

  bookmarkWrap: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "#4CAF50",
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
