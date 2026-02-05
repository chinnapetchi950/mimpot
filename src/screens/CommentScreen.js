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
import { useDevice } from '../utils/useDeviceLayout';

export default function CommentScreen({ documentId, onClose }) {
  const { t } = useTranslation();
  // const { documentId } = route.params;
  const { ui } = useDevice(); // <-- useDevice

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
    <View style={[styles.commentCard, { padding: ui.spacing.sm }]}>
      <Image
        source={{
          uri: item.user?.profile_image_url || 'https://ui-avatars.com/api/?name=User',
        }}
        style={{ width: ui.avatar, height: ui.avatar, borderRadius: ui.avatar / 2, marginRight: ui.spacing.sm }}
      />

      <View style={{ flex: 1 }}>
        <View style={styles.row}>
          <Text style={{ fontSize: ui.font.body, fontWeight: '600' }}>
            {item.user?.firstname} {item.user?.lastname}
          </Text>

          {item.user_id == user?.id && (
            <TouchableOpacity onPress={() => deleteComment(item.id)}>
              <Ionicons name="trash-outline" size={ui.iconSmall} color="red" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={{ fontSize: ui.font.body, marginTop: ui.spacing.xs, color: '#333' }}>{item.comment}</Text>
        <Text style={{ fontSize: ui.font.small, color: '#777', marginTop: ui.spacing.xs }}>
          {new Date(item.created_at).toDateString()}
        </Text>
      </View>
    </View>
  );


 return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: ui.spacing.md }} />
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item, index) => (item?.id ? item.id.toString() : `comment-${index}`)}
          renderItem={renderItem}
          contentContainerStyle={comments.length === 0 && { flex: 1, justifyContent: 'center', alignItems: 'center' }}
          ListEmptyComponent={<Text style={{ fontSize: ui.font.body, color: '#777' }}>{t('comments.no_comments_found')}</Text>}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ margin: ui.spacing.md }} /> : null}
        />
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <View style={[styles.inputRow, { padding: ui.spacing.sm, paddingTop: ui.spacing.lg,justifyContent:"space-between",alignItems:'center' }]}>
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder={t('comments.write_a_comment')}
            style={{
              width:'80%',
              maxHeight: 180,
              height: ui.inputHeight,
              borderRadius:22,
              borderWidth: 1,
              borderColor: '#ccc',
              // borderRadius: ui.radius.lg,
              paddingHorizontal: ui.spacing.md,
              paddingVertical: ui.spacing.xs,
              marginRight: ui.spacing.md,
              fontSize: ui.font.body,
            }}
            multiline
          />
          <TouchableOpacity
            onPress={submitComment}
            disabled={sending}
            style={{
              backgroundColor: '#007bff',
              // width: ui.avatar,
              // height: ui.avatar,
              // borderRadius: ui.avatar / 2,
              justifyContent: 'center',
              alignItems: 'center',
               position: "absolute",
                  right: 18,
                
                  width: 48,
                  bottom:5,
                  height: 48,
                  borderRadius:48/2,
              
                  elevation: 6,
            }}
          >
            {sending ? <ActivityIndicator color="#fff" /> : <Ionicons name="send" size={ui.iconSmall} color="#fff" />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
   row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
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
    borderRadius: 42/2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

});
