import React from "react";
import api from "../api/registerAccountApi";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default () => { 
    //______________________ACCOUNT API______________________________
    // Ham API de find Nonce neu co
    const AccountExist = async (PublicKey) => {
        const requestBody = {
            wallet: PublicKey,
            isLedger: false,
        };
        const response = await api.post("/auth", requestBody);
        // console.log("Fully response1 : ",response);
        console.log("Response 1  : ", response.data);
    
        if (response.data && typeof response.data === 'object' && 'nonce' in response.data) {
            return response.data.nonce ;
        }
        return "0" ;
    };
    const AccountCreate = async (PublicKey,nonce,sig) => {
        console.log("Key 'nonce' exists in the response data:", nonce);

        const requestBody2 = {
          wallet: PublicKey,
          isLedger: false,
          signature: sig,
          nonce: nonce
        };
        console.log("what we sent : ", requestBody2);

        const responseCreateAcc = await api.post("/auth/confirm", requestBody2); // Chờ response
        console.log("What we want to see : ", responseCreateAcc);
        // Nếu Invalid signature thì làm gì ? , Có lẽ không bao giờ Invalid ?  Bởi Sign Msg để chống giả mạo qua API thooi 
      
    };


    const handleGetAccess = async (wallet) => {
        const requestBody = {
          walletAddress: wallet,
        };
        const response = await api.post("/auth/login", requestBody, {
          isPublic: true, // Attach isPublic directly
        } as any);
    
        console.log("Access token is got : ",response.data);
        const { access_token, refresh_token } = response.data;
        await AsyncStorage.setItem("accessToken", access_token);
        await AsyncStorage.setItem("refreshToken", refresh_token);
    };


    const clearTokens = async () => {
        try {
            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("refreshToken");
            console.log("Tokens removed successfully");
        } catch (error) {
            console.error("Error removing tokens:", error);
        }
    };


    const handleGetUserInfo = async (wallet) => {
        const userId = wallet ;
    
        const response = await api.get(`/users/${userId}`);
        // const response = await api.get(`/auth/admin`);
        if (response!=null) AsyncStorage.setItem("userInfo", JSON.stringify(response.data)) ;
        return response.data ;
      };

      const handleUpdateUserName = async (username) => {
        const requestBody = {
            username: username
        };
        const response = await api.patch("/users", requestBody);
        console.log(response.data);
        return response ;
      };

      //Upload avatar 
      const UploadAvatar = async (imageUri: string) => {
        try {
          // Tạo formData chứa ảnh
          const formData = new FormData();
          formData.append('file', {
            uri: imageUri,
            name: 'photo.jpg',
            type: 'image/jpeg',
          });

      
            // Gửi formData chứa ảnh 
            const uploadResponse = await api.post("/users/upload", formData,  {
                headers: {
                  'Content-Type': 'multipart/form-data', // Tùy chọn, FormData sẽ tự động thêm đúng header này
                },
              });
      
            console.log("Upload Response:", uploadResponse.data);
            return uploadResponse.data;
          }
        catch (error) {
          console.error("Upload error:", error);
        }
      };
    //______________________________________________________________________________

    //_________________________BLOG API_____________________________________________
    const GetBlogs = async (pageSize=5,current=1)=> {
        const response = await api.get(`/blogs?sort=-createdAt&pageSize=${pageSize}&current=${current}`);
        return response ;
    }


    
    return {AccountExist , AccountCreate , handleGetAccess , clearTokens , handleGetUserInfo , handleUpdateUserName , GetBlogs , UploadAvatar } ;
}