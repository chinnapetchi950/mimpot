import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { authService } from '../api/authService';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
export default function CommentScreen({ documentId, onClose }) {
  const { t } = useTranslation();
  // const { documentId } = route.params;

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchComments(1);
  }, []);

  // ✅ FETCH COMMENTS (MATCHES YOUR API)
  const fetchComments = async (pageNo = 1) => {
    try {
      pageNo === 1 ? setLoading(true) : setLoadingMore(true);

      const res = await authService.commentList(documentId,pageNo)
console.log("res====>",res);

      const apiData = res?.data?.data || {};

      setPage(apiData.current_page || 1);
      setLastPage(apiData.last_page || 1);

      if (pageNo === 1) {
        setComments(apiData.data || []);
      } else {
        setComments(prev => [...prev, ...(apiData.data || [])]);
      }
    } catch (error) {
      console.log('Fetch Comments Error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // ✅ SUBMIT COMMENT
  const submitComment = async () => {
  if (!commentText.trim()) return;

  try {
    setSending(true);

    const res = await authService.commentCreate(
      documentId,
      { comment: commentText }   // ✅ JSON
    );
console.log('commentres======>',res?.data);

    if (res?.data?.success) {
      setCommentText('');
      fetchComments(1);
    }
  } catch (error) {
    console.log('Submit Comment Error:', error);
  } finally {
    setSending(false);
  }
};
const deleteComment = (commentId) => {
  Alert.alert(
    t('comments.delete_comment_title'),
    t('comments.delete_comment_message'),
    [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            let formData =new FormData()
            formData.append('_method','DELETE')
            const res =await authService.commentDelete(documentId, commentId,formData);
if(res.status){
setComments(prev =>
              prev.filter(item => item.id !== commentId)
            );
}
            // ✅ Remove from UI instantly
            
          } catch (error) {
            console.log('Delete Comment Error:', error);
          }
        },
      },
    ]
  );
};


  const loadMore = () => {
    if (!loadingMore && page < lastPage) {
      fetchComments(page + 1);
    }
  };

  // ✅ RENDER EACH COMMENT
  const renderItem = ({ item }) => (
    
  <View style={styles.commentCard}>
        {console.log(item.user_id, user?.id,'item.user_id == user?.user?.id')}

    <Image
      source={{
        uri:
          item.user?.profile_image_url ||
          'https://ui-avatars.com/api/?name=User',
      }}
      style={styles.avatar}
    />

    <View style={{ flex: 1 }}>
      <View style={styles.row}>
        <Text style={styles.userName}>
          {item.user?.firstname} {item.user?.lastname}
        </Text>

        {/* 🗑 DELETE (ONLY OWN COMMENT) */}
        {item.user_id == user?.id && (
          <TouchableOpacity
            onPress={() => deleteComment(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color="red" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.comment}>{item.comment}</Text>

      <Text style={styles.date}>
        {new Date(item.created_at).toDateString()}
      </Text>
    </View>
  </View>
);


  return (
    <SafeAreaView style={styles.container}>
      {/* 🔹 COMMENTS LIST */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
          <FlatList
          data={comments}
         keyExtractor={(item, index) =>
  item?.id ? item.id.toString() : `comment-${index}`
}

          renderItem={renderItem}
          contentContainerStyle={
            comments.length === 0 && styles.center
          }
          ListEmptyComponent={
            <Text style={styles.noDataText}>
              {t('comments.no_comments_found')}
            </Text>
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator style={{ margin: 16 }} />
            ) : null
          }
        />
      )}

      {/* 🔹 COMMENT INPUT */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inputRow}>
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder={t('comments.write_a_comment')}
            style={styles.input}
            multiline
          />
          <TouchableOpacity
            onPress={submitComment}
            disabled={sending}
            style={styles.sendBtn}
          >
            {sending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  commentCard: {
    flexDirection: 'row',
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
  },
  comment: {
    fontSize: 14,
    marginTop: 2,
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    paddingTop: 60,
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    maxHeight: 180,
    height:50,
    borderWidth: 1,
    // backgroundColor:'red',
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 40,
    paddingVertical: 8,
    marginRight: 18,
  },
  sendBtn: {
    backgroundColor: '#007bff',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

});
