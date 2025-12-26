import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert,
  Modal
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { authService } from "../api/authService"; // <-- API FILE
import moment from "moment";
import ImageWithLoader from "../components/ImageWithloader";
import { useTranslation } from "react-i18next";
import HTMLView from 'react-native-htmlview';
import RNBlobUtil from 'react-native-blob-util';
import Pdf from "react-native-pdf";
import { imageUrl } from "../api/authService";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { getLocalizedValue } from "../utils/localization";
import i18n from "../localization/i18n";


export default function ArticleDetailsScreen({ route, navigation }) {
  const { t } = useTranslation();
      const { categoryId } = route.params || {};
const currentLang = i18n.language || 'en';

//   const { item } = route.params; // item.id is coming
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
const [isBookmarked, setIsBookmarked] = useState(false);
const [bookmarkLoading, setBookmarkLoading] = useState(false);
const [downloadLoading, setIsdownloadLoading] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
const [pdfLoading, setPdfLoading] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

  const fetchDocumentDetails = async () => {
    try {
      const res = await authService.getDocumentById(categoryId); 
      console.log("detailssres",res);
      
      // API: api/user/documents/{id}
      setDetails(res?.data?.data); 
    } catch (error) {
      console.log("Document API Error:", error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };
const handleShare = async (data) => {
  try {
    const message = buildShareMessage(data);

    await Share.share({
      title: 'M.Impot',
      message: message,
    });
  } catch (error) {
    console.log('Share Error:', error);
  }
};
const buildShareMessage = (data) => {
  return `
📄 *${getLocalizedValue(data, 'title', currentLang)}*

🗂 ${t('details.category')}: ${
    getLocalizedValue(data?.category, 'name', currentLang) || '-'
}
📂 ${t('details.sub_category')}: ${
    getLocalizedValue(data?.sub_category, 'name', currentLang) || '-'
}

⭐ ${t('details.rating')}: ${data?.average_rating || 0} / 5
📝 ${t('details.total_ratings')}: ${data?.total_ratings || 0}
👁 ${t('details.views')}: ${data?.total_views || 0}

📅 ${t('details.created_on')}: ${data?.created_at_formatted || '-'}

📝 ${t('details.description')}:
${getLocalizedValue(data, 'description', currentLang) || t('details.no_description_available')}

📲 ${t('details.share_footer')}
`;
};

  useEffect(() => {
    fetchDocumentDetails();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>{t('common.loading')}</Text>
      </View>
    );
  }
const onClickbookMark = async () => {
  try {
    setBookmarkLoading(true);

    const res = await authService.toggleBookmark(categoryId);
console.log(res, "reeeeeeee");

    // API returns true or false status
    if (res?.status) {
      setIsBookmarked(prev => !prev);
    }

  } catch (error) {
    console.log("Bookmark Error:", error?.response);
  } finally {
    setBookmarkLoading(false);
  }
};
const onClickDownload = async (item) => {
  // if (item?.is_paid === true) {
  //   Alert.alert(
  //     t('details.payment_required'),
  //     t('details.payment_message'),
  //   );
  //   return;
  // }

  // continue normal flow
  try {
    setIsdownloadLoading(true);

    const res = await authService.downloadDocument(item.id);
console.log(res,"res====");

    if (res?.status) {
      Alert.alert(t('common.success'), t('details.file_downloaded_successfully'));
    }
  } catch (e) {
    console.log(e);
  } finally {
    setIsdownloadLoading(false);
  }
};


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
const title = getLocalizedValue(details, 'title', currentLang);
const content = getLocalizedValue(details, 'content', currentLang);
const categoryName = getLocalizedValue(details?.category, 'name', currentLang);
const subCategoryName = getLocalizedValue(details?.sub_category, 'name', currentLang);
  return (
    <SafeAreaView  style={{ flex: 1, backgroundColor: "#fff" }}>
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
        {/* Image */}
        <ImageWithLoader
          source={{
            uri:
              details?.image &&
              `http://testlink2.pillersofttechnologies.com/storage/${details.image}`,
          }}
          style={styles.heroImage}
        />

        {/* Date + Icons */}
        <View style={styles.row}>
          <Text style={styles.date}>{moment(details?.created_at).format('DD-MM-YYYY') || t('details.no_date')}</Text>

          <View style={styles.iconRow}>
            <Icon onPress={()=>handleShare(details)} name="share-outline" size={24} color="#000" />
               {details?.file_path && (
                            <TouchableOpacity onPress={openPdfModal} style={styles.iconBtn}>
                              {downloadLoading ? (
                                <ActivityIndicator size={16} color="#000" />
                              ) : (
                                <FontAwesome name="file-pdf-o" size={38} color="red" />
                              )}
                            </TouchableOpacity>
                          )}
             {/* {details?.file_path!=null?
            <TouchableOpacity onPress={()=>onClickDownload(details)} style={styles.iconBtn}>
     
  {downloadLoading ? (
    <ActivityIndicator size={16} color="#000" />
  ) : (
            <Ionicons
              name="download-outline"
              size={24}
              color="#000"
              style={{ marginHorizontal: 18 }}
            />)}
            </TouchableOpacity>:null} */}

<TouchableOpacity onPress={()=>onClickbookMark()} style={styles.iconBtn}>
      
  {bookmarkLoading ? (
    <ActivityIndicator size={16} color="#000" />
  ) : (
    <Ionicons
      name={isBookmarked||details?.is_bookmarked ? "bookmark" : "bookmark-outline"}
      size={24}
      color="#000"
    />
  )}
</TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Description */}
        {content!=null&&
        <HTMLView
  value={content}
  stylesheet={htmlStyles}
/>}

        {/* <Text style={styles.desc}>{details?.description}</Text> */}
      </ScrollView>
    </View>
         <Modal visible={showPdfModal} animationType="slide" onRequestClose={() => setShowPdfModal(false)}>
        <View style={styles.pdfModalContainer}>
          <View style={styles.pdfHeader}>
            <TouchableOpacity onPress={() => setShowPdfModal(false)}>
              <Ionicons name="close" size={26} color="#000" />
            </TouchableOpacity>
            <Text style={styles.pdfTitle}>PDF Preview</Text>
            <TouchableOpacity onPress={()=>onClickDownload(details)}>
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
    </SafeAreaView>
    
  );
}
const htmlStyles = StyleSheet.create({
  h2: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 10,
    color: '#000',
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
    color: '#000',
  },
  p: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
    color: '#444',
  },
  strong: {
    fontWeight: '700',
  },
  ul: {
    marginVertical: 10,
    paddingLeft: 20,
  },
  li: {
    fontSize: 15,
    marginBottom: 6,
    color: '#444',
  },
  hr: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
});

const styles = StyleSheet.create({
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
    backgroundColor: "#ddd",
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
    gap:15,
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
