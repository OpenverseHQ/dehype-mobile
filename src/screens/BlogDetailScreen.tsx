import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderHTML from 'react-native-render-html';
import {useNavigation} from "@react-navigation/native"
import api from '../api/registerAccountApi';
import { format } from 'date-fns';

const BlogDetailScreen = ({route}) => {
  const navigation = useNavigation();
  const { blogId } = route.params;
  const { width } = useWindowDimensions();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("id la : ",blogId);
  useEffect(() => {
    // Hàm lấy dữ liệu blog từ API
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/${blogId}`);
        setBlog(response.data); // Gán dữ liệu trả về vào state blog
        console.log("Blog detail ", response.data)
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!blog) {
    return (
      <View style={styles.errorContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.errorText}>Blog not found!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
      <Image source={{ uri: blog.thumbnailUrl }} style={styles.image} />
      <Text style={styles.title}>{blog.title}</Text>
      <Text style={styles.source}>Published on: {format(new Date(blog.createdAt), 'MMM dd, yyyy')}</Text>
      {/* <Text style={styles.description}>{blog.description}</Text> */}
      <RenderHTML contentWidth={width} source={{ html: blog.content }} />
      <Text style={styles.date}>Published on: {blog.createdAt}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  source: {
    fontSize: 12,
    color: '#777',
    marginBottom: 5,
    textAlign: 'right',
  },
  date: {
    fontSize: 14,
    color: 'black',
  },
});

export default BlogDetailScreen;
