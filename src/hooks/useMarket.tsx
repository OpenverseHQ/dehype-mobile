// import { BN, Idl, IdlAccounts, Program } from "@coral-xyz/anchor";
import useAnchorProvider from "./useAnchorProvider";
// import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, Keypair } from "@solana/web3.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SystemProgram } from "@solana/web3.js";
import marketIDL from "../idl/dehype.json";
import { Idl, Program, BN } from '@project-serum/anchor';
import { useMobileWallet } from "../utils/useMobileWallet";
import { useConnection } from "../utils/ConnectionProvider";
import { EventTarget, Event } from "event-target-shim";
import axiosInstance from "../lib/api";
import { ToastAndroid } from "react-native";
import Toast from "react-native-toast-message";
import { Linking } from 'react-native';
import { Text } from "react-native";


import {
    Answer,
    AnswerAccount,
    BettingAccount,
    Market,
    MarketAccount,
    MarketResponse,
    MarketStats,
} from "../types/index";
import {
    transact,
    Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import { Account, useAuthorization } from "../utils/useAuthorization";

// import {
//   Answer,
//   AnswerAccount,
//   BettingAccount,
//   Market,
//   MarketAccount,
//   MarketResponse,
//   MarketStats,
// } from "src/types/index";
import { ComputeBudgetProgram, SendTransactionError } from "@solana/web3.js";
import axios from "axios";
import { View } from "react-native";
// import { getExplorerUrl } from "@/lib/util";
// import axiosInstance from "@/lib/api";
export function useMarketProgram() {
    const provider = useAnchorProvider();
    const { selectedAccount } = useAuthorization();

    // const { sendTransaction, signTransaction } = useWallet();
    const { signTransactions } = useMobileWallet();
    const publicKey = selectedAccount.publicKey

    const { connection } = useConnection();
    const program = new Program(
        marketIDL as Idl,
        "9FXu3CrZNKgJPnJNkR9K2R5TK6vF1bwHrxcZwGprG5gT",
        provider,
    );
    const queryClient = useQueryClient();
    const createMarket = useMutation({
        mutationKey: ["createMarket"],
        mutationFn: async ({
            title,
            description,
            coverUrl,
            answers,
            creatorFeePercentage,
            serviceFeePercentage,
        }: {
            title: string;
            description: string;
            coverUrl: string;
            answers: string[];
            creatorFeePercentage: BN; // u64
            serviceFeePercentage: BN; // u64
        }) => {
            const marketKey = new BN(Math.floor(Math.random() * 10000));
            if (!publicKey) throw new Error("Wallet not connected");
            const [marketPDA] = PublicKey.findProgramAddressSync(
                [Buffer.from("market"), marketKey.toArrayLike(Buffer, "le", 8)],
                program.programId,
            );

            const [answerPDA] = PublicKey.findProgramAddressSync(
                [Buffer.from("answer"), marketKey.toArrayLike(Buffer, "le", 8)],
                program.programId,
            );

            const [vaultPDA] = PublicKey.findProgramAddressSync(
                [Buffer.from("market_vault"), marketKey.toArrayLike(Buffer, "le", 8)],
                program.programId,
            );

            // Create a transaction to increase compute units
            // Add the createMarket instruction to the transaction
            const transaction = await program.methods
                .createMarket(
                    marketKey,
                    title,
                    description,
                    coverUrl,
                    answers,
                    ["WIN", "LOSE"],
                    [coverUrl, coverUrl],
                    creatorFeePercentage,
                )
                .accounts({
                    creator: publicKey,
                    marketAccount: marketPDA,
                    answerAccount: answerPDA,
                    vaultAccount: vaultPDA,
                    systemProgram: SystemProgram.programId,
                })
                .transaction(); // Use `instruction()` to get the instruction instead of transaction

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            // Sign the transaction with the wallet
            if (!signTransactions) {
                throw new Error(
                    "Wallet not connected or signTransaction method is not available.",
                );
            }

            try {
                // Gọi hàm signTransactions và nhận giao dịch đã ký
                const signedTransaction = await signTransactions(transaction);

                // Kiểm tra nếu signedTransaction là mảng hoặc đối tượng đơn lẻ
                const transactionToSerialize = Array.isArray(signedTransaction)
                    ? signedTransaction[0]  // Nếu là mảng, lấy phần tử đầu tiên
                    : signedTransaction;  // Nếu là đối tượng, sử dụng ngay

                // Kiểm tra lại loại của đối tượng để đảm bảo là Transaction trước khi gọi .serialize()
                if (!transactionToSerialize || !(transactionToSerialize instanceof Transaction)) {
                    throw new Error("Expected a Transaction object.");
                }

                // Serialize giao dịch đã ký
                const serializedTransaction = transactionToSerialize.serialize();

                // Gửi giao dịch đã ký
                const signature = await connection.sendRawTransaction(serializedTransaction);
                await connection.confirmTransaction(signature, "confirmed");

                console.log("Transaction Signature:", signature);
                return signature;
            } catch (error) {
                if (error instanceof SendTransactionError) {
                    // Nếu là lỗi SendTransactionError, lấy logs
                    console.error("Transaction logs:", await error.getLogs(connection));
                }

                throw error;
            }

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getMarketAccounts"] });
        },
    });

    const resolveMarket = useMutation({
        mutationKey: ["resolveMarket"],
        mutationFn: async ({
            market,
            winningOutcome,
        }: {
            market: PublicKey;
            winningOutcome: string;
        }) => {
            if (!publicKey) throw new Error("Wallet not connected");

            // Construct the transaction
            const transaction = await program.methods
                .resolveMarket(winningOutcome)
                .accounts({
                    market,
                    user: publicKey,
                })
                .transaction();

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            // Sign the transaction with the user's wallet
            if (!signTransactions) {
                throw new Error(
                    "Wallet not connected or signTransaction method is not available.",
                );
            }

            const signedTransaction = await signTransactions(transaction);

            if (!signedTransaction) {
                throw new Error("Failed to sign the transaction with the wallet.");
            }

            try {
                // Gọi hàm signTransactions và nhận giao dịch đã ký
                const signedTransaction = await signTransactions(transaction);

                // Kiểm tra nếu signedTransaction là mảng hoặc đối tượng đơn lẻ
                const transactionToSerialize = Array.isArray(signedTransaction)
                    ? signedTransaction[0]  // Nếu là mảng, lấy phần tử đầu tiên
                    : signedTransaction;  // Nếu là đối tượng, sử dụng ngay

                // Kiểm tra lại loại của đối tượng để đảm bảo là Transaction trước khi gọi .serialize()
                if (!transactionToSerialize || !(transactionToSerialize instanceof Transaction)) {
                    throw new Error("Expected a Transaction object.");
                }

                // Serialize giao dịch đã ký
                const serializedTransaction = transactionToSerialize.serialize();

                // Gửi giao dịch đã ký
                const signature = await connection.sendRawTransaction(serializedTransaction);
                await connection.confirmTransaction(signature, "confirmed");

                console.log("Transaction Signature:", signature);
                return signature;
            } catch (error) {
                if (error instanceof SendTransactionError) {
                    // Nếu là lỗi SendTransactionError, lấy logs
                    console.error("Transaction logs:", await error.getLogs(connection));
                }

                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getMarketAccounts"] });
        },
    });

    const answerPDA = (marketKey: BN): PublicKey => {
        return PublicKey.findProgramAddressSync(
            [Buffer.from("answer"), marketKey.toArrayLike(Buffer, "le", 8)],
            program.programId,
        )[0];
    };

    const getExplorerUrl = (
        signature: string,
        cluster: "devnet" | "testnet" | "mainnet-beta" = "devnet"
    ): string => {
        const clusterUrl = cluster === "mainnet-beta" ? "" : `?cluster=${cluster}`;
        return `https://solscan.io/tx/${signature}${clusterUrl}`;
    };

    const placeBet = async ({
        voter,
        marketKey,
        betAmount,
        answerKey,
    }: {
        voter: PublicKey;
        marketKey: BN;
        betAmount: BN;
        answerKey: BN;
    }): Promise<string> => {
        console.log("placeBet called:", {
            voter: voter.toString(),
            marketKey: marketKey.toString(),
            answerKey: answerKey.toString(),
            timestamp: new Date().toISOString(),
        });
        if (!publicKey) throw new Error("Wallet not connected");
        try {
            // Create the transaction to place the bet
            console.log("here");
            console.log({
                publicKey,
                marketAccount: PublicKey.findProgramAddressSync(
                    [Buffer.from("market"), marketKey.toArrayLike(Buffer, "le", 8)],
                    program.programId,
                )[0],
                vaultAccount: PublicKey.findProgramAddressSync(
                    [Buffer.from("market_vault"), marketKey.toArrayLike(Buffer, "le", 8)],
                    program.programId,
                )[0],
                answerAccount: PublicKey.findProgramAddressSync(
                    [Buffer.from("answer"), marketKey.toArrayLike(Buffer, "le", 8)],
                    program.programId,
                )[0],
                betAccount: PublicKey.findProgramAddressSync(
                    [
                        Buffer.from("betting"),
                        voter.toBuffer(),
                        marketKey.toArrayLike(Buffer, "le", 8),
                        new BN(answerKey).toArrayLike(Buffer, "le", 8),
                    ],
                    program.programId,
                )[0],
            });

            const transaction = await program.methods
                .bet(answerKey, betAmount)
                .accounts({
                    voter: voter,
                    marketAccount: PublicKey.findProgramAddressSync(
                        [Buffer.from("market"), marketKey.toArrayLike(Buffer, "le", 8)],
                        program.programId,
                    )[0],
                    vaultAccount: PublicKey.findProgramAddressSync(
                        [
                            Buffer.from("market_vault"),
                            marketKey.toArrayLike(Buffer, "le", 8),
                        ],
                        program.programId,
                    )[0],
                    answerAccount: PublicKey.findProgramAddressSync(
                        [Buffer.from("answer"), marketKey.toArrayLike(Buffer, "le", 8)],
                        program.programId,
                    )[0],
                    betAccount: PublicKey.findProgramAddressSync(
                        [
                            Buffer.from("betting"),
                            voter.toBuffer(),
                            marketKey.toArrayLike(Buffer, "le", 8),
                            new BN(answerKey).toArrayLike(Buffer, "le", 8),
                        ],
                        program.programId,
                    )[0],
                    systemProgram: SystemProgram.programId,
                })
                .transaction();

            console.log("txn");

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            // Sign the transaction
            if (!signTransactions) {
                throw new Error(
                    "Wallet not connected or signTransaction method is not available.",
                );
            }

            const signedTransaction = await signTransactions(transaction);

            if (!signedTransaction) {
                throw new Error("Failed to sign the transaction with the wallet.");
            }

            try {
                // Serialize the signed transaction
                const serializedTransaction = signedTransaction.serialize();

                // Send the raw transaction to the Solana network
                const signature = await connection.sendRawTransaction(
                    serializedTransaction,
                );

                // Confirm the transaction
                await connection.confirmTransaction(signature, "confirmed");

                console.log("Transaction Signature:", signature);
                return signature; // You might want to return the signature or the transaction
            } catch (error) {
                if (error instanceof SendTransactionError) {
                    // If the error is a SendTransactionError, get logs
                    console.error("Transaction logs:", await error.getLogs(connection));
                }

                console.error("Transaction Error:", error);
                throw error;
            }
        } catch (err) {
            console.error("Error in placeBet: ", err);
            throw err; // Propagate the error to the calling function
        }
    };

    const useMutateBet = useMutation({
        mutationKey: ["placeBet"],
        mutationFn: placeBet,

        onSuccess: (signature) => {
            console.log("onsuccess", signature);
            const explorerUrl = getExplorerUrl(signature, "devnet");
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Your bet has been placed successfully! Tap to view details.',
                visibilityTime: 10000,
                onPress: () => {
                    Linking.openURL(explorerUrl).catch(err =>
                        console.error("Failed to open URL:", err)
                    );
                },
            });

            queryClient.invalidateQueries({ queryKey: ["getMarketAccounts"] });
        },

        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'An error occurred while placing your bet.',
            });
        }
    });


    return {
        program,
        createMarket,
        resolveMarket,
        useGetMarketQuery,
        useMarketStats,
        answerPDA,
        mutateBet: useMutateBet.mutate,
    };
}

async function getMarketStats(marketKey: PublicKey) {
    try {
        const response = await axios.get<MarketStats>(
            `https://dehype.api.openverse.tech/api/v1/markets/${marketKey}/stats`,
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching markets:", error);
        throw error;
    }
}

export const useMarketStats = (marketKey: PublicKey | undefined) => {
    return useQuery<MarketStats>(
        ["marketStats"], // Query key, using optional chaining for marketKey
        () => getMarketStats(marketKey!), // Non-null assertion since it is guaranteed to be valid when the query runs
        {
            enabled: !!marketKey, // Query only runs if marketKey is valid
        },
    );
};

export const getMarkets = async (): Promise<Market[]> => {
    try {
        const response = await axios.get<Market[]>("https://dehype.api.openverse.tech/api/v1/markets");
        return response.data;
    } catch (error) {
        console.error("Error fetching markets:", error);
        throw error;
    }
};

// Using useQuery for getMarkets
const useGetMarketsQuery = () =>
    useQuery({
        queryKey: ["getMarkets"],
        queryFn: getMarkets,
    });

// Original getMarket function
const getMarket = async (marketPublicKey: PublicKey): Promise<Market> => {
    try {
        const response = await axios.get<Market>(
            `https://dehype.api.openverse.tech/api/v1/markets/${marketPublicKey.toString()}`,
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching market:", error);
        throw error;
    }
};

// Using useQuery for getMarket
const useGetMarketQuery = (marketPublicKey?: PublicKey | string) => {
    if (!marketPublicKey) {
        return {
            data: undefined,
            isLoading: false,
            error: null,
        };
    }
    // Convert string to PublicKey if necessary
    const publicKey =
        typeof marketPublicKey === "string"
            ? new PublicKey(marketPublicKey)
            : marketPublicKey;

    return useQuery({
        queryKey: ["getMarket"],
        queryFn: () => getMarket(publicKey),
        enabled: !!publicKey, // Only run the query if the publicKey is available
    });
};

// In useMarketsStats.ts
export const useMarketsStats = (marketIds: string[]) => {
    return useQuery<MarketStats[]>(
        ["marketsStats"],
        () => fetchMarketsStats(marketIds),
        {
            enabled: marketIds.length > 0,
            staleTime: 60000,
            refetchInterval: 60000,
        },
    );
};

const fetchMarketsStats = async (
    marketIds: string[],
): Promise<MarketStats[]> => {
    const response = await axios.post("https://dehype.api.openverse.tech/api/v1/markets/stats", { marketIds });

    return response.data;
};