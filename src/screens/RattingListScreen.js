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
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDevice } from '../utils/useDeviceLayout';

export default function RatingListScreen({ route,navigation }) {
  const { t } = useTranslation();
    const { ui } = useDevice(); // ✅ Responsive sizes

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
                Alert.alert(t('common.success'), res.data?.message)
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

  const renderStars = count => (
    <View style={{ flexDirection: 'row', marginVertical: ui.spacing.xs }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons
          key={i}
          name={i <= count ? 'star' : 'star-outline'}
          size={ui.font.body} // ✅ Responsive star size
          color="#f4c430"
        />
      ))}
    </View>
  );

  const renderItem = ({ item }) => {
    const isMyRating = Number(item.user_id) === Number(user?.user?.id);

    return (
      <View
        style={{
          backgroundColor: '#f9f9f9',
          padding: ui.spacing.md,
          borderRadius: ui.radius.md,
          marginBottom: ui.spacing.sm,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Avatar placeholder if needed */}
            <Text style={{ fontSize: ui.font.body, fontWeight: '600' }}>
              {item.user?.firstname} {item.user?.lastname}
            </Text>
          </View>

          {isMyRating && (
            <TouchableOpacity onPress={() => deleteRating(item.id)}>
              <Ionicons name="trash-outline" size={ui.font.body} color="red" />
            </TouchableOpacity>
          )}
        </View>

        {renderStars(item.rating)}

        {item.comment && (
          <Text style={{ fontSize: ui.font.small, color: '#333', marginTop: ui.spacing.xs }}>
            {item.comment}
          </Text>
        )}

        <Text style={{ fontSize: ui.font.small, color: '#777', marginTop: ui.spacing.xs }}>
          {new Date(item.created_at).toDateString()}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomHeader
        title={t('rating_list')}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={ui.font.h2} color="#000" />
          </TouchableOpacity>
        }
        rightComponent={() => null}
      />

      {/* Average Rating Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: ui.spacing.sm,
          paddingHorizontal: ui.spacing.md,
        }}
      >
        <Text style={{ fontSize: ui.font.body, fontWeight: '600' }}>
          ⭐ {averageRating} / 5
        </Text>
        <Text style={{ fontSize: ui.font.body, fontWeight: '600' }}>
          {totalRatings} {t('common.reviews')}
        </Text>
      </View>

      <FlatList
        data={ratings}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[
          { paddingHorizontal: ui.spacing.md },
          ratings.length === 0 && { flex: 1, justifyContent: 'center', alignItems: 'center' },
        ]}
        ListEmptyComponent={<Text style={{ fontSize: ui.font.body, color: '#777' }}>{t('common.no_data_found')}</Text>}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={loadingMore ? <ActivityIndicator style={{ margin: ui.spacing.md }} /> : null}
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
