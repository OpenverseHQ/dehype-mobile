import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Image, TouchableOpacity , ActivityIndicator  } from 'react-native';
import BlogItem from '../components/BlogItem';
import Icon from 'react-native-vector-icons/Ionicons'; 
import useApi from '../utils/useApi';
import BlogDetailScreen from './BlogDetailScreen';

const TestBlogsScreen = ({navigation}) => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1); // current page
  const [loading, setLoading] = useState(false);
  const [noBlogToFetch, setNoBlogToFetch] = useState(false);
  const {GetBlogs} = useApi() ;
  

  const PageSize = 3 ;
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await GetBlogs(PageSize,page) ;
      const data = response.data.blogs
      console.log(response.data.blogs) ;
      console.log(data.length==0)
      if(data.length==0) {
        setNoBlogToFetch(true) ;
      }

      setBlogs(prevBlogs => [...prevBlogs, ...data]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error("Error loading blogs:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleLoadMore = () => {
    if (!loading && !noBlogToFetch) {
      console.log("Loading More")
      fetchBlogs();
    }
  };

  const handlePress = (blogId) => {
    console.log("Navigating to BlogDetailScreen with ID:", blogId);
    navigation.navigate('BlogDetailScreen',{ blogId: blogId });
  };

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

        onEndReached={handleLoadMore}
        onEndReachedThreshold={1}
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
        
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