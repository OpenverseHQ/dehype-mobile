import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import useApi from '../utils/useApi';
import {useNavigation} from "@react-navigation/native"


const UploadImageScreen = ({ route }) => {
  const [imageUri, setImageUri] = useState(null);
  const { userAvatar , onUploadComplete } = route.params;
  const { UploadAvatar, handleGetUserInfo } = useApi();
  const navigation = useNavigation();

  useEffect(() => {
    if (userAvatar) {
      setImageUri(userAvatar);
    }
  }, [userAvatar]);

  const resizeImage = async (uri) => {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 550, height: 550 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      console.log('Resized image uri:', result.uri);
      return result;
    } catch (error) {
      console.error('Error resizing image:', error);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const resizedImage = await resizeImage(result.assets[0].uri);
      setImageUri(resizedImage.uri);
      // await UploadAvatar(resizedImage.uri);
      // onUploadComplete(resizedImage.uri) ;
    }
  };
  const uploadavatar = async () => {
      await UploadAvatar(imageUri);
      onUploadComplete(imageUri) ;
      navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Your Avatar</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Tap to select an image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Choose Image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={uploadavatar}>
        <Text style={styles.buttonText}>Update avatar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282C34',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 20,
  },
  imageContainer: {
    width: 300,
    height: 300,
    borderRadius: 150,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#4F535B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    color: '#AAA',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4c84e6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 3,
    margin:10,
  },
  buttonText: {
    color: '#282C34',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default UploadImageScreen;
