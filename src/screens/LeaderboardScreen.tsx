import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';  // Import icon

// Dữ liệu mẫu cho Leaderboard (dữ liệu cho All, Month, Year)
const allData = [
  { id: '1', username: 'ThangTran', avatar: 'https://example.com/avatar1.jpg', marketsWon: 50 },
  { id: '2', username: 'DucAnh', avatar: 'https://example.com/avatar2.jpg', marketsWon: 45 },
  { id: '3', username: 'HongNhung', avatar: 'https://example.com/avatar3.jpg', marketsWon: 40 },
  { id: '4', username: 'AnhVu', avatar: 'https://example.com/avatar4.jpg', marketsWon: 35 },
  { id: '5', username: 'QuangNguyen', avatar: 'https://example.com/avatar5.jpg', marketsWon: 30 },
];

const monthlyData = [
  { id: '1', username: 'ThangTran', avatar: 'https://example.com/avatar1.jpg', marketsWon: 10 },
  { id: '2', username: 'DucAnh', avatar: 'https://example.com/avatar2.jpg', marketsWon: 9 },
  { id: '3', username: 'HongNhung', avatar: 'https://example.com/avatar3.jpg', marketsWon: 8 },
  { id: '4', username: 'AnhVu', avatar: 'https://example.com/avatar4.jpg', marketsWon: 7 },
  { id: '5', username: 'QuangNguyen', avatar: 'https://example.com/avatar5.jpg', marketsWon: 6 },
];

const yearlyData = [
  { id: '1', username: 'ThangTran', avatar: 'https://example.com/avatar1.jpg', marketsWon: 20 },
  { id: '2', username: 'DucAnh', avatar: 'https://example.com/avatar2.jpg', marketsWon: 18 },
  { id: '3', username: 'HongNhung', avatar: 'https://example.com/avatar3.jpg', marketsWon: 16 },
  { id: '4', username: 'AnhVu', avatar: 'https://example.com/avatar4.jpg', marketsWon: 14 },
  { id: '5', username: 'QuangNguyen', avatar: 'https://example.com/avatar5.jpg', marketsWon: 12 },
];

const LeaderboardPage = () => {
  const [selectedTab, setSelectedTab] = useState('All');
  
  // Function để lấy dữ liệu dựa trên tab được chọn
  const getLeaderboardData = () => {
    if (selectedTab === 'Month') {
      return monthlyData;
    } else if (selectedTab === 'Year') {
      return yearlyData;
    } else {
      return allData;
    }
  };

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
          style={[styles.tab, selectedTab === 'Month' && styles.activeTab]}
          onPress={() => setSelectedTab('Month')}
        >
          <Text style={[styles.tabText, selectedTab === 'Month' && styles.activeTabText]}>Month</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Year' && styles.activeTab]}
          onPress={() => setSelectedTab('Year')}
        >
          <Text style={[styles.tabText, selectedTab === 'Year' && styles.activeTabText]}>Year</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'All' && styles.activeTab]}
          onPress={() => setSelectedTab('All')}
        >
          <Text style={[styles.tabText, selectedTab === 'All' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách leaderboard */}
      <FlatList
        data={getLeaderboardData()}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.leaderboardCard}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Image
              source={{ uri: item.avatar }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.marketsWon}>Markets Won: {item.marketsWon}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
    paddingVertical: 20,
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
  },
  activeTab: {
    borderBottomColor: '#4b7bec',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
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
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
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
});

export default LeaderboardPage;