import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Modal,
  Alert
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { authService } from "../api/authService";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageWithLoader from "../components/ImageWithloader";
import Pdf from "react-native-pdf";
import RNBlobUtil from "react-native-blob-util";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function ExploreScreen({navigation}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
const [showPdfModal, setShowPdfModal] = useState(false);
const [pdfUrl, setPdfUrl] = useState(null);
const [pdfLoading, setPdfLoading] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
  const [downloadLoading, setIsDownloadLoading] = useState(false);
  const PAGE_SIZE = 10;
  const BASE_URL = 'http://testlink2.pillersofttechnologies.com/storage/'; // Your base URL

  const fetchDocuments = async (newPage = 1, searchQuery =search) => {
    if (newPage === 1) setLoading(true);
    else setLoadingMore(true);
console.log("searchQuery",searchQuery);

    try {

      const res = await authService.getDocumentsByCategory_explore(
        2,
        newPage,
        PAGE_SIZE,
        searchQuery
      );

      console.log("API Response:", res?.data);

      const data = res?.data?.data?.data ?? [];

      if (newPage === 1) setDocuments(data);
      else setDocuments((prev) => [...prev, ...data]);

      setHasMore(data.length === PAGE_SIZE);
      setPage(newPage);

    } catch (err) {
      console.log("API ERROR:", err.response?.data || err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

 const handleSearch = (text = search) => {
  fetchDocuments(1, text);
};

  const handleLoadMore = () => {
    if (hasMore && !loadingMore && !loading) {
      fetchDocuments(page + 1, search);
    }
  };
const openPdfModal = async (item) => {
  setSelectedItem(item);
  setShowPdfModal(true);
  setPdfLoading(true);

  try {
    const url = item?.file_path?.startsWith("http")
      ? item.file_path
      : `${BASE_URL}${item.file_path}`;

    const localPath = `${RNBlobUtil.fs.dirs.CacheDir}/${item.id}.pdf`;

    const res = await RNBlobUtil.config({
      path: localPath,
      fileCache: true,
    }).fetch("GET", url);

    setPdfUrl(res.path());
  } catch (err) {
        setPdfLoading(false);

    Alert.alert(
      t("common.error"),
      t("details.failed_to_load_pdf") || "Failed to load PDF"
    );
    console.log("PDF Error:", err);
    // Alert.alert(
    //   t("common.error"),
    //   t("details.failed_to_load_pdf") || "Failed to load PDF"
    // );
    setShowPdfModal(false);
  } finally {
    setPdfLoading(false);
  }
};

const renderItem = ({ item }) => (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={() => navigation.navigate("TaxDetailsScreen", { item })}
    style={styles.card}
  >
    {/* IMAGE */}
    <View style={styles.imageWrapper}>
      <ImageWithLoader
        source={{ uri: `${BASE_URL}${item.image}` }}
        style={styles.cardImage}
      />

      {/* PDF BADGE */}
      
    </View>

    <Text numberOfLines={2} style={styles.cardTitle}>
      {item.title || t("explore.no_title")}
    </Text>

    <Text numberOfLines={3} style={styles.cardDesc}>
      {item.description || t("details.no_description_available")}
    </Text>

   <View style={styles.row}>
  {/* LEFT SIDE */}
  <Text
    style={styles.date}
    numberOfLines={1}
    ellipsizeMode="tail"
  >
    {moment(item.created_at).format("DD-MM-YYYY")}
  </Text>

  {/* RIGHT SIDE */}
  <View style={styles.rightActions}>
    {item?.file_path && (
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          openPdfModal(item);
        }}
        style={styles.pdfBtn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <FontAwesome
          name="file-pdf-o"
          size={18}
          color="#e53935"
        />
      </TouchableOpacity>
    )}

    <TouchableOpacity
      onPress={() =>
        navigation.navigate("TaxDetailsScreen", { item })
      }
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text style={styles.readMore}>
        {t("articles.read_more")}
      </Text>
    </TouchableOpacity>
  </View>
</View>

  </TouchableOpacity>
);


  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={{ marginTop: 50, alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: "#666" }}>{t('explore.no_data_available')}</Text>
      </View>
    );
  };
const onClickDownload = async (item) => {
  // console.log(isSubscribe,"isSubscribe");
  
    // if (item?.is_paid === true&&isSubscribe===true) {
      
    try {
      setIsDownloadLoading(true);
      const res = await authService.downloadDocument(item.id);
      console.log(res);
      
      if (res?.status) {
        Alert.alert(t('common.success'), t('details.file_downloaded_successfully'));
      }
    } catch (err) {
      console.log("Download Error:", err);
    } finally {
      setIsDownloadLoading(false);
    }
    // }
    // else{
    //   Alert.alert(
    //   t('details.payment_required'),
    //   t('details.payment_message'),
    //   [
    //     { text: t('common.cancel'), style: "cancel" },
    //     { text: t('common.continue'), onPress: () => {navigation.navigate("SubscriptionScreen", {
    //       redirectTo: "TaxLawScreen",
    //      // redirectParams: { videoId: item.id },
    //     });} },
    //   ]
    // );
    // return;
    // }

    

  };
  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      <Text style={styles.header}>{t('explore.explore_laws_updates')}</Text>

      <View style={styles.searchBox}>
         <TouchableOpacity onPress={()=>handleSearch(search)}>
          <Ionicons name="search" size={20} />
        </TouchableOpacity>
        {/* <Ionicons name="search" size={20} /> */}
        <TextInput
          placeholder={t('explore.search_placeholder')}
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
              onSubmitEditing={() => handleSearch(search)}

        />
        <TouchableOpacity   onPress={() => {
    setSearch('');
    handleSearch(''); // ✅ explicitly pass empty string
  }}>
          <Ionicons name="close" size={20} />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#1E90FF" />}

      <FlatList
        data={documents}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color="#1E90FF" />
          ) : null
        }
      />
    </View>
               <Modal visible={showPdfModal} animationType="slide" onRequestClose={() => setShowPdfModal(false)}>
    
   
  <View style={styles.pdfModalContainer}>
    <View style={styles.pdfHeader}>
      <TouchableOpacity onPress={() => setShowPdfModal(false)}>
        <Ionicons name="close" size={26} />
      </TouchableOpacity>

      <Text style={styles.pdfTitle}>PDF Preview</Text>

      <TouchableOpacity onPress={()=>onClickDownload(selectedItem)} >
        <Ionicons name="download-outline" size={24} />
      </TouchableOpacity>
    </View>

    {pdfLoading && (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading PDF...</Text>
      </View>
    )}

    {!pdfLoading && pdfUrl && (
     <Pdf
              source={{ uri: pdfUrl, cache: true }}
              style={styles.pdfView}
              trustAllCerts={true}
              onError={e => console.log("PDF Error:", e)}
            />
    )}
  </View>
</Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "700", marginVertical: 15 },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 50,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardImage: { width: "100%", height: 110, borderRadius: 10 },
  cardTitle: { fontSize: 15, fontWeight: "700", marginTop: 6 },
  cardDesc: { fontSize: 12, color: "#555", marginVertical: 8 },
  // row: {flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   //paddingHorizontal: 10,
  //   gap:10,
  //   paddingTop: 10,
  //   paddingBottom: 10,},
  // date: { fontSize: 11, color: "#999" },
  // read: { color: "#2563EB", fontSize: 12, fontWeight: "600" },
  imageWrapper: {
  position: "relative",
},

pdfBadge: {
  position: "absolute",
  bottom: 8,
  right: 8,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 8,
  paddingVertical: 4,
  backgroundColor: "#e53935",
  borderRadius: 14,
  elevation: 4,
},

pdfBadgeText: {
  color: "#fff",
  fontSize: 11,
  fontWeight: "700",
  marginLeft: 4,
},

pdfModalContainer: {
  flex: 1,
  backgroundColor: "#fff",
},

pdfHeader: {
  height: 56,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 16,
  borderBottomWidth: 1,
  borderColor: "#eee",
},

pdfTitle: {
  fontSize: 16,
  fontWeight: "600",
},

pdfView: {
  flex: 1,
  width: "100%",
},

center: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
},
// rightActions: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },

//   pdfBtn: {
//     padding: 2,
//   },

row: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
},

date: {
  flex: 1,              // ✅ KEY FIX
  fontSize: 11,
  color: "#999",
},

rightActions: {
  flexDirection: "row",
  alignItems: "center",
  flexShrink: 0,        // ✅ prevents collapse on small screens
},

pdfBtn: {
  marginRight: 10,      // ✅ use margin instead of gap
  padding: 4,
},

readMore: {
  color: "#2563EB",
  fontSize: 12,
  fontWeight: "600",
},

});
