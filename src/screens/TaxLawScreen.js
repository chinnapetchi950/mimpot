import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import DownloadModal from "../components/DownloadModal";
import TaxCard from "../components/TaxCard";
import { authService,imageUrl } from "../api/authService";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNBlobUtil from 'react-native-blob-util';
import Pdf from "react-native-pdf";
import { useFocusEffect } from "@react-navigation/native";
import { getLocalizedValue } from '../utils/localization';

export default function UnderstandingTaxScreen({ navigation }) {
  const { t } = useTranslation();
  const [showDownload, setShowDownload] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
 const [isSubscribe, setIsSubscribe] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
const [pdfLoading, setPdfLoading] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
  const [downloadLoading, setIsDownloadLoading] = useState(false);
  // const [isBookmarked, setIsBookmarked] = useState(false);
  // const [bookmarkLoading, setBookmarkLoading] = useState(false);
  useEffect(() => {
    fetchDocuments(page);
    // getSubscriptionStatus();
  }, []);
useEffect(() => {
  const getSubscriptionStatus = async () => {
    const value = await AsyncStorage.getItem("isSubcribe");
    console.log(value,'valuevaluevaluevaluevalue');
    
    setIsSubscribe(JSON.parse(value));
  };

  getSubscriptionStatus();
}, []);
useFocusEffect(
  React.useCallback(() => {
    refreshData(); // API / AsyncStorage check
  }, [])
);
const refreshData = async () => {
  const value = await AsyncStorage.getItem("isSubcribe");
  setIsSubscribe(JSON.parse(value));
};
  // API CALL
  const fetchDocuments = async (pageNumber = 1) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const result = await authService.taxlawlist(pageNumber)

      // const result = await response.json();
      console.log("result?.data?.data",result?.data?.data);
      

      if (result?.data?.data?.data) {
        setData(prev =>
          pageNumber === 1 ? result.data.data?.data : [...prev, ...result.data.data?.data]
        );

        setLastPage(result.data.last_page);
        setPage(result.data.current_page);
      }
    } catch (error) {
      console.log("❌ API ERROR:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (page < lastPage) {
      fetchDocuments(page + 1);
    }
  };
const openPdfModal = async (item) => {
  console.log(isSubscribe,item?.is_paid);
  setSelectedItem(item)
  // 🔒 Block unpaid users
  // if ((item?.is_paid === true&&isSubscribe===true)||(item?.is_paid === true&&isSubscribe===false)) {
setShowPdfModal(true); // Show modal first
  setPdfLoading(true);   // Start loader

  try {
    const url = item?.file_path?.startsWith("http")
      ? item.file_path
      : `${imageUrl}${item.file_path}`;

    const localPath = `${RNBlobUtil.fs.dirs.CacheDir}/${item.id}.pdf`;

    // Download PDF to local cache
    const res = await RNBlobUtil.config({ path: localPath }).fetch('GET', url);

    setPdfUrl(res.path()); // Set local PDF path
  } catch (err) {
    console.log('PDF Download Error:', err);
    Alert.alert(t('common.error'), t('details.failed_to_load_pdf'));
    setShowPdfModal(false); // Close modal on error
  } finally {
    setPdfLoading(false); // Stop loader
  }
 // }
//   else{
// Alert.alert(
//       t('details.payment_required'),
//       t('details.payment_message'),
//       [
//         { text: t('common.cancel'), style: "cancel" },
//         { text: t('common.continue'), 
//           onPress: () => { navigation.navigate("SubscriptionScreen", {
//           redirectTo: "TaxLawScreen",
//          // redirectParams: { videoId: item.id },
//         });}
//          },
//       ]
//     );
//     return;
//   }
 

  
};
const onClickDownload = async (item) => {
  // console.log(isSubscribe,"isSubscribe");
  
    // if (item?.is_paid === true&&isSubscribe===true) {
      
    try {
      setIsDownloadLoading(true);
      const res = await authService.downloadDocument(item.id);
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
 const onClickBookMark = async (item, index) => {
  try {
    // 🔁 Optimistic UI update
    setData(prev =>
      prev.map((it, i) =>
        i === index
          ? { ...it, is_bookmarked: !it.is_bookmarked }
          : it
      )
    );

    // 📡 API call
    await authService.toggleBookmark(item.id);

  } catch (err) {
    console.log("Bookmark Error:", err);

    // ❌ rollback if API fails
    setData(prev =>
      prev.map((it, i) =>
        i === index
          ? { ...it, is_bookmarked: item.is_bookmarked }
          : it
      )
    );
  }
};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('tax_law.understanding_tax')}</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* MAIN CONTENT */}
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          onScroll={({ nativeEvent }) => {
            const bottom =
              nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
              nativeEvent.contentSize.height - 20;

            if (bottom && !loadingMore) {
              loadMore();
            }
          }}
          scrollEventThrottle={300}
        >
          <Text style={styles.countText}>
            {data.length} {t('tax_law.tax_law_results')}
          </Text>

          {/* LOADER (Initial) */}
          {loading && (
            <ActivityIndicator size="large" color="#000" style={{ marginTop: 30 }} />
          )}

          {/* NO DATA */}
          {!loading && data.length === 0 && (
            <View style={styles.noDataBox}>
              
              <Text style={styles.noDataText}>{t('tax_law.no_documents_found')}</Text>
            </View>
          )}

          {/* LIST ITEMS */}
           {data.map((item, index) => {
    const title = getLocalizedValue(item, 'title');
    const description = getLocalizedValue(item, 'description');

    return (
      <TaxCard
        key={item.id ?? index}
        item={{
          id: item.id,
          title, // ✅ localized title
          description, // ✅ localized description (if TaxCard uses it)
          image: `${imageUrl}${item.image}`,
          is_bookmarked: item?.is_bookmarked,
          item: {
            ...item,
            title,
            description,
          },
        }}
        onRead={() =>
          navigation.navigate('TaxDetailsScreen', {
            item: {
              ...item,
              title,
              description,
            },
          })
        }
        onDownload={() => openPdfModal(item)}
        onBookmark={() => onClickBookMark(item, index)}
      />
    );
  })}

          {/* LOAD MORE LOADER */}
          {loadingMore && (
            <ActivityIndicator size="small" style={{ marginVertical: 15 }} />
          )}
        </ScrollView>

        <DownloadModal visible={showDownload} onClose={() => setShowDownload(false)} />
           <Modal visible={showPdfModal} animationType="slide" onRequestClose={() => setShowPdfModal(false)}>
        <View style={styles.pdfModalContainer}>
          <View style={styles.pdfHeader}>
            <TouchableOpacity onPress={() => setShowPdfModal(false)}>
              <Ionicons name="close" size={26} color="#000" />
            </TouchableOpacity>
            <Text style={styles.pdfTitle}>PDF Preview</Text>
            <TouchableOpacity onPress={()=>onClickDownload(selectedItem)}>
              <Ionicons name="download-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
 {pdfLoading && (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
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
    marginTop: 10,
  },
  countText: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 12,
  },
  noDataBox: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  noDataText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#777",
  },
  pdfModalContainer: {
  flex: 1,
  backgroundColor: "#fff",
},

pdfHeader: {
  height: 56,
  paddingHorizontal: 16,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
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
});
