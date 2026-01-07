import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,Modal,Alert
} from "react-native";
import Tabs from "../components/Tabs";
import VideoCard from "../components/VideoCard";
import ArticleCard from "../components/ArticleCard";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../components/CustomHeader";
import Ionicons from "react-native-vector-icons/Ionicons";
import { authService, imageUrl } from '../api/authService';
import { useTranslation } from "react-i18next";
import Pdf from "react-native-pdf";
import RNBlobUtil from 'react-native-blob-util';
import { getLocalizedValue } from "../utils/localization";
import i18n from "../localization/i18n";

export default function TaxRegulation({ navigation, route }) {
  const { t } = useTranslation();
  const { categoryId ,name} = route.params;
const currentLang = i18n.language || 'en';

  // const [activeTab, setActiveTab] = useState("articles");
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
const [activeTab, setActiveTab] = useState('articles'); // 'all' or 'news'
const [subCategories, setSubCategories] = useState([]);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
const [pdfLoading, setPdfLoading] = useState(false);
const [activeSubCategory, setActiveSubCategory] = useState(null);
const [selectedItem, setSelectedItem] = useState(null);
  const [downloadLoading, setIsDownloadLoading] = useState(false);

  const tabsData = [
    { key: 'articles', label: t('tax_regulation.articles') },
    { key: 'videos', label: t('tax_regulation.videos') },
  ];
  
  useEffect(() => {
    resetAndFetch();
  }, [activeTab]);

  const resetAndFetch = () => {
    setList([]);
    setPage(1);
    fetchDocuments(1);
  };

const fetchDocuments = async (pageNumber = 1) => {
  try {
    if (pageNumber === 1) setLoading(true);

    const type = activeTab === "videos" ? "video" : "article";

    // ✅ Use subcategory id if selected, else category id
    const effectiveCategoryId = activeSubCategory ?? categoryId;

    const res = await authService.getDocumentsByCategory(
      effectiveCategoryId,
      type,
      pageNumber
    );

    const response = res.data;

    // ✅ Set subcategories ONLY when parent category is active
    if (
      pageNumber === 1 &&
      !activeSubCategory &&
      response?.category?.children
    ) {
      setSubCategories(response.category.children);
    }

    const data = Array.isArray(response?.data?.data)
      ? response.data.data
      : [];

    if (pageNumber === 1) {
      setList(data);
    } else {
      setList(prev => [...prev, ...data]);
    }

    setLastPage(response?.data?.last_page || 1);
  } catch (err) {
    console.log("Pagination Error:", err);
  } finally {
    setLoading(false);
    setLoadingMore(false);
  }
};


useEffect(() => {
  setPage(1);
  setList([]);
  fetchDocuments(1);
}, [activeTab, activeSubCategory]);

  const loadMore = () => {
    if (loadingMore || page >= lastPage) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);

    fetchDocuments(nextPage);
  };

  if (loading && page === 1) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const openPdfModal = async (item) => {
    // console.log(isSubscribe,item?.is_paid);
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
      // Alert.alert(t('common.error'), t('details.failed_to_load_pdf'));
      Alert.alert(err)
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
// if (!loading && list.length === 0) {
//   return (
//     <View style={styles.noDataContainer}>
//       <Text style={styles.noDataText}>No Data Available</Text>
//     </View>
//   );
// }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <CustomHeader
        headertextstyle={{ textAlign: "center", }}
        title={name}
        rightComponent={() => null}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
        }
      />
{subCategories.length > 0 && (
  <View style={styles.subCategoryContainer}>
    <FlatList
  horizontal
  showsHorizontalScrollIndicator={false}
  data={[{ id: null, name_en: 'All', name_fr: 'Tous' }, ...subCategories]}
  keyExtractor={(item) => item.id?.toString() ?? 'all'}
  renderItem={({ item }) => {
    const isActive = activeSubCategory === item.id;

    const label =
      item.id === null
        ? currentLang.startsWith('fr')
          ? 'Tous'
          : 'All'
        : getLocalizedValue(item, 'name', currentLang);

    return (
      <TouchableOpacity
        style={[
          styles.subCategoryChip,
          isActive && styles.subCategoryChipActive,
        ]}
        onPress={() => setActiveSubCategory(item.id)}
      >
        <Text
          style={[
            styles.subCategoryText,
            isActive && styles.subCategoryTextActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }}
/>

  </View>
)}

  <Tabs tabs={tabsData} activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "videos" ? (
       <FlatList
  key="videos"
  data={list}
  keyExtractor={(item, index) => item.id?.toString() || index.toString()}
  onEndReached={loadMore}
  onEndReachedThreshold={0.3}
  ListFooterComponent={
    loadingMore ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null
  }
  ListEmptyComponent={
    !loading && (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>
          {t('videos.no_data_available')}
        </Text>
      </View>
    )
  }
  renderItem={({ item }) => {
    const title = getLocalizedValue(item, 'title', currentLang);
    const description = getLocalizedValue(item, 'description', currentLang);

    return (
      <VideoCard
        item={{ ...item, title, description }}
        onPress={() =>
          navigation.navigate('DetailsScreen', {
            categoryId: item.id,
          })
        }
      />
    );
  }}
/>

      ) : (
        <FlatList
  key="articles"
  numColumns={2}
  columnWrapperStyle={{
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  }}
  contentContainerStyle={{ paddingTop: 10 }}
  data={list}
  keyExtractor={(item, index) => item.id?.toString() || index.toString()}
  onEndReached={loadMore}
  onEndReachedThreshold={0.3}
  ListFooterComponent={
    loadingMore ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null
  }
  ListEmptyComponent={
    !loading && (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>
          {t('videos.no_data_available')}
        </Text>
      </View>
    )
  }
  renderItem={({ item }) => {
    const title = getLocalizedValue(item, 'title', currentLang);
    const description = getLocalizedValue(item, 'description', currentLang);

    return (
      <ArticleCard
        item={{ ...item, title, description }}
        onPress={() =>
          navigation.navigate('ArticleDetailsScreen', {
            categoryId: item.id,
          })
        }
        onDownload={() => openPdfModal(item)}
      />
    );
  }}
/>

      )}
        {/* <DownloadModal visible={showDownload} onClose={() => setShowDownload(false)} /> */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    color: "#999",
    fontWeight: "500",
  },
  subCategoryContainer: {
  paddingVertical: 10,
  paddingHorizontal: 15,
},

subCategoryChip: {
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,
  backgroundColor: "#F2F2F2",
  marginRight: 10,
},

subCategoryChipActive: {
  backgroundColor: "#000",
},

subCategoryText: {
  fontSize: 14,
  color: "#333",
  fontWeight: "500",
},

subCategoryTextActive: {
  color: "#fff",
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