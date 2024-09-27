import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';  // Import icon

// Dữ liệu mẫu cho Notification (dữ liệu cho New và Read)
const newNotifications = [
  { id: '1', title: 'New Feature Launched!', description: 'Check out our latest feature.', date: 'Sep 18', read: false },
  { id: '2', title: 'Market Update', description: 'New market updates are available.', date: 'Sep 17', read: false },
];

const readNotifications = [
  { id: '1', title: 'Your profile has been updated', description: 'You can check your profile now.', date: 'Sep 15', read: true },
  { id: '2', title: 'Weekly Summary', description: 'Here is your weekly summary.', date: 'Sep 14', read: true },
];

const NotificationPage = () => {
  const [selectedTab, setSelectedTab] = useState('New');
  
  // Function để lấy dữ liệu dựa trên tab được chọn
  const getNotificationData = () => {
    return selectedTab === 'New' ? newNotifications : readNotifications;
  };

  return (
    <View style={styles.container}>
      {/* Tiêu đề trang */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
        <Icon name="notifications-outline" size={28} color="#4b7bec" />
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'New' && styles.activeTab]}
          onPress={() => setSelectedTab('New')}
        >
          <Text style={[styles.tabText, selectedTab === 'New' && styles.activeTabText]}>New</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Read' && styles.activeTab]}
          onPress={() => setSelectedTab('Read')}
        >
          <Text style={[styles.tabText, selectedTab === 'Read' && styles.activeTabText]}>Read</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách thông báo */}
      <FlatList
        data={getNotificationData()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationDescription}>{item.description}</Text>
            </View>
            <Text style={styles.notificationDate}>{item.date}</Text>
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
    justifyContent: 'center',
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
  notificationCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationContent: {
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
});

export default NotificationPage;
