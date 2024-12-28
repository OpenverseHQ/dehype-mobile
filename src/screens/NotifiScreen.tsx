import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../api/registerAccountApi';
import { useAuthorization } from '../utils/useAuthorization';
import useApi from '../utils/useApi';
import { formatDistanceToNow, parseISO, parse } from 'date-fns';

// // Dữ liệu mẫu cho Notification (dữ liệu cho New và Read)
// const newNotifications = [
//   { id: '1', title: 'New Feature Launched!', description: 'Check out our latest feature.', date: 'Sep 18', read: false },
//   { id: '2', title: 'Market Update', description: 'New market updates are available.', date: 'Sep 17', read: false },
// ];

// const readNotifications = [
//   { id: '1', title: 'Your profile has been updated', description: 'You can check your profile now.', date: 'Sep 15', read: true },
//   { id: '2', title: 'Weekly Summary', description: 'Here is your weekly summary.', date: 'Sep 14', read: true },
// ];

const NotificationPage = () => {
  const [selectedTab, setSelectedTab] = useState('All');
  const [color, setColor] = useState('blue');
  const [notifi, setNotifi] = useState<any[]>([]);
  const { selectedAccount } = useAuthorization();
  const { handleGetAccess } = useApi();
  

  // Lấy danh sách thông báo
  const fetchNotification = async () => {
    try {
      if (selectedAccount) {
        const auth = await handleGetAccess(selectedAccount.publicKey);
        const response = await api.get('/notifications', { headers: { Authorization: `Bearer ${auth}` } });
        setNotifi(response.data);
      } else {
        ToastAndroid.show('Log in to see notifications', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thông báo:', error);
    }
  };

  // Đánh dấu thông báo đã đọc
  const markAsRead = async () => {
    try {
      const auth = await handleGetAccess(selectedAccount.publicKey);
      await api.patch(`/notifications`);
      setColor('#f9f9f9');
    } catch (error) {
      console.error('Lỗi khi đánh dấu thông báo đã đọc', error);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  // Lọc thông báo theo tab
  const filteredNotifi = selectedTab === 'All' ? notifi : notifi.filter((item) => !item.isRead);

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
          style={[styles.tab, selectedTab === 'All' && styles.activeTab]}
          onPress={() => setSelectedTab('All')}
        >
          <Text style={[styles.tabText, selectedTab === 'All' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Unread' && styles.activeTab]}
          onPress={() => setSelectedTab('Unread')}
        >
          <Text style={[styles.tabText, selectedTab === 'Unread' && styles.activeTabText]}>Unread</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách thông báo */}
      <FlatList
        data={filteredNotifi}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const parsedTime = new Date(item.createdAt);
          const timeAgo = !isNaN(parsedTime.getTime()) ? formatDistanceToNow(parsedTime) : '';
          return (
            <TouchableOpacity
              style={styles.notificationCard}
              onPress={() => markAsRead()}
            >
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{item.type}</Text>
                <Text style={styles.notificationDate}>{timeAgo} ago</Text>
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationDescription}>{item.content}</Text>
                <Text
                  style={{
                    fontSize: 20,
                    color: item.isRead ? '#f9f9f9' : color,
                  }}
                >
                  ●
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
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
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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