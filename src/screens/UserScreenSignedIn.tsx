import React from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';  // Import icon
import Header from '../components/Header';

// Handle User 
import { TopBar } from '../components/top-bar/top-bar-feature';
import { useAuthorization } from '../utils/useAuthorization';
import { SignInFeature } from '../components/sign-in/sign-in-feature';
import { Section } from "../Section";
import { AccountBalance , AccountButtonGroup , AccountTokens } from '../components/account/account-ui';
import { useGetBalance } from '../components/account/account-data-access';
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {useNavigation} from "@react-navigation/native"
import { useGetSignatures } from '../components/account/account-data-access';

function lamportsToSol(balance: number) {
    return Math.round((balance / LAMPORTS_PER_SOL) * 100000) / 100000;
}

const UserSignedInScreen = ({address , navigation}) => {
  var query =  useGetBalance({address}) ;
  var Balance = query.data ? lamportsToSol(query.data).toString() + " SOL": "..." ;

  //const navigation = useNavigation() ;
  return (
    <View style={styles.container}>


      {/* Thông tin người dùng */}
      <View style={styles.userInfo}>
        <View style={styles.userInfo}>
        <Image
          source={{ uri: 'https://i.pinimg.com/564x/14/95/ab/1495ab1beb290e7816599607d9cf78b2.jpg' }}  // Thay bằng avatar người dùng
          style={styles.avatar}
        />
        <View>
          {/* <Text style={styles.username}>ThangTran</Text>
          <Text style={styles.userId}>aE7PsbmYTG3ZyK</Text> */}
          <TopBar/>
        </View>
        </View>
        <View style={styles.favorite}>
          <Text style={styles.favoriteText}>Favorite</Text>
          <Icon name="heart-circle-sharp" size={24} color="red" />
        </View>
      </View>

      {/* Thẻ thống kê */}
      <View style={styles.cardContainer}>
        <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('SolonaScreen')}
        >
          <Icon name="pulse-outline" size={30} color="#000" />
          <Text style={styles.cardTitle}>Position Value</Text>
          <Text style={styles.cardValue}>{Balance}</Text>
        </TouchableOpacity>
        <View style={styles.card}>
          <Icon name="trending-down-outline" size={30} color="#000" />
          <Text style={styles.cardTitle}>Profit/loss</Text>
          <Text style={styles.cardValue}>$0.00</Text>
        </View>
        <View style={styles.card}>
          <Icon name="bar-chart-outline" size={30} color="#000" />
          <Text style={styles.cardTitle}>Volume traded</Text>
          <Text style={styles.cardValue}>$0.00</Text>
        </View>
        <View style={styles.card}>
          <Icon name="checkbox-outline" size={30} color="#000" />
          <Text style={styles.cardTitle}>Markets traded</Text>
          <Text style={styles.cardValue}>0</Text>
        </View>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 1,
    backgroundColor: '#fff',
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

export default UserSignedInScreen;