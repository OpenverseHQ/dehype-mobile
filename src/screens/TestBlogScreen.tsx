import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import BlogItem from '../components/BlogItem';
import Icon from 'react-native-vector-icons/Ionicons'; 
import api from '../api/registerAccountApi';
import BlogDetailScreen from './BlogDetailScreen';

const TestBlogsScreen = ({navigation}) => {
  const [blogs, setBlogs] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    // Fetch data from API
    const fetchPosts = async () => {
      try {
        const response = await api.get("/blogs");
        setBlogs(response.data.blogs);
        console.log(response.data.blogs) ;
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);


  const handlePress = (blogId) => {
    console.log("Navigating to BlogDetailScreen with ID:", blogId);
    navigation.navigate('BlogDetailScreen',{ blogId: blogId });
  };
  console.log(navigation)
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Blogs</Text>
        <Icon name="book-outline" size={28} color="#4b7bec" />
      </View>

      {/* Blog List */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={blogs}
        keyExtractor={(item) => item.id}
        renderItem={
          ({ item }) => (<TouchableOpacity onPress={()=>handlePress(item.id)}>
            <BlogItem {...item}/>               
            </TouchableOpacity>)
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
});

export default TestBlogsScreen;