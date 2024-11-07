import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Category: { category: string };
};

type CategoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Category'>;

interface MyProps {
  nameCategory: string;
}

const Category: React.FC<MyProps> = ({ nameCategory }) => {
  const navigation = useNavigation<CategoryScreenNavigationProp>();

  const handlePress = () => {
    navigation.navigate('Category', { category: nameCategory });
  };

  return (
    <TouchableOpacity style={styles.categoryItem} onPress={handlePress}>
            <Image source={require('../../assets/sport.png')} style={styles.image} />
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