import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Switch, Image, Modal, Alert } from 'react-native';
import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';



interface Reply {
  id: string;
  comment: string;
  createAt: string;
  updateAt: string;
  user: {
    username: string;
    avatarUrl: string;
  };
}
interface Comment {
  id: string;
  username: string;
  avatarUrl: string;
  text: string;
  createAt: string;
  updateAt: string;
  replies: Reply[];
}

interface CommentMarketScreenProps {
  idMarket: string;
}

const CommentMarketScreen: React.FC<CommentMarketScreenProps> = ({ idMarket }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [holdersOnly, setHoldersOnly] = useState(false);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [replyVisible, setReplyVisible] = useState<{ [key: string]: boolean }>({});
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [editReplyId, setEditReplyId] = useState<string | null>(null); // New state for editing reply comments
  const [editCommentText, setEditCommentText] = useState('');


  useEffect(() => {
    const fetchComments = async () => {
      try {
        const marketId = idMarket;
        const response = await fetch(`https://dehype.api.openverse.tech/api/v1/markets/${marketId}/comments`, {
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
              createAt: new Date(comment.createdAt).toLocaleString(),
              updateAt: new Date(comment.updatedAt).toLocaleString(),
              // Đảm bảo replies là một mảng
              replies: Array.isArray(comment.replies) ? comment.replies.map((reply: any) => ({
                id: reply.id,
                comment: reply.comment,
                createAt: new Date(reply.createdAt).toLocaleString(),
                updateAt: new Date(reply.updatedAt).toLocaleString(),
                user: {
                  username: reply.user.username,
                  avatarUrl: reply.user.avatarUrl
                }
              })) : []
            }));

            setComments(formattedComments);
          } else {
            console.error('No comments found or comments are not in an array.');
          }
        } else {
          console.error('Expected JSON, but got something else:', contentType);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [idMarket]);

  const handleGetAccess = async () => {
    const requestBody = {
      walletAddress: "123412",
      // walletAddress: "laskdflaskjva234jhas",
    };
    const response = await api.post("/auth/login", requestBody, {
      isPublic: true, // Attach isPublic directly
    } as any);

    console.log(response.data);
    const { access_token, refresh_token } = response.data;
    await AsyncStorage.setItem("accessToken", access_token);
    await AsyncStorage.setItem("refreshToken", refresh_token);
  };

  const handleAddComment = async () => {
    const newCommentObj = {
      content: newComment,
    };
    try {
      const response = await api.post(`/markets/${idMarket}/comments`, newCommentObj);

      if (response.status === 200 || response.status === 201) {

        const newCommentFormatted: Comment = {
          id: response.data.id,
          text: response.data.comment,
          username: response.data.user?.walletAddress || 'Anonymous',
          avatarUrl: 'https://res.cloudinary.com/diwacy6yr/image/upload/v1728441530/User/default.png',
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
    try {
      const targetId = replyId || parentId;
      const response = await api.patch(`/markets/${idMarket}/comments/${targetId}`, {
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
        setEditReplyId(null); // Clear editReplyId after updating
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

  const handlePostReply = async (commentId: string) => {
    const replyContent = replyText[commentId];

    const newReplyObj = {
      content: replyContent,
    };

    try {
      // Gọi API để tạo reply mới
      const response = await api.post(`/markets/${idMarket}/comments/${commentId}/replies`, newReplyObj);

      if (response.status === 200 || response.status === 201) {
        const newReply: Reply = {
          id: response.data.id,
          comment: response.data.comment,
          createAt: new Date(response.data.createdAt).toLocaleString(),
          updateAt: new Date(response.data.updatedAt).toLocaleString(),
          user: {
            username: response.data.user?.walletAddress || 'Anonymous',
            avatarUrl: response.data.user?.avatarUrl || 'https://res.cloudinary.com/diwacy6yr/image/upload/v1728441530/User/default.png',
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



  const renderItem = ({ item }: { item: Comment }) => (

    <View style={styles.commentItem}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Kiểm tra avatarUrl trước khi render Image */}
          {item.avatarUrl ? (
            <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
          ) : (
            <Image source={{ uri: 'https://example.com/default-avatar.png' }} style={styles.avatar} />
          )}
          <Text style={styles.username}> {item.username} </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.timeAgo}>{item.createAt}</Text>
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
      {item.replies.map((reply) => (
        <View key={reply.id} style={{ marginLeft: 20, marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Kiểm tra avatarUrl của reply trước khi render Image */}
              {reply.user.avatarUrl ? (
                <Image source={{ uri: reply.user.avatarUrl }} style={styles.avatar} />
              ) : (
                <Image source={{ uri: 'https://example.com/default-avatar.png' }} style={styles.avatar} />
              )}
              <Text style={styles.username}> {reply.user.username} </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.timeAgo}>{reply.createAt}</Text>
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
      ))}
    </View>
  );


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

      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
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
