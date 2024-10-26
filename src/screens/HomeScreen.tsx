import React from "react";
import { StyleSheet, View , Button , TouchableOpacity} from "react-native";
import { Text } from "react-native-paper";

import { Section } from "../Section";
import { useAuthorization } from "../utils/useAuthorization";
import { AccountDetailFeature } from "../components/account/account-detail-feature";
import { SignInFeature } from "../components/sign-in/sign-in-feature";
import { Ionicons } from '@expo/vector-icons';
import { TopBar } from "../components/top-bar/top-bar-feature"; 



export function HomeScreen({navigation}) {
  const { selectedAccount } = useAuthorization(); 

  return (
    <View style={styles.screenContainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={30} color="black" />
    </TouchableOpacity>
      
    <TopBar />
      <Text
        style={{ fontWeight: "bold", marginBottom: 12 }}
        variant="displaySmall"
      >
        Solana Mobile Expo Template cua hoang
      </Text>
      {selectedAccount ? (
        <AccountDetailFeature />
      ) : (
        <>
          <Section
            title="Solana SDKs"
            description="Configured with Solana SDKs like Mobile Wallet Adapter and web3.js."
          />
          <Section
            title="UI Kit and Navigation"
            description="Utilizes React Native Paper components and the React Native Navigation library."
          />
          <Section
            title="Get started!"
            description="Connect or Sign in with Solana (SIWS) to link your wallet account."
          />
          <SignInFeature />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    padding: 16,
    flex: 1,
  },
  buttonGroup: {
    flexDirection: "column",
    paddingVertical: 4,
  },
});





//
