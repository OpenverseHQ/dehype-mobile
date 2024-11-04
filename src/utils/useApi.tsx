import React from "react";
import api from "../api/registerAccountApi";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default () => { 
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
    
        console.log(response.data);
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

    return {AccountExist , AccountCreate , handleGetAccess , clearTokens } ;
}