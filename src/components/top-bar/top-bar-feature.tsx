import { StyleSheet } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { TopBarWalletButton, TopBarWalletMenu } from "./top-bar-ui";
import { useNavigation } from "@react-navigation/core";

// My import 
import { useState , useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthorization } from "../../utils/useAuthorization";


export function TopBar() {
  const navigation = useNavigation();
  const theme = useTheme();

  //My custom 
  const {selectedAccount} = useAuthorization() ;
  const [username, setUsername] = useState("");
  useEffect( () => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await AsyncStorage.getItem("userInfo") ;
        const USERNAME = userInfo ? JSON.parse(userInfo).username : selectedAccount.publicKey.toBase58();
        console.log("User info from device :", userInfo);
        console.log("Username got got got : ",USERNAME) ;
        setUsername(USERNAME)
        
        
      } catch (error) {
        console.error("Error get user info from device :", error);
      }
    };

    fetchUserInfo();
  },[selectedAccount]);
  //


  return (
    <Appbar.Header mode="small" style={styles.topBar}>
      <TopBarWalletMenu  
      username={username}
      setUsername={setUsername}
      />

      {/* <Appbar.Action
        icon="cog"
        mode="contained-tonal"
        onPress={() => {
          navigation.navigate("Settings");
        }}
      /> */}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  topBar: {
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor:'white'
  },
});
