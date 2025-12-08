import React,{useEffect,useState}from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Image, Dimensions, StatusBar,TouchableOpacity,ActivityIndicator } from 'react-native';
import { colors } from '../styles/theme';;
import SearchBar from '../components/SearchBar';
import TopLawCard from '../components/TopLawCard';
import CategoryCard from '../components/CategoryCard';
import LearningCard from '../components/LearningCard';
import QuickAccessCard from '../components/QuickAccessCard';
import NewsCard from '../components/NewsCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../api/authService';
import { useSelector,useDispatch } from 'react-redux';
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomHeader from '../components/CustomHeader';
import Storage from '../utils/storage';
import { setUser,setToken } from '../store/userSlice';
const { width } = Dimensions.get('window');



const categorieslist = [
  { id: 'c1', title: 'Civil Laws', icon: 'https://picsum.photos/60?random=11' },
  { id: 'c2', title: 'Criminal Laws', icon: 'https://picsum.photos/60?random=12' },
  { id: 'c3', title: 'Business & Corporate', icon: 'https://picsum.photos/60?random=13' },
  { id: 'c4', title: 'International Laws', icon: 'https://picsum.photos/60?random=14' },
  { id: 'c5', title: 'Constitutional Laws', icon: 'https://picsum.photos/60?random=15' },
];



  

  

export default function HomeScreen({navigation}) {
  const [topLawData, setTopLawData] = useState([]);
 const [categories, setCategories] = useState([]);
  const [learning, setLearning] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
 const dispatch=useDispatch()
const { user, token } = useSelector(state => state.user);
console.log(user?.user, "Redux user data");//console.log(user,"data");
useEffect(() => {
  const checkAuth = async () => {
    const storedUser = await Storage.getItem("userData");
    const storedToken = await Storage.getItem("token");

    dispatch(setUser(storedUser));
    dispatch(setToken(storedToken));
  };

  checkAuth();
}, []);  // only once

  const formatTopLawData = (exploreTaxLaws) => {
  if (!exploreTaxLaws || !exploreTaxLaws.category) return [];

  const { category, documents } = exploreTaxLaws;

  // Each document can be one top law card
  return documents.map((doc) => ({
    id: doc.id.toString(),
    title: doc.title,
    image: doc.image
      ? `http://testlink2.pillersofttechnologies.com/storage/${doc.image}`
      : `https://picsum.photos/300/200?random=${doc.id}`, // fallback placeholder
  }));
};
  const fetchHome = async () => {
    setLoading(true);
    try {
      const res = await authService.home(); // call API
      console.log(res.data, 'API response');

     const apiData = res.data?.data;

    const formattedTopLawData = formatTopLawData(apiData?.explore_tax_laws);
    ///setTopLawData(formattedTopLawData);
     setTopLawData(apiData?.explore_tax_laws || []); 
     console.log(apiData?.explore_tax_laws,'res.data.explore_tax_laws');
     
      
    // setTopLawData(formattedTopLawData);
      setCategories(apiData?.legal_categories);
      setLearning(apiData?.learning_hub || []);
      setNews(apiData?.news || []);
      setLoading(false);

    } catch (error) {
            setLoading(false);

      console.log('home ERROR:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHome();
  }, []);
  if (loading) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    </SafeAreaView>
  );
}
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={"#FFFFFF"} barStyle={'dark-content'}></StatusBar>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <CustomHeader
    title={`Hi ${[user?.user?.firstname, user?.user?.lastname]
      .filter(Boolean)
      .join(" ")}`}
    showLanguage={true}
    headerContainerStyle={{ elevation: 1, shadowOpacity: 0.1 }}
  />

        <SearchBar />

        <Text style={styles.sectionTitle}>Explore Tax Laws</Text>
        <FlatList
          data={topLawData}
          keyExtractor={(i)=>i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          renderItem={({item}) => <TopLawCard onPress={(selectedItem) => {
    console.log("Card clicked:", item);
    navigation.navigate("TaxRegulation", { categoryId: item.id });
  }}  item={item} />}
        />

        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Explore Legal Categories</Text>
          <TouchableOpacity onPress={()=>navigation.navigate('CategoriesScreen')}>
          <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesWrap}>
          {categories.map(cat => <CategoryCard key={cat.id} item={cat} />)}
        </View>

        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Your Legal Learning Hub</Text>
          <TouchableOpacity onPress={()=>navigation.navigate('LearningHubScreen')}>
          <Text style={styles.seeAll}>See All</Text>

          </TouchableOpacity>
        </View>

   {learning.map(l => (
  <LearningCard
    onPress={(selectedItem) => {
      console.log("Card clicked:", l);
      navigation.navigate("DetailsScreen", { categoryId: l.id });
    }}
    key={l.id}
    item={l}
  />
))}

        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Quick Ascess</Text>
        <View style={styles.quickRow}>
          <QuickAccessCard title="Bookmarked" />
          <QuickAccessCard title="Downloaded" />
          <QuickAccessCard title="Recently Viewed" />
        </View>

        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Latest News Updates</Text>
          <TouchableOpacity onPress={()=>navigation.navigate('NewsScreen')}>
          <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.newsGrid}>
          {news.map(n => <NewsCard key={n.id} item={n} />)}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { paddingBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, marginTop: 8 },
  greeting: { fontSize: 20, fontWeight: '700', color: colors.text },
  flag: { width: 36, height: 36, borderRadius: 18 },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginTop: 18, paddingHorizontal: 18, color: colors.text },
  seeAll: { color: colors.muted, fontSize: 13, marginRight: 18 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 },
  categoriesWrap: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, justifyContent: 'space-between' },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, marginTop: 8 },
  newsGrid: { paddingHorizontal: 12, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  langBox: {
      flexDirection: "row",
      alignItems: "center",
    },
  
    flag: {
      width: 22,
      height: 22,
      borderRadius: 50,
      marginRight: 5,
    },
  
    langText: {
      fontSize: 14,
      marginRight: 4,
      color: "#000",
    },
});
