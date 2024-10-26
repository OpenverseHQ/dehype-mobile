import { Text, StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Header from '../components/Header';
import CategoryCollection from '../components/CategoryCollection';
import Category from '../components/Category';
import CardItemTrend from '../components/CardItemTrend';
import CardItem from '../components/CardItem';

const cardData = [
  { nameMarket: 'salar hybrid', outcome: 'Yes', percent: 52, cate: '' },
  { nameMarket: 'salar hybrid', outcome: 'Yes', percent: 55, cate: '' },
  { nameMarket: 'salar hybrid', outcome: 'Yes', percent: 60, cate: '' },
  { nameMarket: 'salar hybrid', outcome: 'Yes', percent: 65, cate: '' },
  { nameMarket: 'salar hybrid', outcome: 'Yes', percent: 70, cate: '' },
  { nameMarket: 'salar hybrid', outcome: 'Yes', percent: 75, cate: '' }
];

const HomeScreen = ({ navigation }:any) => {
  const [selectedTab, setSelectedTab] = useState('Trending');  // Sử dụng useState thay cho this.state

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:'yellow' }}>
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
                {cardData.map((item, index) => (
                  <CardItemTrend key={index} nameMarket={item.nameMarket} outcome={item.outcome} percent={item.percent} LikeCount={90} />
                ))}
              </ScrollView>
              <CategoryCollection nameCategory='Technology' />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {cardData.map((item, index) => (
                  <CardItemTrend key={index} nameMarket={item.nameMarket} outcome={item.outcome} percent={item.percent} LikeCount={90} />
                ))}
              </ScrollView>
              <CategoryCollection nameCategory='Finance' />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {cardData.map((item, index) => (
                  <CardItemTrend key={index} nameMarket={item.nameMarket} outcome={item.outcome} percent={item.percent} LikeCount={90} />
                ))}
              </ScrollView>
              <CategoryCollection nameCategory='Politics' />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {cardData.map((item, index) => (
                  <CardItemTrend key={index} nameMarket={item.nameMarket} outcome={item.outcome} percent={item.percent} LikeCount={90} />
                ))}
              </ScrollView>
            </>
          ) : (
            <>
              <CategoryCollection nameCategory='Entertaiment' />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {cardData.map((item, index) => (
                  <CardItem key={index} nameMarket={item.nameMarket} outcome={item.outcome} percent={item.percent} cate='Entertaiment'/>
                ))}
              </ScrollView>
              <CategoryCollection nameCategory='Finance' />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {cardData.map((item, index) => (
                  <CardItem key={index} nameMarket={item.nameMarket} outcome={item.outcome} percent={item.percent} cate='Finance'/>
                ))}
              </ScrollView>
              <CategoryCollection nameCategory='News' />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {cardData.map((item, index) => (
                  <CardItem key={index} nameMarket={item.nameMarket} outcome={item.outcome} percent={item.percent} cate='News'/>
                ))}
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
