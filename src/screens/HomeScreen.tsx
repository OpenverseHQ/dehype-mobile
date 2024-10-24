import { Text, StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Header from '../components/Header';
import CategoryCollection from '../components/CategoryCollection';
import Category from '../components/Category';
import CardItemTrend from '../components/CardItemTrend';
import CardItem from '../components/CardItem';


const HomeScreen = ({ navigation, route }: any) => {

  const marketData = require('../data.json');

  const filterByCategory = (category: string) => {
    return marketData.markets.filter((market: any) => market.category === category);
  };


  const [selectedTab, setSelectedTab] = useState('Trending');  // Sử dụng useState thay cho this.state

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'yellow' }}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View><Text style={styles.text_cate}>Category</Text></View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Category nameCategory='Sports' />
            <Category nameCategory='Technology'/>
            <Category nameCategory='Finance' />
            <Category nameCategory='News' />
            <Category nameCategory='Entertaiment' />
            <Category nameCategory='Politics' />
          </ScrollView>
        </View>

        <View style={styles.tabContainer}>
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
          {selectedTab === 'Trending' ? (
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
    </SafeAreaView >
  );
}


export default HomeScreen;


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
  sportCollection: {

  },
  headerSportCollection: {

  },

});
