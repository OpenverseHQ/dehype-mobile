import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const BlogItem = ({ title, description, date, source, image }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {/* Phần chứa source và date */}
        <View style={styles.infoRow}>
            <Text style={styles.source}>{source}</Text>
            <Text style={styles.date}>{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  content: {
    marginTop: 10,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    //textAlign: 'center',
    marginBottom: 5,  // Tạo khoảng cách giữa title và description
  },
  description: {
    fontSize: 14,
    color: '#666',  // Màu xám nhạt để tạo sự phân biệt
    //textAlign: 'center',
    marginBottom: 10,  // Tạo khoảng cách giữa description và infoRow
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  source: {
    fontSize: 14,
    color: '#4c84e6',
  },
  date: {
    fontSize: 12,
    color: '#4c84e6',
  },
});

export default BlogItem;