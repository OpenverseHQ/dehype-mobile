import { TopBar } from "../components/top-bar/top-bar-feature";
import { HomeScreen } from "../screens/HomeScreen";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";
import BlankScreen from "../screens/BlankScreen";


import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BlogsScreen from "../screens/BlogScreen";
import LeaderboardScreen from '../screens/LeaderboardScreen';
import NotifiScreen from "../screens/NotifiScreen"
import UserScreen from '../screens/UserScreen';
import HomeScreen2 from '../screens/HomeScreen2';
import CategoryScreen from '../screens/CategoryScreen';
import FilterScreen from '../screens/FilterScreen';
import FilterResultScreen from '../screens/FilterResultScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
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
      <Tab.Screen name="Home" component={HomeScreen2} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Blogs" component={BlogsScreen} />
      <Tab.Screen name="Notification" component={NotifiScreen} />
      <Tab.Screen name="User" component={UserScreen} />
    </Tab.Navigator>
  );
}

const Tab2 = createBottomTabNavigator();

/**
 * This is the main navigator with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 */
export function HomeNavigator() {
  const theme = useTheme();
  return (
    <Tab2.Navigator
      screenOptions={({ route }) => ({
        header: () => <TopBar />,
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case "Home":
              return (
                <MaterialCommunityIcon
                  name={focused ? "home" : "home-outline"}
                  size={size}
                  color={color}
                />
              );
            case "Blank":
              return (
                <MaterialCommunityIcon
                  name={
                    focused ? "application-edit" : "application-edit-outline"
                  }
                  size={size}
                  color={color}
                />
              );
          }
        },
      })}
    >
      <Tab2.Screen name="Home" component={HomeScreen} />
      <Tab2.Screen name="Blank2" component={BlankScreen} />
      <Tab2.Screen name="Mytabs" component={MyTabs} />
    </Tab2.Navigator>
  );
}
