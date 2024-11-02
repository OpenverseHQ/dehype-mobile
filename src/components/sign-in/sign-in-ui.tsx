import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol";
import { useState, useCallback } from "react";
import { Button } from "react-native-paper";
import { alertAndLog } from "../../utils/alertAndLog";
import { useAuthorization } from "../../utils/useAuthorization";
import { useMobileWallet } from "../../utils/useMobileWallet";

export function ConnectButton() {
  const { authorizeSession } = useAuthorization();
  const { connect } = useMobileWallet();
  const [authorizationInProgress, setAuthorizationInProgress] = useState(false);
  const handleConnectPress = useCallback(async () => {
    try {
      if (authorizationInProgress) {
        return;
      }
      setAuthorizationInProgress(true);
      await connect();
    } catch (err: any) {
      alertAndLog(
        "Error during connect",
        err instanceof Error ? err.message : err
      );
    } finally {
      setAuthorizationInProgress(false);
    }
  }, [authorizationInProgress, authorizeSession]);
  return (
    <Button
      mode="contained"
      disabled={authorizationInProgress}
      onPress={handleConnectPress}
      style={{ flex: 1 }}
    >
      Connect
    </Button>
  );
}

export function SignInButton() {
  const { authorizeSession } = useAuthorization();
  const { signIn } = useMobileWallet();
  const [signInInProgress, setSignInInProgress] = useState(false);
  const handleConnectPress = useCallback(async () => {
    try {
      if (signInInProgress) {
        return;
      }
      setSignInInProgress(true);
      await signIn({
        domain: "yourdomain.com",
        statement: "Sign into Expo Template App",
        uri: "https://yourdomain.com",
      });
    } catch (err: any) {
      alertAndLog(
        "Error during sign in",
        err instanceof Error ? err.message : err
      );
    } finally {
      setSignInInProgress(false);
    }
  }, [signInInProgress, authorizeSession]);
  return (
    <Button
      mode="outlined"
      disabled={signInInProgress}
      onPress={handleConnectPress}
      style={{ marginLeft: 4, flex: 1 }}
    >
      Sign in
    </Button>
  );
}


import { StyleSheet , TouchableOpacity, Text , View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
export function MySignInButton() {
  const { authorizeSession } = useAuthorization();
  const { MysignIn } = useMobileWallet();
  const [signInInProgress, setSignInInProgress] = useState(false);
  const handleConnectPress = useCallback(async () => {
    try {
      if (signInInProgress) {
        return;
      }
      setSignInInProgress(true);
      await MysignIn({
        domain: "yourdomain.com",
        statement: "Sign into Expo Template App",
        uri: "https://yourdomain.com",
      });
    } catch (err: any) {
      alertAndLog(
        "Error during sign in",
        err instanceof Error ? err.message : err
      );
    } finally {
      setSignInInProgress(false);
    }
  }, [signInInProgress, authorizeSession]);
  return (
    <TouchableOpacity
    disabled={signInInProgress}
    onPress={handleConnectPress}
    style={styles.button} 
    >
    <Icon name="wallet" size={20} color="#fff" style={{marginRight:10}} />
    <Text style={styles.buttonText}>Connect Wallet</Text>
  </TouchableOpacity>
  );
}