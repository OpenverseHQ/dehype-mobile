import { Text, StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import CategoryCollection from '../components/CategoryCollection';
import Category from '../components/Category';
import CardItemTrend from '../components/CardItemTrend';
import CardItem from '../components/CardItem';
import api from '../api/registerAccountApi';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



const HomeScreen2 = ({ navigation, route }: any) => {

  const [marketData, setMarketData] = useState<any[]>([]);
  const [marketFavoriteData, setMarketFavoriteData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const fetchCategories = async () => {
    try {
      const response = await api.get('/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách category:', error);
    }
  };
  const fetchMarketFavorite = async () => {
    try {
      const response = await api.get('/search/details?fav=true');
      const markets = response.data;

      const marketsWithStats = await Promise.all(
        markets.map(async (market: any) => {
          const statsResponse = await api.get(`/markets/${market.publicKey}/stats`);
          return { ...market, marketStats: statsResponse.data };
        })
      );
      setMarketFavoriteData(marketsWithStats);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách favorite market:', error);
    }
  };

  useEffect(() => {
    fetchMarketFavorite();
  }, []);
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await api.get('/markets');
        const markets = response.data;

        const marketsWithStats = await Promise.all(
          markets.map(async (market: any) => {
            const statsResponse = await api.get(`/markets/${market.publicKey}/stats`);
            return { ...market, marketStats: statsResponse.data };
          })
        );

        setMarketData(marketsWithStats);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchMarketData();
  }, []);


  const filterByCategory = (category: string) => {
    return marketData.filter((market: any) => market.category === category);
  };

  const [selectedTab, setSelectedTab] = useState('All');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
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
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'All' && styles.activeTab]}
            onPress={() => setSelectedTab('All')}
          >
            <Text style={styles.tabText}>All</Text>
          </TouchableOpacity>
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
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'Favorite' && styles.activeTab]}
            onPress={() => setSelectedTab('Favorite')}
          >
            <Text style={styles.tabText}>Favorite</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filter} onPress={() => navigation.navigate('Filter')}>
            <Icon name='filter-variant' size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.trendingSection}>
          {selectedTab === 'All' ? (
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
                />
              ))}
            </ScrollView>
          ) : selectedTab === 'Trending' ? (
            <>
              <CategoryCollection nameCategory='Sports' />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {filterByCategory('Sports').map((market: any, index: number) => (
                  <CardItemTrend key={market.id} nameMarket={market.name} outcome={market.outcome} id={market.id} LikeCount={market.likes} />
                ))}
              </ScrollView>
              <CategoryCollection nameCategory='Technology' />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {filterByCategory('Technology').map((market: any, index: number) => (
                  <CardItemTrend key={market.id} nameMarket={market.name} outcome={market.outcome} id={market.id} LikeCount={market.likes} />
                ))}
              </ScrollView>
              <CategoryCollection nameCategory='Finance' />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {filterByCategory('Finance').map((market: any, index: number) => (
                  <CardItemTrend key={market.id} nameMarket={market.name} outcome={market.outcome} id={market.id} LikeCount={market.likes} />
                ))}
              </ScrollView>
              <CategoryCollection nameCategory='Politics' />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {filterByCategory('Politics').map((market: any, index: number) => (
                  <CardItemTrend key={market.id} nameMarket={market.name} outcome={market.outcome} id={market.id} LikeCount={market.likes} />
                ))}
              </ScrollView>
            </>
          ) : selectedTab === 'Newest' ? (
            <>
              <CategoryCollection nameCategory='Entertaiment' />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              </ScrollView>
              <CategoryCollection nameCategory='Finance' />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              </ScrollView>
              <CategoryCollection nameCategory='News' />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              </ScrollView>
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
    padding: 10,
    paddingBottom: 0,
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