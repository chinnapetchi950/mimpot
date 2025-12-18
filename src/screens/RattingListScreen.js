import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../api/authService';
import { imageUrl } from '../api/authService';
import CustomHeader from '../components/CustomHeader';
import strings from '../localization/en';
import { useSelector } from 'react-redux';

export default function RatingListScreen({ route,navigation }) {
  const { documentId } = route.params;
  const { user } = useSelector((state) => state.user);
console.log("user=======>",user);

  const [ratings, setRatings] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    fetchRatings(1);
  }, []);

  const fetchRatings = async (pageNo = 1) => {
    try {
      pageNo === 1 ? setLoading(true) : setLoadingMore(true);
      const res=await authService.rattinglist(documentId,pageNo)

      // const res = await authService.get(
      //   `/api/user/documents/${documentId}/ratings?page=${pageNo}`
      // );

      const apiData = res?.data?.data || {};
      const ratingBlock = apiData.ratings || {};

      setAverageRating(apiData.average_rating || 0);
      setTotalRatings(apiData.total_ratings || 0);
      setLastPage(ratingBlock.last_page || 1);
      setPage(pageNo);

      if (pageNo === 1) {
        setRatings(ratingBlock.data || []);
      } else {
        setRatings(prev => [...prev, ...(ratingBlock.data || [])]);
      }
    } catch (error) {
      console.log('Fetch Rating Error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const deleteRating = (ratingId) => {
    Alert.alert(
      'Delete Rating',
      'Are you sure you want to delete this rating?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
               let formData = new FormData();
    formData.append("_method", 'DELETE');
    const res=await authService.rattingDelete(documentId,formData)
              console.log(res,'delete res');
              if(res.status){
                Alert.alert("Success",res.data?.message)
              setRatings(prev => prev.filter(r => r.id !== ratingId));

              }
              
            } catch (error) {
              console.log('Delete Error:', error);
            }
          },
        },
      ]
    );
  };

  const loadMore = () => {
    if (!loadingMore && page < lastPage) {
      fetchRatings(page + 1);
    }
  };

  const renderStars = (count) => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons
          key={i}
          name={i <= count ? 'star' : 'star-outline'}
          size={16}
          color="#f4c430"
        />
      ))}
    </View>
  );

  const renderItem = ({ item }) => {
    const isMyRating = Number(item.user_id) === Number(user?.user?.id);

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.userRow}>
            {/* <Image
              source={{ uri: item.user?.profile_image_url }}
              style={styles.avatar}
            /> */}
            <Text style={styles.userName}>
              {item.user?.firstname} {item.user?.lastname}
            </Text>
          </View>

          {isMyRating && (
            <TouchableOpacity onPress={() => deleteRating(item.id)}>
              <Ionicons name="trash-outline" size={20} color="red" />
            </TouchableOpacity>
          )}
        </View>

        {renderStars(item.rating)}

        {item.comment ? (
          <Text style={styles.comment}>{item.comment}</Text>
        ) : null}

        <Text style={styles.date}>
          {new Date(item.created_at).toDateString()}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
<CustomHeader
        title={'RattingList'}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
        }
        rightComponent={() => null}
      />
      {/* 🔢 Average Rating Header */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          ⭐ {averageRating} / 5
        </Text>
        <Text style={styles.summaryText}>
          {totalRatings} Reviews
        </Text>
      </View>

      <FlatList
        data={ratings}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[
          {paddingHorizontal: 16},
          ratings.length === 0 && styles.center
        ]}
        ListEmptyComponent={
          <Text style={styles.noDataText}>No ratings found</Text>
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator style={{ margin: 16 }} /> : null
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 66/2,
    marginRight: 10,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
  },
  starRow: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  comment: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#777',
    marginTop: 6,
  },
});
