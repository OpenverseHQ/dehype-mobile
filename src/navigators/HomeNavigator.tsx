import { TopBar } from "../components/top-bar/top-bar-feature";
import { HomeScreen } from "../screens/HomeScreen";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";
import BlankScreen from "../screens/BlankScreen";


import React from 'react';
import { Button } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BlogsScreen from "../screens/BlogScreen";
import LeaderboardScreen from '../screens/LeaderboardScreen';
import NotifiScreen from "../screens/NotifiScreen"
import UserScreen from '../screens/UserScreen';
import HomeScreen2 from '../screens/HomeScreen2';
import CategoryScreen from "../screens/CategoryScreen";
import FilterScreen from "../screens/FilterScreen";
import FilterResultScreen from '../screens/FilterResultScreen';
import BlogDetailScreen from "../screens/BlogDetailScreen";
import TestapiScreen from "../screens/TestapiScreen";
import BlogsApiScreen from "../screens/BlogApiScreen";
import UserSignedInScreen from "../screens/UserScreenSignedIn";
import DetailMarketScreen from "../screens/DetailMarketScreen";
import SolanaLoginScreen from "../screens/SolanaLoginScreen";
import UploadImageScreen from "../screens/UploadImageScreen";
import ChartScreen from "../screens/ChartScreen";
import GeminiChatScreen from "../screens/GeminiChatScreen";

const Stack = createNativeStackNavigator();
const UserStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="UserScreen" component={UserScreen} 
    options={{ headerShown: false }}
    />
    <Stack.Screen name="UserSignedInScreen" component ={UserSignedInScreen} 
      options={({ navigation }) => ({
        headerShown: false
      })}
    />
    <Stack.Screen name="SolonaScreen" component={HomeScreen} 
      options={({ navigation }) => ({
        headerShown: false
      })}
    />
        <Stack.Screen name="UploadImageScreen" component={UploadImageScreen} 
      options={({ navigation }) => ({
        headerShown: false
      })}
    />
  </Stack.Navigator>
);

const Stack2 = createNativeStackNavigator();
const BlogStack = () => (
  <Stack2.Navigator>
    <Stack2.Screen name="BlogsScreen" component={BlogsApiScreen} 
    options={{ headerShown: false }}
    />
    <Stack2.Screen name="BlogDetailScreen" component={BlogDetailScreen} 
      options={({ navigation }) => ({
        headerShown: false
      })}
    />
  </Stack2.Navigator>
);


const Tab2 = createBottomTabNavigator();

function MyTabs() {
  const theme = useTheme();
  return (
    <Tab2.Navigator
      screenOptions={({ route }) => ({
        // header: () => <TopBar />,
        headerShown:false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused
              ? 'settings'
              : 'settings-outline';
          } else if (route.name === 'Blogs') {
            iconName = focused
              ? 'book'
              : 'book-outline';
          } else if (route.name === 'Leaderboard') {
            iconName = focused
              ? 'stats-chart'
              : 'stats-chart-outline';
          } else if (route.name === 'Notification') {
            iconName = focused
              ? 'notifications'
              : 'notifications-outline';
          } else if (route.name === 'User') {
            iconName = focused
              ? 'person-circle'
              : 'person-circle-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4c84e6', // Màu icon khi được chọn
        tabBarInactiveTintColor: 'gray',  // Màu icon khi không được chọn
        tabBarStyle: { display: 'flex' }, // Tùy chọn style cho tabBar
      })}
    >

      <Tab2.Screen name="Home" component={HomeScreen2} />
      <Tab2.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab2.Screen name="Blogs" component={BlogStack} />
      <Tab2.Screen name="Notification" component={NotifiScreen} />
      <Tab2.Screen name="User" component={UserStack} />
      {/* <Tab2.Screen name="Signature" component={SignatureScreen} /> */} 
      {/* <Tab2.Screen name="Chart" component ={ChartScreen} />
      <Tab2.Screen name="Gemini" component ={GeminiChatScreen} /> */}
    </Tab2.Navigator>
  );
}


const Stack3 = createNativeStackNavigator();
export default function HomeNavigator() {
  return (
      <Stack3.Navigator initialRouteName="MyTabs">
        <Stack3.Screen name="MyTabs" component={MyTabs} options={{ headerShown: false }} />
        <Stack3.Screen name="Category" component={CategoryScreen} options={{ headerShown: false }} />
        <Stack3.Screen name="Filter" component={FilterScreen} options={{ headerShown: false }} />
        <Stack3.Screen name="FilterResult" component={FilterResultScreen} options={{ headerShown: false }} />
        <Stack3.Screen name="DetailMarket" component={DetailMarketScreen} options={{ headerShown: false }} />
      </Stack3.Navigator>
  );
}