import AsyncStorage from "@react-native-async-storage/async-storage";
import { PublicKey, PublicKeyInitData } from "@solana/web3.js";
import {
  Account as AuthorizedAccount,
  AuthorizationResult,
  AuthorizeAPI,
  AuthToken,
  Base64EncodedAddress,
  DeauthorizeAPI,
  SignInPayloadWithRequiredFields,
  SignInPayload,
} from "@solana-mobile/mobile-wallet-adapter-protocol";
import { toUint8Array } from "js-base64";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

// Custom
import axios from "axios";
import api from "../api/registerAccountApi";
//

const CHAIN = "solana";
const CLUSTER = "devnet";
const CHAIN_IDENTIFIER = `${CHAIN}:${CLUSTER}`;

export type Account = Readonly<{
  address: Base64EncodedAddress;
  label?: string;
  publicKey: PublicKey;
}>;

type WalletAuthorization = Readonly<{
  accounts: Account[];
  authToken: AuthToken;
  selectedAccount: Account;
}>;

function getAccountFromAuthorizedAccount(account: AuthorizedAccount): Account {
  return {
    ...account,
    publicKey: getPublicKeyFromAddress(account.address),
  };
}

function getAuthorizationFromAuthorizationResult(
  authorizationResult: AuthorizationResult,
  previouslySelectedAccount?: Account
): WalletAuthorization {
  let selectedAccount: Account;
  if (
    // We have yet to select an account.
    previouslySelectedAccount == null ||
    // The previously selected account is no longer in the set of authorized addresses.
    !authorizationResult.accounts.some(
      ({ address }) => address === previouslySelectedAccount.address
    )
  ) {
    const firstAccount = authorizationResult.accounts[0];
    selectedAccount = getAccountFromAuthorizedAccount(firstAccount);
  } else {
    selectedAccount = previouslySelectedAccount;
  }
  return {
    accounts: authorizationResult.accounts.map(getAccountFromAuthorizedAccount),
    authToken: authorizationResult.auth_token,
    selectedAccount,
  };
}

function getPublicKeyFromAddress(address: Base64EncodedAddress): PublicKey {
  const publicKeyByteArray = toUint8Array(address);
  return new PublicKey(publicKeyByteArray);
}

function cacheReviver(key: string, value: any) {
  if (key === "publicKey") {
    return new PublicKey(value as PublicKeyInitData); // the PublicKeyInitData should match the actual data structure stored in AsyncStorage
  } else {
    return value;
  }
}

const AUTHORIZATION_STORAGE_KEY = "authorization-cache";

async function fetchAuthorization(): Promise<WalletAuthorization | null> {
  const cacheFetchResult = await AsyncStorage.getItem(
    AUTHORIZATION_STORAGE_KEY
  );

  if (!cacheFetchResult) {
    return null;
  }

  // Return prior authorization, if found.
  return JSON.parse(cacheFetchResult, cacheReviver);
}

async function persistAuthorization(
  auth: WalletAuthorization | null
): Promise<void> {
  await AsyncStorage.setItem(AUTHORIZATION_STORAGE_KEY, JSON.stringify(auth));
}

export const APP_IDENTITY = {
  name: "Solana Mobile Expo Template",
  uri: "https://fakedomain.com",
};

export function useAuthorization() {
  const queryClient = useQueryClient();
  const { data: authorization, isLoading } = useQuery({
    queryKey: ["wallet-authorization"],
    queryFn: () => fetchAuthorization(),
  });
  const { mutate: setAuthorization } = useMutation({
    mutationFn: persistAuthorization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet-authorization"] });
    },
  });

  const handleAuthorizationResult = useCallback(
    async (
      authorizationResult: AuthorizationResult
    ): Promise<WalletAuthorization> => {
      const nextAuthorization = getAuthorizationFromAuthorizationResult(
        authorizationResult,
        authorization?.selectedAccount
      );
      await setAuthorization(nextAuthorization);
      return nextAuthorization;
    },
    [authorization]
  );
  const authorizeSession = useCallback(
    async (wallet: AuthorizeAPI) => {
      const authorizationResult = await wallet.authorize({
        identity: APP_IDENTITY,
        chain: CHAIN_IDENTIFIER,
        auth_token: authorization?.authToken,
      });
      return (await handleAuthorizationResult(authorizationResult))
        .selectedAccount;
    },
    [authorization, handleAuthorizationResult]
  );
  const authorizeSessionWithSignIn = useCallback(
    async (wallet: AuthorizeAPI, signInPayload: SignInPayload) => {
      const authorizationResult = await wallet.authorize({
        identity: APP_IDENTITY,
        chain: CHAIN_IDENTIFIER,
        auth_token: authorization?.authToken,
        sign_in_payload: signInPayload,
      });
      return (await handleAuthorizationResult(authorizationResult))
        .selectedAccount;
    },
    [authorization, handleAuthorizationResult]
  );
  const deauthorizeSession = useCallback(
    async (wallet: DeauthorizeAPI) => {
      if (authorization?.authToken == null) {
        return;
      }
      await wallet.deauthorize({ auth_token: authorization.authToken });
      await setAuthorization(null);
    },
    [authorization]
  );

  // Custom
try{
  // const AccountExist = async (selectedAccount) => {
  //   const requestBody = {
  //     wallet: selectedAccount.publicKey,
  //     isLedger: false,
  //   };
  //   const response = await api.post("/auth", requestBody, {
  //     isPublic: true, // Attach isPublic directly
  //   } as any);

  //   console.log(response.data);
  //   if (response.data && typeof response.data === 'object' && 'nonce' in response.data) {
  //     console.log("Key 'nonce' exists in the response data:", response.data.nonce);
      
  //     const requestBody2 = {
  //       walletAddress: selectedAccount.publicKey,
  //       role:"user"
  //     }
  //     const responseCreateAcc = await api.post("/users" ,  requestBody2, {
  //       isPublic: true, // Attach isPublic directly
  //     } as any);
  //     console.log(responseCreateAcc.data);
  //   }
  // };
  // var accessToken ;
  // var refreshToken ;
  // const handleGetAccess = async (selectedAccount) => {
  //   const requestBody = {
  //     walletAddress: selectedAccount.publicKey,
  //   };
  //   const response = await api.post("/auth/login", requestBody, {
  //     isPublic: true, // Attach isPublic directly
  //   } as any);

  //   console.log(response.data);
  //   const { access_token, refresh_token } = response.data;
  //   await AsyncStorage.setItem("accessToken", access_token);
  //   await AsyncStorage.setItem("refreshToken", refresh_token);
  //   accessToken = access_token ;
  //   refreshToken = refresh_token ;
  // };
  // var selectedAccount= authorization?.selectedAccount ?? null ;
  // if (selectedAccount && selectedAccount.publicKey) {
  //   AccountExist(selectedAccount);
  // }
  // const fetchTokens = async (selectedAccount) => {
  //   await handleGetAccess(selectedAccount);
  //   console.log("Access Token:", accessToken);
  //   console.log("Refresh Token:", refreshToken);
  // };
}
catch(error) {

}
  // End custom


  return useMemo(
    () => ({
      accounts: authorization?.accounts ?? null,
      authorizeSession,
      authorizeSessionWithSignIn,
      deauthorizeSession,
      selectedAccount: authorization?.selectedAccount ?? null,
      isLoading,
    }),
    [authorization, authorizeSession, deauthorizeSession]
  );
}