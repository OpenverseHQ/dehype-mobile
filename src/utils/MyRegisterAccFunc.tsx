import { useAuthorization } from "./useAuthorization";
// Custom
import axios from "axios";
import api from "../api/registerAccountApi";
import nacl, { randomBytes } from 'tweetnacl';
import base58 from 'base-58';
import { useEffect } from "react";
import { TextEncoder } from 'text-encoding';
import AsyncStorage from "@react-native-async-storage/async-storage";
//
import { useMobileWallet } from "./useMobileWallet";

export async function MyRegisterAccFunc() {
  // Custom
  try {
    const AccountExist = async (PublicKey) => {
      const requestBody = {
        wallet: PublicKey,
        isLedger: false,
      };
      const response = await api.post("/auth", requestBody);

      console.log(response.data);
      if (response.data && typeof response.data === 'object' && 'nonce' in response.data) {
        console.log("Key 'nonce' exists in the response data:", response.data.nonce);
        const nonce = response.data.nonce; // Sử dụng nonce từ response
        const msg = new TextEncoder().encode(nonce);
        const {signMessage} = useMobileWallet() ;
        const signature = await signMessage(msg); // Chờ chữ ký
        const sig = base58.encode(signature as Uint8Array);
        console.log("sig : ", sig);

        const requestBody2 = {
          wallet: PublicKey,
          isLedger: false,
          signature: sig,
          nonce: nonce
        };

        const responseCreateAcc = await api.post("/auth/confirm", requestBody2); // Chờ response
        console.log("What we want to see : ", responseCreateAcc.data);
      }
    };

    var accessToken;
    var refreshToken;
    const handleGetAccess = async (PublicKey) => {
      const requestBody = {
        walletAddress: PublicKey,
      };
      const response = await api.post("/auth/login");

      console.log(response.data);
      const { access_token, refresh_token } = response.data;
      await AsyncStorage.setItem("accessToken", access_token);
      await AsyncStorage.setItem("refreshToken", refresh_token);
      accessToken = access_token;
      refreshToken = refresh_token;
    };


    var { selectedAccount, authorizeSession } = useAuthorization();
    if (selectedAccount && selectedAccount.publicKey) {
    var PublicKey = selectedAccount.publicKey;
    AccountExist(PublicKey); // Gọi hàm async
    }
    const fetchTokens = async (PublicKey) => {
    await handleGetAccess(PublicKey); // Chờ hàm async
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);
    };

  } catch (error) {
    console.error("Có lỗi xảy ra:", error);
  }
  // End custom
}
