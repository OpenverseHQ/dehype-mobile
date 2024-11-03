import { Text, StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CategoryCollection from '../components/CategoryCollection';
import Category from '../components/Category';
import CardItemTrend from '../components/CardItemTrend';
import CardItem from '../components/CardItem';
import api from '../api/registerAccountApi';


const HomeScreen2 = ({ navigation, route }: any) => {

  const [marketData, setMarketData] = useState<any[]>([]); // Kiểm tra kiểu dữ liệu

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

  const [selectedTab, setSelectedTab] = useState('All');  // Đặt mặc định là "All"

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View><Text style={styles.text_cate}>Category</Text></View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Category nameCategory='Sports' />
            <Category nameCategory='Technology' />
            <Category nameCategory='Finance' />
            <Category nameCategory='News' />
            <Category nameCategory='Entertaiment' />
            <Category nameCategory='Politics' />
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
          ) : (
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

});