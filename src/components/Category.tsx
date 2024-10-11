import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { Component } from 'react'
import { useNavigation } from '@react-navigation/native';

interface myProps {
    nameCategory: string;
  }
  
  const Category: React.FC<myProps> = ({ nameCategory }) => {
    const navigation = useNavigation(); 
  
    const handlePress = () => {
      navigation.navigate('Category', { category: nameCategory });
    };
  
    return (
      <TouchableOpacity style={styles.categoryItem} onPress={handlePress}>
        <Image style={styles.image} source={require('../../assets/sport.png')} />
        <Text style={styles.text}>{nameCategory}</Text>
      </TouchableOpacity>
    );
  };
  

export default Category;

const styles = StyleSheet.create({

    categoryItem: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    image: {

    },
    text: {
        position: 'absolute',
        bottom: 14,
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
        paddingHorizontal: 10,
    },
})