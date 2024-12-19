import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../api/registerAccountApi';
import { useNavigation, NavigationProp } from '@react-navigation/native';


type RootStackParamList = {
  InfoUser: { address: string };
};

const LeaderboardPage = () => {
  const [selectedTab, setSelectedTab] = useState('Volume');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();


  const fetchLeaderboardData = async (tab) => {
    setLoading(true);
    try {
      const endpoint =
        tab === 'Volume'
          ? '/statistics/most-betting'
          : '/statistics/most-betting';
      const response = await api.get(endpoint);
      setLeaderboardData(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatUsername = (username) => {
    return username.length > 15 ? `${username.slice(0, 15)}...` : username;
  };

  const formatMarketsWon = (marketsWon) => {
    return parseFloat(marketsWon).toFixed(3);
  };


  useEffect(() => {
    fetchLeaderboardData(selectedTab);
  }, [selectedTab]);

  return (
    <View style={styles.container}>
      {/* Tiêu đề trang */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Leaderboard</Text>
        <Icon name="trophy-outline" size={28} color="#ffd700" />
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Volume' && styles.activeTab]}
          onPress={() => setSelectedTab('Volume')}
        >
          <Icon
            name="bar-chart"
            style={[styles.tabText, selectedTab === 'Volume' && styles.activeTabText]}
          />
          <Text style={[styles.tabText, selectedTab === 'Volume' && styles.activeTabText]}>
            Volume
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Profit' && styles.activeTab]}
          onPress={() => setSelectedTab('Profit')}
        >
          <Icon
            name="logo-usd"
            style={[styles.tabText, selectedTab === 'Profit' && styles.activeTabText]}
          />
          <Text style={[styles.tabText, selectedTab === 'Profit' && styles.activeTabText]}>
            Profit
          </Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách leaderboard */}
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={leaderboardData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={styles.leaderboardCard} onPress={() => navigation.navigate('InfoUser', { address: item.walletAddress })}>
              {index < 3 && (
                <Icon name="ribbon" size={20} color="#FFD700" style={styles.ribbonIcon} />
              )}
              <View style={styles.noRank}><Text style={styles.rank}>{index + 1}</Text></View>
              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
              <View style={styles.userInfo}>
                <Text style={styles.username}>{formatUsername(item.username)}</Text>
                <Text style={styles.marketsWon}>Volume: ${formatMarketsWon(item.totalBetting)}</Text>
              </View>

            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tab: {
    padding: 10,
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  activeTab: {
    borderBottomColor: '#4b7bec',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
    marginRight: 5
  },
  activeTabText: {
    color: '#4b7bec',
    fontWeight: 'bold',
  },
  leaderboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  rank: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  noRank: {
    // backgroundColor: '#4b7bec',
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    width: 25,
    height: 25
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  marketsWon: {
    fontSize: 14,
    color: '#666',
  },
  loadingText: { textAlign: 'center', marginVertical: 20, fontSize: 16 },
  ribbonIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

});

export default LeaderboardPage;