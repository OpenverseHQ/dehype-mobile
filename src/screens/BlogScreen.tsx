import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Image } from 'react-native';
import BlogItem from '../components/BlogItem';
import Icon from 'react-native-vector-icons/Ionicons'; 

const BlogsScreen = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Dữ liệu giả định
    const fetchedBlogs = [
      {
        id: '1',
        title: 'Connect With More Clients: Our Partner Directory Has Arrived',
        description: 'The partner directory connects your agency with new customers.',
        date: 'Sep 18',
        source: 'BBC News',
        image: 'https://i.pinimg.com/736x/9c/2f/56/9c2f562b06908365b4d19d22a50e8f45.jpg',
      },
      {
        id: '2',
        title: 'Hot Off the Press: New WordPress.com Themes for August 2024',
        description: 'Four of our favorite new themes.',
        date: 'Aug 25',
        source: 'BBC News',
        image: 'https://i.pinimg.com/564x/ec/2c/85/ec2c85a71d066abad60e7cb2ae2751cb.jpg',
      },
      {
        id: '3',
        title: 'Re-Creating The New York Times’ Website in Under 30 Minutes Using WordPress.com',
        description: 'Using WordPress blocks to quickly build a lookalike of the famous website.',
        date: 'Mar 20',
        source: 'BBC News',
        image: 'https://i.pinimg.com/564x/0e/d3/fb/0ed3fb74e806b2afe4197197990d694b.jpg',
      },
    ];
    setBlogs(fetchedBlogs);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.logo} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Markets"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View> */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Blogs</Text>
        <Icon name="book-outline" size={28} color="#4b7bec" />
      </View>

      {/* Blog List */}
      <FlatList
        data={blogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BlogItem {...item} />}
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

export default BlogsScreen;