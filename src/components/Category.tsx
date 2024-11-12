import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Category: {
    id: number,
    nameCate: string
  };
};

type CategoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Category'>;

interface MyProps {
  id: number,
  nameCategory: string;
  coverUrl: string
}

const Category: React.FC<MyProps> = ({ id, nameCategory, coverUrl }) => {
  const navigation = useNavigation<CategoryScreenNavigationProp>();

  const handlePress = () => {
    navigation.navigate('Category', { id: id, nameCate: nameCategory });
  };

  return (
    <TouchableOpacity style={styles.categoryItem} onPress={handlePress}>
      <Image source={{ uri: coverUrl }} style={styles.image} />
      <Text style={styles.text}>{nameCategory}</Text>
    </TouchableOpacity>
  );
};


export default Category;

const styles = StyleSheet.create({

  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 20, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 8,
    width: 210, 
    height: 125, 
    margin:10,
    marginRight:2
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    position: 'absolute', // Ảnh nền
  },
  text: {
    position: 'absolute',
    bottom: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 10,
    textShadowColor: 'black',  // Màu viền
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,

  },
})