import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MySignInButton, SignInButton } from '../components/sign-in/sign-in-ui';
import { TopBar } from '../components/top-bar/top-bar-feature';

const SolanaLoginScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://s5-recruiting.cdn.greenhouse.io/external_greenhouse_job_boards/logos/400/073/700/original/1200x1200.png?1712005160' }}
          style={styles.logo}
        />
        <Text style={styles.title}>Solana Wallet Login</Text>
      </View>
      
      <Text style={styles.description}>
        Connect to your Solana Wallet to continue
      </Text>

      <MySignInButton />
      {/* <SignInButton /> */}


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Đổi màu nền thành trắng
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', // Đổi màu chữ thành đen cho rõ ràng
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#555', // Màu sắc mô tả tối hơn để dễ đọc trên nền trắng
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SolanaLoginScreen;