import { useEffect, useState } from "react";
import { Web3MobileWallet } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
// import { useWallet } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import { Connection } from "@solana/web3.js"; // Kết nối Solana
import { useMobileWallet } from "../utils/useMobileWallet";
import { useConnection } from "../utils/ConnectionProvider";
import { AnchorWallet } from "../utils/useAnchorWallet";


import { AnchorProvider } from "@coral-xyz/anchor";
export default function useAnchorProvider() {
  const { connection } = useConnection();
  const wallet = useMobileWallet();

  return new AnchorProvider(connection, wallet as AnchorWallet, {
    commitment: "confirmed",
  });
}
