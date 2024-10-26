// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, useWindowDimensions   } from 'react-native';

// import { Ionicons } from '@expo/vector-icons';
// import RenderHTML from 'react-native-render-html';




// const fetchedBlogs = [
//     {
//       id: '1',
//       title: 'Connect With More Clients: Our Partner Directory Has Arrived',
//       description: 'The partner directory connects your agency with new customers.',
//       date: 'Sep 18',
//       source: 'BBC News',
//       image: 'https://i.pinimg.com/736x/9c/2f/56/9c2f562b06908365b4d19d22a50e8f45.jpg',
//       content: `
//       <h2>Our new partner directory feature is designed to help you connect with more clients</h2>
//       <p>The directory allows agencies to showcase their services to a larger audience, increasing exposure and attracting new business opportunities.</p>
//       <p>It's a powerful tool to help businesses grow in today’s competitive market.</p>
//     `
//     },
//     {
//       id: '2',
//       title: 'Hot Off the Press: New WordPress.com Themes for August 2024',
//       description: 'Four of our favorite new themes.',
//       date: 'Aug 25',
//       source: 'BBC News',
//       image: 'https://i.pinimg.com/564x/ec/2c/85/ec2c85a71d066abad60e7cb2ae2751cb.jpg',
//       content: `
//       <h2>WordPress.com has just released four new themes</h2>
//       <p>These themes are sleek, modern, and optimized for performance.</p>
//       <p>Whether you’re creating a blog, portfolio, or business site, these themes offer the flexibility you need to create something beautiful.</p>
//       <p>In this article, we’ll go over the key features of each theme and help you choose the one that best fits your needs.</p>
//     `
//     },
//     {
//       id: '3',
//       title: 'Re-Creating The New York Times’ Website in Under 30 Minutes Using WordPress.com',
//       description: 'Using WordPress blocks to quickly build a lookalike of the famous website.',
//       date: 'Mar 20',
//       source: 'BBC New',
//       image: 'https://i.pinimg.com/564x/0e/d3/fb/0ed3fb74e806b2afe4197197990d694b.jpg',
//       content: `
//       <h2>Re-create the look and feel of The New York Times website</h2>
//       <p>In this article, we’ll show you how to re-create the look and feel of The New York Times website in under 30 minutes using WordPress.com.</p>
//       <p>Using simple WordPress blocks, you can design a layout similar to that of a major news outlet, with images, text, and interactive features.</p>
//       <p>We’ll guide you step by step through the process and provide tips for customizing your site to suit your needs.</p>
//       `
//     },
//   ];
  

// const BlogDetailScreen = ({ navigation , route  }) => {
//     const { blogId } = route.params; 
//     const { width  } = useWindowDimensions();
//   const [blog, setBlog] = useState(null);  // State để lưu trữ dữ liệu blog
//   const [loading, setLoading] = useState(true);  // State cho trạng thái loading

//   useEffect(() => {
//     // Lấy dữ liệu blog từ mảng giả định
//     const selectedBlog = fetchedBlogs.find((blog) => blog.id === blogId);

//     // Giả lập việc gọi API (nếu cần)
//     if (selectedBlog) {
//       setBlog(selectedBlog);
//       setLoading(false);
//     } else {
//       setLoading(false);  // Nếu không tìm thấy blog, đánh dấu đã xong
//     }
//   }, [blogId]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   if (!blog) {
//     console.log(navigation) ;
//     return (
//       <View style={styles.errorContainer}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//         <Ionicons name="arrow-back" size={30} color="black" />
//         </TouchableOpacity>

//         <Text>{blogId}</Text>
//         <Text style={styles.errorText}>Blog not found!</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>

//     <TouchableOpacity onPress={() => navigation.goBack()}>
//       <Ionicons name="arrow-back" size={30} color="black" />
//     </TouchableOpacity>

//       <Image source={{ uri: blog.image }} style={styles.image} />

//       {/* Tiêu đề blog */}
//       <Text style={styles.title}>{blog.title}</Text>

//       {/* Mô tả blog */}
//       <Text style={styles.description}>{blog.description}</Text>

//       {/* Render HTML content */}
//       <RenderHTML contentWidth={width} source={{ html: blog.content }} />

//       {/* Thông tin nguồn */}
//       <Text style={styles.source}>Source: {blog.source}</Text>

//       {/* Thời gian đăng */}
//       <Text style={styles.date}>Published on: {blog.date}</Text>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 15,
//     backgroundColor: '#fff',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f1f1f1',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   errorText: {
//     fontSize: 18,
//     color: 'red',
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     borderRadius: 8,
//     marginBottom: 15,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   description: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 10,
//   },
//   source: {
//     fontSize: 14,
//     color: '#777',
//     marginBottom: 5,
//   },
//   date: {
//     fontSize: 14,
//     color: '#777',
//   },
// });

// export default BlogDetailScreen;



import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderHTML from 'react-native-render-html';
import {useNavigation} from "@react-navigation/native"
import api from '../api/registerAccountApi';

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
      <Text style={styles.description}>{blog.description}</Text>
      <RenderHTML contentWidth={width} source={{ html: blog.content }} />
      <Text style={styles.source}>Source: {blog.user.username}</Text>
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
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  source: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#777',
  },
});

export default BlogDetailScreen;
