import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Thay đổi theo bộ icon bạn chọn

import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import BlogsScreen from './src/screens/BlogScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import NotifiScreen from './src/screens/NotifiScreen';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'home' // Icon khi được chọn
              : 'home-outline'; // Icon khi không được chọn
          } else if (route.name === 'Settings') {
            iconName = focused
              ? 'settings'
              : 'settings-outline';
          } else if (route.name === 'Blogs') {
            iconName=focused
            ? 'book'
            : 'book-outline' ;
          } else if (route.name === 'Leaderboard') {
            iconName=focused
            ? 'stats-chart'
            : 'stats-chart-outline' ;
          } else if (route.name === 'Notification') {
            iconName=focused
            ? 'notifications'
            : 'notifications-outline' ;
          } else if (route.name === 'User') {
            iconName=focused
            ? 'person-circle'
            : 'person-circle-outline' ;
          }
 
          // Bạn có thể sử dụng bất kỳ icon nào từ thư viện vector-icons
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#4c84e6', // Màu icon khi được chọn
        inactiveTintColor: 'gray',  // Màu icon khi không được chọn
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Blogs" component={BlogsScreen} />
      <Tab.Screen name="Notification" component={NotifiScreen} />
      <Tab.Screen name="User" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
