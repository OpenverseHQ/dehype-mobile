import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Switch, Image, ActivityIndicator, Alert } from 'react-native';
import api from '../api/registerAccountApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { formatDistanceToNow, parseISO, parse } from 'date-fns';

// Hoang Custom
import { useAuthorization } from '../utils/useAuthorization';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import FilterResultScreen from '../screens/FilterResultScreen';
//

interface Reply {
  id: string;
  comment: string;
  createAt: string;
  updateAt: string;
  user: {
    username: string;
    avatarUrl: string;
    walletAddress: string
  };
}
interface Comment {
  id: string;
  username: string;
  avatarUrl: string;
  text: string;
  createAt: string;
  updateAt: string;
  walletAddress: string;
  replies: Reply[];
}

interface CommentMarketScreenProps {
  idMarket: string;
}

type RootStackParamList = {
  InfoUser: { address: string };
};


const CommentMarketScreen: React.FC<CommentMarketScreenProps> = ({ idMarket }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [holdersOnly, setHoldersOnly] = useState(false);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [replyVisible, setReplyVisible] = useState<{ [key: string]: boolean }>({});
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [editReplyId, setEditReplyId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [enableMenu, setenableMenu] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();






  const fetchComments = async (page) => {
    setLoading(true);
    try {
      const marketId = idMarket;
      const response = await fetch(`https://dehype.api.openverse.tech/api/v1/markets/${marketId}/comments?current=${page}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        // Kiểm tra nếu comments tồn tại
        if (data.comments && Array.isArray(data.comments)) {
          const formattedComments = data.comments.map((comment: any) => ({
            id: comment.id,
            username: comment.user.username,
            avatarUrl: comment.user.avatarUrl,
            text: comment.comment,
            walletAddress: comment.user.walletAddress,
            createAt: new Date(comment.createdAt).toLocaleString(),
            updateAt: new Date(comment.updatedAt).toLocaleString(),
            replies: Array.isArray(comment.replies) ? comment.replies.map((reply: any) => ({
              id: reply.id,
              comment: reply.comment,
              createAt: new Date(reply.createdAt).toLocaleString(),
              updateAt: new Date(reply.updatedAt).toLocaleString(),
              user: {
                walletAddress: reply.user.walletAddress,
                username: reply.user.username,
                avatarUrl: reply.user.avatarUrl
              }
            })) : []
          }));

          setComments(prevComments => [...prevComments, ...formattedComments]);

          // Kiểm tra nếu còn trang để tải thêm
          if (page <= data.meta.pages) {
            setHasMore(true);
          } else {
            setHasMore(false);
          }
        } else {
          console.error('No comments found or comments are not in an array.');
          setHasMore(false);
        }
      } else {
        console.error('Expected JSON, but got something else:', contentType);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments(currentPage);
  }, [idMarket, currentPage]);

  const loadMoreComments = () => {
    if (hasMore && !loading) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handleGetAccess = async (wallet) => {
    const requestBody = {
      walletAddress: wallet,
    };
    const response = await api.post("/auth/login", requestBody, {
      isPublic: true,
    } as any);

    const { access_token, refresh_token } = response.data;
    await AsyncStorage.setItem("accessToken", access_token);
    await AsyncStorage.setItem("refreshToken", refresh_token);
  };

  const { selectedAccount } = useAuthorization();
  const handleAddComment = async () => {
    if (selectedAccount == null) {
      const showAlert = () => {
        Alert.alert(
          "",
          "You need to log in to comment",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      };
      showAlert();
      return;
    }
    await handleGetAccess(selectedAccount.publicKey);

    const newCommentObj = {
      content: newComment,
    };
    try {
      const response = await api.post(`/markets/${idMarket}/comments`, newCommentObj);
      const response_user = await api.get(`/users/${response.data.user.walletAddress}`);

      if (response.status === 200 || response.status === 201) {

        const newCommentFormatted: Comment = {
          id: response.data.id,
          text: response.data.comment,
          walletAddress: response.data.user.walletAddress,
          username: response_user.data.username || 'Anonymous',
          avatarUrl: response_user.data.avatarUrl,
          createAt: new Date(response.data.createdAt).toLocaleString(),
          updateAt: new Date(response.data.updatedAt).toLocaleString(),
          replies: [],
        };

        setComments(prevComments => [newCommentFormatted, ...prevComments]);
        setNewComment('');
      } else {
        console.error('Error saving comment:', response.status, response.data);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (parentId: string, replyId?: string) => {
    if (selectedAccount == null) {
      Alert.alert('You need to log in to perform this function')
    }
    await handleGetAccess(selectedAccount.publicKey);

    try {
      const targetId = replyId || parentId;
      const response = await api.delete(`/markets/${idMarket}/comments/${targetId}`);

      if (response.status === 200 || response.status === 204) {
        setComments(prevComments =>
          prevComments.map(comment => {
            if (comment.id === parentId) {
              // If deleting a reply
              if (replyId) {
                return {
                  ...comment,
                  replies: comment.replies.filter(reply => reply.id !== replyId),
                };
              }
              // If deleting a main comment
              return null;
            }
            return comment;
          }).filter(Boolean) as Comment[]
        );
      } else {
        console.error('Error deleting comment:', response.status, response.data);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };


  const handleUpdateComment = async (parentId: string, updatedText: string, replyId?: string) => {
    if (selectedAccount == null) {
      Alert.alert('You need to log in to perform this function')
    }
    await handleGetAccess(selectedAccount.publicKey); // Get access & refresh
    try {
      const targetId = replyId || parentId;
      const requestUrl = `/markets/${idMarket}/comments/${targetId}`;

      const response = await api.patch(requestUrl, {
        content: updatedText,
      });


      if (response.status === 200) {
        setComments(prevComments =>
          prevComments.map(comment => {
            if (comment.id === parentId) {
              // Check if updating the main comment or a reply
              if (replyId) {
                return {
                  ...comment,
                  replies: comment.replies.map(reply =>
                    reply.id === replyId ? { ...reply, comment: updatedText } : reply
                  ),
                };
              }
              return { ...comment, text: updatedText };

            }
            return comment;
          })
        );
        setEditCommentId(null);
        setEditReplyId(null);
      } else {
        console.error('Error updating comment:', response.status, response.data);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };



  const handleEditPress = (commentId: string, currentText: string, replyId?: string) => {
    setEditCommentId(commentId);
    setEditReplyId(replyId || null);
    setEditCommentText(currentText);
  };



  const handleReplyPress = (commentId: string) => {
    setReplyVisible(prev => ({ ...prev, [commentId]: true }));
  };

  const handleCancelReply = (commentId: string) => {
    setReplyVisible(prev => ({ ...prev, [commentId]: false }));
    setReplyText(prev => ({ ...prev, [commentId]: '' }));
  };
  const parseDate = (dateString) => {
    // Cách xử lý chuỗi ngày giờ với định dạng 'HH:mm:ss, DD/MM/YYYY'
    const dateFormat = 'HH:mm:ss, dd/MM/yyyy';  // Định dạng chuỗi cần phân tích
    return parse(dateString, dateFormat, new Date());
  };

  const handlePostReply = async (commentId: string) => {
    await handleGetAccess(selectedAccount.publicKey);
    const replyContent = replyText[commentId];
    const newReplyObj = {
      content: replyContent,
    };

    try {
      // Gọi API để tạo reply mới
      const response = await api.post(`/markets/${idMarket}/comments/${commentId}/replies`, newReplyObj);
      const response_user = await api.get(`/users/${response.data.user.walletAddress}`);


      if (response.status === 200 || response.status === 201) {
        const newReply: Reply = {
          id: response.data.id,
          comment: response.data.comment,
          createAt: new Date(response.data.createdAt).toLocaleString(),
          updateAt: new Date(response.data.updatedAt).toLocaleString(),
          user: {
            walletAddress: response.data.user.walletAddress,
            username: response_user.data.walletAddress || 'Anonymous',
            avatarUrl: response_user.data.avatarUrl,
          },
        };

        // Cập nhật danh sách comments với reply mới
        setComments(prevComments => {
          return prevComments.map(comment => {
            if (comment.id === commentId) {
              return { ...comment, replies: [...comment.replies, newReply] };
            }
            return comment;
          });
        });

        // Xóa nội dung reply sau khi gửi thành công
        handleCancelReply(commentId);
      } else {
        console.error('Error saving reply:', response.status, response.data);
      }
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };



  const renderItem = ({ item }: { item: Comment }) => {
    const parsedTime = parseDate(item.createAt);
    const timeAgo = !isNaN(parsedTime.getTime()) ? formatDistanceToNow(parsedTime) : '';
    return (
      <View style={styles.commentItem}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('InfoUser', { address: item.walletAddress })}>
            {/* Kiểm tra avatarUrl trước khi render Image */}
            {item.avatarUrl ? (
              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
            ) : (
              <Image source={{ uri: 'https://example.com/default-avatar.png' }} style={styles.avatar} />
            )}
            <Text style={styles.username}> {item.username.length < 10 ? item.username : item.username.substring(0, 10).concat("...")} </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={styles.timeAgo}>
              {timeAgo} ago
            </Text>
            {selectedAccount && selectedAccount.publicKey && item.walletAddress === selectedAccount.publicKey.toString() && (
              <Menu>
                <MenuTrigger>
                  <Icon size={20} name="dots-horizontal" />
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption onSelect={() => handleEditPress(item.id, item.text)}>
                    <View style={styles.option}>
                      <Icon name="update" size={20} />
                      <Text style={styles.menuText}>Update</Text>
                    </View>
                  </MenuOption>
                  <MenuOption onSelect={() => handleDeleteComment(item.id)}>
                    <View style={styles.option}>
                      <Icon name="delete" size={20} />
                      <Text style={styles.menuText}>Delete</Text>
                    </View>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            )}
          </View>

        </View>
        {/* Hiển thị TextInput khi comment ở chế độ chỉnh sửa */}
        {editCommentId === item.id && !editReplyId ? (
          <View style={{ marginLeft: 35 }}>
            <TextInput
              style={styles.input}
              value={editCommentText}
              onChangeText={setEditCommentText}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => setEditCommentId(null)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleUpdateComment(item.id, editCommentText)}>
                <Text style={styles.postButtonTextRep}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={{ marginLeft: 35 }}>{item.text}</Text>
        )}
        <TouchableOpacity onPress={() => handleReplyPress(item.id)}>
          <Text style={styles.likeButton}>Reply</Text>
        </TouchableOpacity>

        {/* TextInput  reply */}
        {replyVisible[item.id] && (
          <View style={{ marginLeft: 35, marginTop: 10 }}>
            <TextInput
              style={styles.input}
              value={replyText[item.id] ?? ''}
              onChangeText={text => setReplyText(prev => ({ ...prev, [item.id]: text }))}
              placeholder={`@${item.username}`}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => handleCancelReply(item.id)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => handlePostReply(item.id)}> */}
              <TouchableOpacity onPress={() => handlePostReply(item.id)}>
                <Text style={styles.postButtonTextRep}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Hiển thị replies */}
        {item.replies.map((reply) => {
          const parsedReplyTime = parseDate(reply.createAt);
          const timeReplyAgo = !isNaN(parsedReplyTime.getTime()) ? formatDistanceToNow(parsedReplyTime) : '';
          return (

            <View key={reply.id} style={{ marginLeft: 20, marginTop: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {/* Kiểm tra avatarUrl của reply trước khi render Image */}
                  {reply.user.avatarUrl ? (
                    <Image source={{ uri: reply.user.avatarUrl }} style={styles.avatar} />
                  ) : (
                    <Image source={{ uri: 'https://example.com/default-avatar.png' }} style={styles.avatar} />
                  )}
                  <Text style={styles.username}> {reply.user.username.length < 10 ? reply.user.username : reply.user.username.substring(0, 10).concat("...")} </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={styles.timeAgo}>{timeReplyAgo} ago</Text>
                  {selectedAccount && selectedAccount.publicKey && reply.user.walletAddress === selectedAccount.publicKey.toString() && (
                    <Menu>
                      <MenuTrigger>
                        <Icon size={20} name="dots-horizontal" />
                      </MenuTrigger>
                      <MenuOptions>
                        <MenuOption onSelect={() => handleEditPress(item.id, reply.comment, reply.id)}>
                          <View style={styles.option}>
                            <Icon name="update" size={20} />
                            <Text style={styles.menuText}>Update</Text>
                          </View>
                        </MenuOption>
                        <MenuOption onSelect={() => handleDeleteComment(item.id, reply.id)}>
                          <View style={styles.option}>
                            <Icon name="delete" size={20} />
                            <Text style={styles.menuText}>Delete</Text>
                          </View>
                        </MenuOption>
                      </MenuOptions>
                    </Menu>
                  )}
                </View>
              </View>
              {/* Edit TextInput for reply */}
              {editCommentId === item.id && editReplyId === reply.id ? (
                <View style={{ marginLeft: 35 }}>
                  <TextInput
                    style={styles.input}
                    value={editCommentText}
                    onChangeText={setEditCommentText}
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => setEditCommentId(null)}>
                      <Text style={styles.cancelButton}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleUpdateComment(item.id, editCommentText, reply.id)}>
                      <Text style={styles.postButtonTextRep}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <Text style={{ marginLeft: 35 }}>{reply.comment}</Text>
              )}
            </View>
          );
        })}
      </View>
    );
  }


  return (
    <MenuProvider style={styles.container}>
      <TextInput
        style={styles.input}
        value={newComment}
        onChangeText={setNewComment}
        placeholder="Add a comment"
      />
      <TouchableOpacity style={styles.postButton} onPress={handleAddComment}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>

      <View style={styles.filterContainer}>
        <Text>Newest</Text>
        <Switch value={holdersOnly} onValueChange={setHoldersOnly} />
        <Text>Holders</Text>
      </View>
      <View>
        <FlatList
          data={comments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadMoreComments}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator /> : null}
        />
      </View>

    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
    borderRadius: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    color: 'red',
    marginRight: 10,
    padding: 5,

  },
  postButtonTextRep: {
    color: '#007bff',
    padding: 5
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    margin: 1,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commentItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  supporterTag: {
    color: 'green',
    fontWeight: 'normal',
  },
  timeAgo: {
    fontSize: 12,
    color: '#666',
    marginRight: 5
  },
  likeButton: {
    color: '#007bff',
    marginLeft: 35,
    margin: 5
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
  },
});


export default CommentMarketScreen;