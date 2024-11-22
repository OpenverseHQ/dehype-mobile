import { Text, StyleSheet, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { Component, useState, useEffect } from 'react'
import CardItem from '../components/CardItem'
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../api/registerAccountApi';
import { useAuthorization } from '../utils/useAuthorization';


// Định nghĩa kiểu dữ liệu cho route và navigation
interface CategoryScreenProps {
    route: {
        params: {
            id: number;
            nameCate: string
        };
    };
    navigation: any;
}

const CategoryScreen: React.FC<CategoryScreenProps> = ({ route, navigation }) => {
    const { id, nameCate } = route.params;
    const [marketData, setMarketData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [favourites, setFavourites] = useState([]);
    const { selectedAccount } = useAuthorization();
    const [marketFavoriteData, setMarketFavoriteData] = useState<any[]>([]);

    useEffect(() => {
        const fetchMarketFavorite = async () => {
          try {
            const response = await api.get('/search/details?fav=true');
            const markets = response.data;
            setFavourites(response.data.map(item => item.publicKey));
    
            const marketsWithStats = await Promise.all(
              markets.map(async (market: any) => {
                const statsResponse = await api.get(`/markets/${market.publicKey}/stats`);
                return { ...market, marketStats: statsResponse.data };
              })
            );
            setMarketFavoriteData(marketsWithStats);
          } catch (error) {
            console.error('Lỗi khi lấy danh sách favorite market:', error);
          }
        };
    
        if (selectedAccount) {
          const unsubscribe = navigation.addListener('focus', fetchMarketFavorite);
          return unsubscribe;
        } else {
          setFavourites([]);
        }
      }, [navigation, selectedAccount]);

    const fetchData = async () => {
        try {
            const response = await api.get(`/search/details?c=${id}`);
            const markets = response.data;

            const marketsWithStats = await Promise.all(
                markets.map(async (market: any) => {
                    const statsResponse = await api.get(`/markets/${market.publicKey}/stats`);
                    return { ...market, marketStats: statsResponse.data };
                })
            );
            setMarketData(marketsWithStats);
            setLoading(false);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);
    
    if (loading) return <ActivityIndicator size="large" color="#0000ff" style={{ margin: 20 }} />;

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.filter}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{nameCate}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Filter')}>
                    <Icon name='filter-variant' size={20} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.listCard} showsVerticalScrollIndicator={false}>
                {marketData.length > 0 ? (
                    marketData.map((market: any) => (
                        <CardItem
                            key={market.publicKey}
                            publicKey={market.publicKey}
                            title={market.title}
                            coverUrl={market.coverUrl}
                            participants={market.participants}
                            totalVolume={market.totalVolume}
                            marketStats={market.marketStats}
                            favourites={favourites}
                        />
                    ))
                ) : (
                    <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>No data available</Text>
                    </View>
                )}
            </ScrollView>

        </View>
    );
};

export default CategoryScreen;


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1
    },
    filter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
        marginBottom: 0,
        width: '90%'
    },
    listCard: {
        marginLeft: 15
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noDataText: {
        fontSize: 16,
        color: 'gray',
    },
})