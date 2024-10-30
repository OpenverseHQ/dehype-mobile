import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from './src/screens/SettingsScreen';
import BlogsScreen from './src/screens/BlogScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import NotifiScreen from './src/screens/NotifiScreen';
import UserScreen from './src/screens/UserScreen';
import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import FilterScreen from './src/screens/FilterScreen';
import FilterResultScreen from './src/screens/FilterResultScreen';
import DetailMarketScreen from './src/screens/DetailMarketScreen';

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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Blogs" component={BlogsScreen} />
      <Tab.Screen name="Notification" component={NotifiScreen} />
      <Tab.Screen name="User" component={UserScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={MyTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Category" component={CategoryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Filter" component={FilterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FilterResult" component={FilterResultScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DetailMarket" component={DetailMarketScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
