import { Text, StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, FlatList, } from 'react-native';
import { RefreshControl } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import CategoryCollection from '../components/CategoryCollection';
import Category from '../components/Category';
import CardItemTrend from '../components/CardItemTrend';
import CardItem from '../components/CardItem';
import api from '../api/registerAccountApi';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthorization } from '../utils/useAuthorization';
import useApi from '../utils/useApi';
import AsyncStorage from "@react-native-async-storage/async-storage";





const HomeScreen2 = ({ navigation, route }: any) => {

  const [marketData, setMarketData] = useState<any[]>([]);
  const [marketFavoriteData, setMarketFavoriteData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [favourites, setFavourites] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Trending');
  const { selectedAccount } = useAuthorization();
  const { handleGetAccess } = useApi();
  const [isRefreshing, setIsRefreshing] = useState(false);


  const fetchCategories = async () => {
    try {
      const response = await api.get('/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách category:', error);
    }
  };

  const fetchMarketData = async () => {
    try {
      const marketResponse = await api.get('/markets');
      const allMarkets = marketResponse.data;
      const allMarketsWithStats = await Promise.all(
        allMarkets.map(async (market: any) => {
          const statsResponse = await api.get(`/markets/${market.publicKey}/stats`);
          return { ...market, marketStats: statsResponse.data };
        })
      );
      setMarketData(allMarketsWithStats);

      console.log('selectedAccount', selectedAccount);
      if (selectedAccount) {
        const auth = await handleGetAccess(selectedAccount.publicKey);
        const favoriteResponse = await api.get('/search/details?fav=true');
        const favoriteMarkets = favoriteResponse.data;
        const favoritePublicKeys = favoriteMarkets.map((item: any) => item.publicKey);
        setFavourites(favoritePublicKeys);

        const favoriteMarketsWithStats = allMarketsWithStats.filter((market: any) =>
          favoritePublicKeys.includes(market.publicKey)
        );
        setMarketFavoriteData(favoriteMarketsWithStats);
      } else {
        setMarketFavoriteData(allMarketsWithStats);
        setFavourites([]);
      }


    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMarketData();
  }, [navigation, selectedAccount]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchMarketData();
    setIsRefreshing(false);
  };

  const filterByCategory = (category: string) => {
    return marketData.filter((market: any) => market.category === category);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <View><Text style={styles.text_cate}>Category</Text></View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <Category key={category.id} id={category.id} nameCategory={category.name} coverUrl={category.coverUrl} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.tabContainer}>
          {/* Thay đổi thứ tự hiển thị các tab */}
          {/* <TouchableOpacity
            style={[styles.tab, selectedTab === 'All' && styles.activeTab]}
            onPress={() => setSelectedTab('All')}
          > */}
            {/* <Text style={styles.tabText}>All</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'Trending' && styles.activeTab]}
            onPress={() => setSelectedTab('Trending')}
          >
            <Text style={styles.tabText}>Trending collections</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'Newest' && styles.activeTab]}
            onPress={() => setSelectedTab('Newest')}
          >
            <Text style={styles.tabText}>Newest</Text>
          </TouchableOpacity>
          {selectedAccount && (
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'Favorite' && styles.activeTab]}
              onPress={() => setSelectedTab('Favorite')}
            >
              <Text style={styles.tabText}>Favorite</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.filter} onPress={() => navigation.navigate('Filter')}>
            <Icon name='filter-variant' size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.trendingSection}>
          {selectedTab === 'Trending' ? (
            <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
              {marketData.map((market: any) => (
                <CardItem
                  key={market.publicKey}
                  publicKey={market.publicKey}
                  title={market.title}
                  coverUrl={market.coverUrl}
                  participants={market.participants}
                  totalVolume={market.totalVolume}
                  marketStats={market.marketStats}
                  favourites={favourites}
                />
              ))}
            </ScrollView>
          ) : selectedTab === 'All' ? (
            <>

            </>
          ) : selectedTab === 'Newest' ? (
            <>

            </>
          ) : (
            <>
              <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
                {marketFavoriteData.map((market: any) => (
                  <CardItem
                    key={market.publicKey}
                    publicKey={market.publicKey}
                    title={market.title}
                    coverUrl={market.coverUrl}
                    participants={market.participants}
                    totalVolume={market.totalVolume}
                    marketStats={market.marketStats}
                    favourites={favourites}
                  />
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};



export default HomeScreen2;


const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: '#fff',
  },
  text_cate: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold'
  },
  trendingSection: {
    paddingLeft: 20,
    backgroundColor: '#fff'
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: '#000',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  filter: {
    position: 'absolute',
    right: 10,
    padding: 10,
  }

});