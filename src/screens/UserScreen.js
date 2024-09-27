import React from 'react';
import { View, Text, Image, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';  // Import icon

const UserPage = () => {
  return (
    <View style={styles.container}>
      {/* Header với logo và thanh tìm kiếm */}
      {/* <View style={styles.header}>
        <Image
          source={{ uri: 'https://example.com/dehype-logo.png' }}  // Thay bằng logo của bạn
          style={styles.logo}
        />
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder="Search Markets"
            style={styles.searchInput}
          />
        </View>
      </View> */}

      {/* Thông tin người dùng */}
      <View style={styles.userInfo}>
        <View style={styles.userInfo}>
        <Image
          source={{ uri: 'https://i.pinimg.com/564x/14/95/ab/1495ab1beb290e7816599607d9cf78b2.jpg' }}  // Thay bằng avatar người dùng
          style={styles.avatar}
        />
        <View>
          <Text style={styles.username}>ThangTran</Text>
          <Text style={styles.userId}>aE7PsbmYTG3ZyK</Text>
        </View>
        </View>
        <View style={styles.favorite}>
          <Text style={styles.favoriteText}>Favorite</Text>
          <Icon name="heart-circle-sharp" size={24} color="red" />
        </View>
      </View>

      {/* Thẻ thống kê */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Icon name="pulse-outline" size={30} color="#000" />
          <Text style={styles.cardTitle}>Position Value</Text>
          <Text style={styles.cardValue}>$0.00</Text>
        </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
    marginTop:40,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 5,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent:"flex-start" ,
  },
  userId: {
    fontSize: 12,
    color: '#888',
  },
  favorite: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'flex-end',

  },
  favoriteText: {
    fontSize: 16,
    marginRight: 5,
  },
  cardContainer: {
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
});

export default UserPage;
