import {
  transact,
  Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import { Account, useAuthorization } from "./useAuthorization";
import {
  PublicKey,
  Transaction,
  TransactionSignature,
  VersionedTransaction,
} from "@solana/web3.js";
import { useCallback, useMemo } from "react";
import { SignInPayload } from "@solana-mobile/mobile-wallet-adapter-protocol";
import { TextEncoder } from 'text-encoding';
import api from "../api/registerAccountApi";
import base58 from 'base-58';
import nacl, { randomBytes } from 'tweetnacl';
import useApi from "./useApi";
export function useMobileWallet() {
  const { authorizeSessionWithSignIn, authorizeSession, deauthorizeSession } =
    useAuthorization();

  const connect = useCallback(async (): Promise<Account> => {
    return await transact(async (wallet) => {
      return await authorizeSession(wallet);
    });
  }, [authorizeSession]);

  const signIn = useCallback(
    async (signInPayload: SignInPayload): Promise<Account> => {
      return await transact(async (wallet) => {
        return await authorizeSessionWithSignIn(wallet, signInPayload);
      });
    },
    [authorizeSession]
  );

  const disconnect = useCallback(async (): Promise<void> => {
    await transact(async (wallet: Web3MobileWallet) => {
      await deauthorizeSession(wallet);
    });
  }, [deauthorizeSession]);

  const signAndSendTransaction = useCallback(
    async (
      transaction: Transaction | VersionedTransaction
    ): Promise<TransactionSignature> => {
      return await transact(async (wallet: Web3MobileWallet) => {
        await authorizeSession(wallet);
        const signatures = await wallet.signAndSendTransactions({
          transactions: [transaction],
        });
        return signatures[0];
      });
    },
    [authorizeSession]
  );
  
  const signTransactions = useCallback(
    async <T extends Transaction | VersionedTransaction>(
      transactions: T | T[] // Chấp nhận cả đối tượng đơn lẻ hoặc mảng
    ): Promise<T[]> => {
      // Nếu chỉ có một giao dịch, chuyển thành mảng
      const transactionsArray = Array.isArray(transactions) ? transactions : [transactions];
      
      return await transact(async (wallet: Web3MobileWallet) => {
        await authorizeSession(wallet);
        const signedTransactions = await wallet.signTransactions({
          transactions: transactionsArray, // Truyền vào mảng giao dịch
        });
        return signedTransactions;
      });
    },
    [authorizeSession]
  );
  

  const signMessage = useCallback(
    async (message: Uint8Array): Promise<Uint8Array> => {
      return await transact(async (wallet) => {
        const authResult = await authorizeSession(wallet);
        const signedMessages = await wallet.signMessages({
          addresses: [authResult.address],
          payloads: [message],
        });
        return signedMessages[0];
      });
    },
    [authorizeSession]
  );

  const connectAnd = useCallback(
    async <T,>(
      cb: (wallet: Web3MobileWallet, authorizedAccount: Account) => Promise<T>
    ): Promise<T> => {
      return await transact(async (wallet: Web3MobileWallet) => {
        const authResult = await authorizeSession(wallet);
        return await cb(wallet, authResult);
      });
    },
    [authorizeSession]
  );
// My Sign in Function 
const MysignIn = useCallback(   
  // La Sign in + Sign Message , nhung ko the ghep 2 ham nay truc tiep voi nhau 
  // + API nua
  async (signInPayload: SignInPayload): Promise<Uint8Array> => {
    return await transact(async (wallet) => {
     const {AccountExist , AccountCreate, handleGetAccess } = useApi() ;


      const authResult = await authorizeSession(wallet);   // Connect wallet 

      console.log(api.defaults.baseURL)
      const nonce = await AccountExist(authResult.publicKey);// Goi API lan 1 

      var signature = new Uint8Array(10);
      console.log("nonce : ",nonce);
      if (nonce=="0") { // Tai khoan da dang ky
        await handleGetAccess(authResult.publicKey) ;
        return signature ;
      }
      // Confirm Sign in     OR sign up 
      var SIGN_IN_MSG="dehype"
      const msg = new TextEncoder().encode(`${SIGN_IN_MSG}${nonce}`);
      console.log("Wallet : ", authResult);
      console.log("Almost signature : ", msg);

      const signedMessages = await wallet.signMessages({
        addresses: [authResult.address],
        payloads: [msg],
      });
      signature = signedMessages[0] ;
      console.log("Signature : ", signature) ;

      const sig = base58.encode(signature as Uint8Array);
      console.log("sig : ", sig);
      // Neu co Nonce , goi API 2 de confirm va create acc
      await AccountCreate(authResult.publicKey,nonce,sig)
      await handleGetAccess(authResult.publicKey) ;
      return signature; // Trả về signature
    });
  },
  [authorizeSession]
);

  return useMemo(
    () => ({
      connect,
      connectAnd,
      signIn,
      disconnect,
      signAndSendTransaction,
      signMessage,
      signTransactions,
      MysignIn,
    }),
    [signAndSendTransaction, signMessage, signTransactions]
  );
}