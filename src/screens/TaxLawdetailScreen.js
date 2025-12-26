import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Pdf from "react-native-pdf";
import { authService, imageUrl } from "../api/authService";
import moment from "moment";
import ImageWithLoader from "../components/ImageWithloader";
import { useTranslation } from "react-i18next";
import RNBlobUtil from 'react-native-blob-util';
import { useFocusEffect } from "@react-navigation/native";
import { getLocalizedValue } from "../utils/localization";
import i18n from "../localization/i18n";

export default function TaxDetailsScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { item } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [downloadLoading, setIsDownloadLoading] = useState(false);
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
const [pdfLoading, setPdfLoading] = useState(false); // Loader while downloading
const currentLang = i18n.language || 'en';

  useEffect(() => {
    fetchDetails();
    getSubscriptionStatus();
  }, []);

  const getSubscriptionStatus = async () => {
    const value = await AsyncStorage.getItem("isSubcribe");
    setIsSubscribe(JSON.parse(value));
  };
  useFocusEffect(
  React.useCallback(() => {
    refreshData(); // API / AsyncStorage check
  }, [])
);
const refreshData = async () => {
  const value = await AsyncStorage.getItem("isSubcribe");
  setIsSubscribe(JSON.parse(value));
};

  const fetchDetails = async () => {
    try {
      const response = await authService.taxlawdetail(item.id);
      console.log("res",response);
      
      setDetails(response?.data?.data);
    } catch (err) {
      console.log("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onClickBookMark = async () => {
    try {
      setBookmarkLoading(true);
      const res = await authService.toggleBookmark(item?.id);
      if (res?.status) setIsBookmarked(prev => !prev);
    } catch (err) {
      console.log("Bookmark Error:", err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const onClickDownload = async () => {
    // if (item?.is_paid === true&&isSubscribe===true) {
      try {
      setIsDownloadLoading(true);
      const res = await authService.downloadDocument(details.id);
      if (res?.status) {
        Alert.alert(t('common.success'), t('details.file_downloaded_successfully'));
      }
    } catch (err) {
      console.log("Download Error:", err);
    } finally {
      setIsDownloadLoading(false);
    }

    // }else{
    //   Alert.alert(
    //   t('details.payment_required'),
    //   t('details.payment_message'),
    //   [
    //     { text: t('common.cancel'), style: "cancel" },
    //     { text: t('common.continue'), onPress: () => {navigation.navigate("SubscriptionScreen", {
    //       redirectTo: "TaxDetailsScreen",
    //      // redirectParams: { videoId: item.id },
    //     });} },
    //   ]
    // );      return;
    // }

    
  };

  const handleShare = async data => {
    try {
      await Share.share({ title: "M.Impot", message: buildShareMessage(data) });
    } catch (err) {
      console.log("Share Error:", err);
    }
  };

  const buildShareMessage = data => `
📄 *${getLocalizedValue(data, 'title', currentLang)}*

🗂 ${t('details.category')}: ${
  getLocalizedValue(data?.category, 'name', currentLang) || '-'
}
📂 ${t('details.sub_category')}: ${
  getLocalizedValue(data?.sub_category, 'name', currentLang) || '-'
}

⭐ ${t('details.rating')}: ${data.average_rating || 0} / 5
📝 ${t('details.total_ratings')}: ${data.total_ratings || 0}
👁 ${t('details.views')}: ${data.total_views || 0}

📅 ${t('details.created_on')}: ${data.created_at_formatted || '-'}

📝 ${t('details.description')}:
${getLocalizedValue(data, 'description', currentLang) || t('details.no_description_available')}

📲 ${t('details.share_footer')}
`;


  // const openPdfModal = () => {
  //   if (details?.is_paid && !isSubscribe) {
  //     Alert.alert(strings.details.payment_required, strings.details.payment_message, [
  //       { text: strings.common.cancel, style: "cancel" },
  //       {
  //         text: strings.common.continue,
  //         onPress: () => navigation.navigate("SubscriptionScreen"),
  //       },
  //     ]);
  //     return;
  //   }

  //   const url = details?.file_path?.startsWith("http")
  //     ? details.file_path
  //     : `${imageUrl}${details.file_path}`;

  //   setPdfUrl(url);
  //   setShowPdfModal(true);
  // };

const openPdfModal = async () => {
  // 🔒 Block unpaid users
  // if ((item?.is_paid === true&&isSubscribe===true)||(item?.is_paid === true&&isSubscribe===false)) {
setShowPdfModal(true); // Show modal first
  setPdfLoading(true);   // Start loader

  try {
    const url = details?.file_path?.startsWith("http")
      ? details.file_path
      : `${imageUrl}${details.file_path}`;

    const localPath = `${RNBlobUtil.fs.dirs.CacheDir}/${details.id}.pdf`;

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
//   }
//   else{
// Alert.alert(
//       t('details.payment_required'),
//       t('details.payment_message'),
//       [
//         { text: t('common.cancel'), style: "cancel" },
//         { text: t('common.continue'), onPress: () => {navigation.navigate("SubscriptionScreen", {
//           redirectTo: "TaxDetailsScreen",
//          // redirectParams: { videoId: item.id },
//         });} },
//       ]
//     );
//     return;
//   }
 

  
};



  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const fullImage = `${imageUrl}${details?.image}`;
const title = getLocalizedValue(details, 'title', currentLang);
const description = getLocalizedValue(details, 'description', currentLang);
const categoryName = getLocalizedValue(details?.category, 'name', currentLang);
const subCategoryName = getLocalizedValue(details?.sub_category, 'name', currentLang);
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('details.details_view')}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* IMAGE */}
        <ImageWithLoader source={{ uri: fullImage }} style={styles.heroImage} />

        {/* DATE + ACTIONS */}
        <View style={styles.row}>
          <Text style={styles.date}>
            {moment(details?.date || details?.created_at).format("DD-MM-YYYY")}
          </Text>

          <View style={styles.iconRow}>
            <TouchableOpacity onPress={() => handleShare(details)}>
              <Icon name="share-outline" size={24} color="#000" />
            </TouchableOpacity>

            {details?.file_path && (
              <TouchableOpacity onPress={openPdfModal} style={styles.iconBtn}>
                {downloadLoading ? (
                  <ActivityIndicator size={16} color="#000" />
                ) : (
                  <FontAwesome name="file-pdf-o" size={38} color="red" />
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={onClickBookMark} style={styles.iconBtn}>
              {bookmarkLoading ? (
                <ActivityIndicator size={16} color="#000" />
              ) : (
                <Ionicons
                  name={isBookmarked || details?.is_bookmarked ? "bookmark" : "bookmark-outline"}
                  size={28}
                  color="#000"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* TITLE */}
        <Text style={styles.title}>{title}</Text>

        {/* DESCRIPTION */}
        <Text style={styles.desc}>{description}</Text>
      </ScrollView>

      {/* PDF MODAL */}
      <Modal visible={showPdfModal} animationType="slide" onRequestClose={() => setShowPdfModal(false)}>
        <View style={styles.pdfModalContainer}>
          <View style={styles.pdfHeader}>
            <TouchableOpacity onPress={() => setShowPdfModal(false)}>
              <Ionicons name="close" size={26} color="#000" />
            </TouchableOpacity>
            <Text style={styles.pdfTitle}>PDF Preview</Text>
            <TouchableOpacity onPress={()=>onClickDownload()}>
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
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
    gap:15
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
  previewBtn: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 10,
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
