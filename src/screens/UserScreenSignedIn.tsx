import React from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';  // Import icon
import Header from '../components/Header';
import { formatDistanceToNow, parseISO, parse } from 'date-fns';


// Handle User 
import { TopBar } from '../components/top-bar/top-bar-feature';
import { useAuthorization } from '../utils/useAuthorization';
import { SignInFeature } from '../components/sign-in/sign-in-feature';
import { Section } from "../Section";
import { AccountBalance, AccountButtonGroup, AccountTokens } from '../components/account/account-ui';
import { useGetBalance } from '../components/account/account-data-access';
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useNavigation } from "@react-navigation/native"
import { useGetSignatures } from '../components/account/account-data-access';

import useApi from '../utils/useApi';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';
import api from '../api/registerAccountApi';

function lamportsToSol(balance: number) {
  return Math.round((balance / LAMPORTS_PER_SOL) * 100000) / 100000;
}

type RootStackParamList = {
  DetailMarket: { publicKey: string };
};

const UserSignedInScreen = ({ address, navigation }) => {
  console.log('Địa chỉ người dùng:', address)
  var query = useGetBalance({ address });
  var Balance = query.data ? lamportsToSol(query.data).toString() + " SOL" : "...";
  const [quantity, setQuantity] = useState('0');
  const [betHistory, setBetHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { handleGetUserInfo } = useApi();
  const [userInfo, setUserInfo] = useState({
    "walletAddress": "AXvu8CZGasQ72sHVBD9cdYBqKvb7PR6VtHA55JYYXAPA",
    "username": "Hoang",
    "avatarUrl": "https://res.cloudinary.com/diwacy6yr/image/upload/v1728441530/User/default.png",
    "joinedMarkets": 0,
    "profitLoss": 0,
    "totalAmount": 0
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await handleGetUserInfo(address);
        setUserInfo(userInfo);
        // console.log("User info:", userInfo);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }
    , [address]);

  const handlePress = useCallback(() => {
    navigation.navigate("UploadImageScreen", {
      userAvatar: userInfo.avatarUrl,
      onUploadComplete: (newAvatarUrl) => {
        if (newAvatarUrl) {
          setUserInfo((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
        }
      }
    });
  }, [navigation, userInfo]);

  const fetchBetHistory = async () => {
    const id = userInfo.walletAddress;
    try {
      setLoading(true);
      const response = await api.get(`/users/${id}/history`)
      const result = response.data;
      setBetHistory(result);
    } catch (err) {
      setError("Failed to fetch bet history");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchBetHistory()
  // }, []);

  useEffect(() => {
    const bet = {
      "user": {
        "walletAddress": "12341431safa123",
        "username": "dehype"
      },
      "bets": [
        {
          "marketId": "D1aphTvapSBD7ELKeMghYFFfFRkcKzqgJadP13oRgF1z",
          "marketTitle": "Wil SoL become second BTC?",
          "marketCoverUrl": "https://res.cloudinary.com/diwacy6yr/image/upload/v1728441530/User/default.png",
          "totalBet": 1000,
          "tokens": 500,
          "answerKey": "Yes",
          "createTime": "2021-05-20T00:00:00.000Z"
        }
      ]
    }
    setBetHistory(bet);
    console.log(bet)
  }, []);


  useEffect(() => {
    const getQuantityFavorite = async () => {
      try {
        const response = await api.get('/search/details?fav=true');
        setQuantity(response.data.length);
      } catch (error) {
        console.error('Lỗi khi lấy quantity:', error);
      }
    };
    const unsubscribe = navigation.addListener('focus', getQuantityFavorite);
    return unsubscribe;
  }, [navigation]);

  if (!betHistory) {
    return <Text style={styles.noBetText}>Loading bet history...</Text>;
  }

  return (
    <ScrollView style={styles.container}>


      {/* Thông tin người dùng */}
      <View style={styles.userInfo}>
        <View style={styles.userInfo}>
          <TouchableOpacity
            onPress={() => handlePress()}
          >
            <Image
              // source={{ uri: 'https://i.pinimg.com/564x/14/95/ab/1495ab1beb290e7816599607d9cf78b2.jpg' }}  // Thay bằng avatar người dùng
              source={{ uri: userInfo.avatarUrl }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View>
            {/* <Text style={styles.username}>ThangTran</Text>
          <Text style={styles.userId}>aE7PsbmYTG3ZyK</Text> */}
            <TopBar />
          </View>
        </View>

        <TouchableOpacity style={styles.favorite} onPress={() => {
          navigation.navigate('Home', { screen: 'Favorite' });
        }}>
          <Icon name='heart-circle' size={40} color={'#777'} />
          <View style={styles.favoriteBadge}>
            <Text style={styles.favoriteBadgeText}>{quantity}</Text>
          </View>
        </TouchableOpacity>

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

      {/* Activity */}
      <View style={styles.profileFooter}>
        <View style={styles.titleFooter}>
          <Text style={styles.titleText}>Activity</Text>
        </View>

        {betHistory.bets.length === 0 ? (
          <Text style={styles.noBetText}>The user has not placed a bet yet!</Text>
        ) : (
          betHistory.bets.map((bet, index) => {
            const parsedTime = new Date(bet.createTime);
            const timeAgo = !isNaN(parsedTime.getTime()) ? formatDistanceToNow(parsedTime) : '';
            return (
              <View key={index} style={styles.contentFooter}>
                <TouchableOpacity style={styles.leftFooter} onPress={() => navigation.navigate('DetailMarket', { publicKey: bet.marketId })}>
                  <Image source={{ uri: bet.marketCoverUrl }} style={styles.avatar} />
                  <View>
                    <Text style={styles.titleMarket}>{bet.marketTitle}</Text>
                    <View style={styles.dateBet}>
                      <Text style={styles.result}>{`${bet.answerKey} - ${bet.tokens}$`}</Text>
                      <Text style={styles.date}>{timeAgo} ago</Text>
                    </View>
                  </View>

                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
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
    marginTop: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 5,
    marginTop: 5,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: "flex-start",
  },
  userId: {
    fontSize: 12,
    color: '#888',
  },
  favorite: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 15,
  },
  favoriteText: {
    fontSize: 16,
    marginRight: 5,
  },
  cardContainer: {
    padding: 10,
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
  favoriteBadge: {
    position: 'absolute',
    top: 25,
    right: 10,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileFooter: {
    paddingTop: 15,
    padding: 10,
    flexDirection: 'column',
  },
  titleFooter: {
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
    paddingBottom: 8,
  },
  titleText: {
    fontWeight: 'bold'
  },
  contentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#f2f2f2',
    backgroundColor: '#fff',
  },
  leftFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  result: {
    fontSize: 14,
    color: '#666',
  },
  titleMarket: {
    color: 'rgb(16, 104, 115)',
  },
  dateBet: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginTop: 5,
  },
  date: {
    color: '#666',
    fontSize: 12
  },
  noBetText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },
});

export default UserSignedInScreen;