import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Switch, Image } from 'react-native';
import axios from 'axios';

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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const marketId = idMarket;
        const response = await fetch(`https://dehype.api.dehype.fun/api/v1/markets/${marketId}/comments`, {
          headers: {
            'Accept': 'application/json',
          },
        });

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          // console.log('Data:', data);  
          const formattedComments = data.comments.map((comment: any) => ({
            id: comment.id,
            username: comment.user.username,
            avatarUrl: comment.user.avatarUrl,
            text: comment.comment,
            createAt: new Date(comment.createdAt).toLocaleString(),
            updateAt: new Date(comment.updatedAt).toLocaleString(),
            replies: comment.replies.map((reply: any) => ({
              id: reply.id,
              comment: reply.comment,
              createAt: new Date(reply.createdAt).toLocaleString(),
              updateAt: new Date(reply.updatedAt).toLocaleString(),
              user: {
                username: reply.user.username,
                avatarUrl: reply.user.avatarUrl
              }
            }))
          }));

          setComments(formattedComments);
        } else {
          console.error('Expected JSON, but got something else:', contentType);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [idMarket]);




  const handleAddComment = async () => {
    const newId = comments.length + 1;
    const newCommentObj = {
      id: newId.toString(),
      username: "Trần Đình Thắng",
      avatarUrl: "https://res.cloudinary.com/diwacy6yr/image/upload/v1728441530/User/default.png",
      text: newComment,
      createAt: new Date().toLocaleString(),
      updateAt: new Date().toLocaleString(),
      replies: [],
    };
  
    try {
      const response = await axios.post(`https://dehype.api.dehype.fun/api/v1/markets/${idMarket}/comments`, newCommentObj);
      
      if (response.status === 200 || response.status === 201) {
        setComments([newCommentObj, ...comments]);
        setNewComment('');
      } else {
        console.error('Error saving comment:', response.status, response.data);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  const handleReplyPress = (commentId: string) => {
    setReplyVisible(prev => ({ ...prev, [commentId]: true }));
  };

  const handleCancelReply = (commentId: string) => {
    setReplyVisible(prev => ({ ...prev, [commentId]: false }));
    setReplyText(prev => ({ ...prev, [commentId]: '' }));
  };

  const handlePostReply = (commentId: string) => {
    const newReply: Reply = {
      id: (Math.random() * 1000).toString(), // Generate a unique ID for the reply
      comment: replyText[commentId],
      createAt: new Date().toLocaleString(),
      updateAt: new Date().toLocaleString(),
      user: {
        username: "Trần Đình Thắng",
        avatarUrl: "https://res.cloudinary.com/diwacy6yr/image/upload/v1728441530/User/default.png",
      },
    };

    // Update comments with new reply
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, replies: [...comment.replies, newReply] };
        }
        return comment;
      });
    });

    handleCancelReply(commentId);
  };
  

  const renderItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
          <Text style={styles.username}> {item.username} </Text>
        </View>
        <Text style={styles.timeAgo}>{item.createAt}</Text>
      </View>
      <Text style={{ marginLeft: 35 }}>{item.text}</Text>
      <TouchableOpacity onPress={() => handleReplyPress(item.id)}>
        <Text style={styles.likeButton}>Reply</Text>
      </TouchableOpacity>
      

      {/* TextInput cho reply */}
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
              <Image source={{ uri: reply.user.avatarUrl }} style={styles.avatar} />
              <Text style={styles.username}> {reply.user.username} </Text>
            </View>
            <Text style={styles.timeAgo}>{reply.createAt}</Text>
          </View>
          <Text style={{ marginLeft: 35 }}>{reply.comment}</Text>
        </View>
      ))}
    </View>

  );

  return (
    <View style={styles.container}>
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
    </View>
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
});

export default CommentMarketScreen;
