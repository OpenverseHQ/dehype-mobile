import api from "../api/registerAccountApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, View , Button} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";

export default function TestapiScreen() {
  //const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState("");

  const handleGetAccess = async () => {
    const requestBody = {
      walletAddress: "12341",
      // walletAddress: "laskdflaskjva234jhas",
    };
    const response = await api.post("/auth/login", requestBody, {
      isPublic: true, // Attach isPublic directly
    } as any);

    console.log(response.data);
    const { access_token, refresh_token } = response.data;
    await AsyncStorage.setItem("accessToken", access_token);
    await AsyncStorage.setItem("refreshToken", refresh_token);
  };

  const handleGetInfo = async () => {
    const userId = "12341";

    const response = await api.get(`/users/${userId}`);
    // const response = await api.get(`/auth/admin`);
    console.log(response.data);
  };

  //handle update
  const handlePostInfo = async () => {
    const requestBody = {
      username: "van dat 5",
    };
    const reponse = await api.patch(`/users`, requestBody);
    console.log(reponse.data);
  };

//   const handleUploadImage = async () => {
//     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync() ;
  
//     if (permissionResult.granted === false) {
//       alert("Permission to access camera roll is required!");
//       return;
//     }
  
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });
  
//     if (!result.canceled) {
//       const imageUri = result.assets[0].uri;
//       setSelectedImage(imageUri);
//       await uploadImage(imageUri); // Thêm await để đảm bảo hoàn thành upload
//     } else {
//       alert("No image selected."); // Thông báo nếu không có hình ảnh nào được chọn
//     }
//   };
  
//   const uploadImage = async (uri: string) => {
//     const formData = new FormData();
//     const filename = uri.split("/").pop();
//     const type = filename ? `image/${filename.split(".").pop()}` : 'image'; // Kiểm tra filename
  
//     formData.append("file", { uri, name: filename, type } as any);
  
//     try {
//       const response = await api.post("/users/upload", formData);
//       console.log(response.data);
//       alert("Image uploaded successfully!"); // Thông báo thành công
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || "Unknown error occurred.";
//       console.error("Upload error:", errorMessage);
//       alert(`Upload failed: ${errorMessage}`); // Thông báo lỗi trên giao diện
//     }
//   };
  



  const createBlog = async (uri: string) => {
    const formData = new FormData();
    const filename = uri.split("/").pop();
    const type = `image/${filename?.split(".").pop()}`;
    const blogImages = ["anh1", "anh2"];

    formData.append("file", { uri, name: filename, type } as any);
    formData.append("title", "from mobile");
    formData.append("content", "content from mobile");
    blogImages.forEach((blogImage) => {
      formData.append("blogImages[]", blogImage);
    });
    // try {
    const response = await api.post("/blogs", formData);
    console.log(response.data);
    // } catch (error: any) {
    //   const errorMessage =
    //     error.response?.data?.message || "Unknown error occurred.";
    //   console.error("Upload error:", errorMessage);
    // }
  };

//   useEffect(() => {
//     navigation.setOptions({ headerShown: false });
//   }, [navigation]);
  return (
    <View >
      <Text>HELLO WORLD!!!</Text>
      <StatusBar style="auto" /> 
      <Button title="1234" />
        <Button
        title={"click here to get access and refresh token"}
        onPress={handleGetAccess}
        />
      <Button title={"click here to request"} onPress={handlePostInfo}/>
      {/* <Button title={"Select Image"} onPress={handleUploadImage} /> */}
    </View>
  );
}
