import React from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';  // Import icon
import Header from '../components/Header';

// Handle User 
import { TopBar } from '../components/top-bar/top-bar-feature';
import { useAuthorization } from '../utils/useAuthorization';
import { Section } from "../Section";
import UserSignedInScreen from './UserScreenSignedIn';
import SolanaLoginScreen from './SolanaLoginScreen';

const UserPage = ({navigation}) => {
  const { selectedAccount } = useAuthorization(); 
  // MyRegisterAccFunc() ;

  return (
    <View style={styles.container}>
      {selectedAccount==null ? 
      (<>
          {/* <TopBar />
          <Section
            title="Get started!"
            description="Connect or Sign in with Solana (SIWS) to link your wallet account."
          />
          <SignInFeature /> */}
          <SolanaLoginScreen />

        </>) : ( <View style={styles.container}>
          <UserSignedInScreen address={selectedAccount.publicKey} navigation={navigation} />
      </View>)}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 1,
    backgroundColor: '#fff',
    flex:1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '70%',
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop:10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 5,
    marginTop:5 ,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent:"flex-start" ,
  },
  userId: {
    fontSize: 12,
    color: '#888',
  },
  favorite: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'flex-end',

  },
  favoriteText: {
    fontSize: 16,
    marginRight: 5,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default UserPage;