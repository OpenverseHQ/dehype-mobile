import { Button, IconButton, Menu, useTheme } from "react-native-paper";
import { Account, useAuthorization } from "../../utils/useAuthorization";
import { useMobileWallet } from "../../utils/useMobileWallet";
import { useNavigation } from "@react-navigation/native";
import { ellipsify } from "../../utils/ellipsify";
import { useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";
import { Linking } from "react-native";
import { useCluster } from "../cluster/cluster-data-access";

// My custom import 
import useApi from "../../utils/useApi";
import {  Dialog, Portal, TextInput } from "react-native-paper";
import { Alert , Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";




export function TopBarWalletButton({
  selectedAccount,
  openMenu,
  username,
}: {
  selectedAccount: Account | null;
  openMenu: () => void;
  username:string|null;
}) {
  const { connect } = useMobileWallet();



  return (
    <Button
      icon="wallet"
      mode="contained-tonal"
      style={{ alignSelf: "center" }}
      onPress={selectedAccount ? openMenu : connect}
    >
      <Text>
        {selectedAccount
          ? (
            <>
              {/* <Text>{ellipsify()}</Text> */}
              <Text>{ellipsify(username)}</Text>
            </>
          )
          : "Connect"}
      </Text>
    </Button>
  );
}

export function TopBarSettingsButton() {
  const navigation = useNavigation();
  return (
    <IconButton
      icon="cog"
      mode="contained-tonal"
      onPress={() => {
        navigation.navigate("Settings");
      }}
    />
  );
}

export function TopBarWalletMenu({username,setUsername}) {
  const { selectedAccount } = useAuthorization();
  const { getExplorerUrl } = useCluster();
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const { disconnect } = useMobileWallet();

  // My Custom 
  const [newUsername , setNewUsername] = useState(username) ;
  const [isDialogVisible, setDialogVisible] = useState(false);
  const {handleUpdateUserName} = useApi() ;

  console.log("new user name : ",newUsername) ;
  console.log("user name : ",username) ;
  //

  const copyAddressToClipboard = async () => {
    if (selectedAccount) {
      await Clipboard.setStringAsync(selectedAccount.publicKey.toBase58());
    }
    closeMenu();
  };

  const viewExplorer = () => {
    if (selectedAccount) {
      const explorerUrl = getExplorerUrl(
        `account/${selectedAccount.publicKey.toBase58()}`
      );
      Linking.openURL(explorerUrl);
    }
    closeMenu();
  };

  // MY CUSTOM FUNCTION
  const handleChangeUsername = async () => {
    if (!newUsername.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    try {
      const response = await handleUpdateUserName(newUsername);
      if(response===null) {
        throw new Error("Failed to update username , don't have response");
      }
      else if (response.status === 200) {
        Alert.alert("Success", "Username updated successfully");
        setUsername(newUsername)
      } else {
        throw new Error("Failed to update username , api failed");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      Alert.alert("Error", "Failed to update username");
    }

    setDialogVisible(false);
    closeMenu();
  };

  return (
    <>
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <TopBarWalletButton
          selectedAccount={selectedAccount}
          openMenu={openMenu}
          username={username}
        />
      }
    >
      <Menu.Item
        onPress={copyAddressToClipboard}
        title="Copy address"
        leadingIcon="content-copy"
      />
      <Menu.Item
        onPress={() => setDialogVisible(true)}
        title="Change User Name"
        leadingIcon="open-in-new"
      />
      <Menu.Item
        onPress={viewExplorer}
        title="View Explorer"
        leadingIcon="open-in-new"
      />
      <Menu.Item
        onPress={async () => {
          const {clearTokens} = useApi() ;
          clearTokens() ;
          await disconnect();
          closeMenu();
        }}
        title="Disconnect"
        leadingIcon="link-off"
      />
    </Menu>


          {/* Hộp thoại nhập tên mới */}
          <Portal>
        <Dialog visible={isDialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Change Username</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="New Username"
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Enter new username"
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleChangeUsername}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

    </>
  );
}
