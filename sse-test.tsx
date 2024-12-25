import {transact, Web3MobileWallet} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';

export const APP_IDENTITY = {
  name: 'React Native dApp',
  uri:  'https://yourdapp.com'
  icon: "favicon.ico", // Full path resolves to https://yourdapp.com/favicon.ico
};

const authorizationResult = await transact(async (wallet: Web3MobileWallet) => {
    const authorizationResult = await wallet.authorize({
        cluster: 'solana:devnet',
        identity: APP_IDENTITY,
    });

    /* After approval, signing requests are available in the session. */

    return authorizationResult;
});

console.log("Connected to: " + authorizationResult.accounts[0].address)