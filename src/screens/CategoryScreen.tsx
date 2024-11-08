import { Text, StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { Component, useState, useEffect } from 'react'
import CardItem from '../components/CardItem'
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../api/registerAccountApi';

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

    const fetchData = async () => {
        try {
            const response = await api.get(`/search/details?c=${id}`);
            if (!response || !response.data) {
                throw new Error("Không có dữ liệu từ API.");
            }
            const markets = response.data;
            console.log(markets)

            const marketsWithStats = await Promise.all(
                markets.map(async (market: any) => {
                    const statsResponse = await api.get(`/markets/${market.publicKey}/stats`);
                    if (!statsResponse || !statsResponse.data) {
                        throw new Error("Không có dữ liệu stats từ API.");
                    }
                    return { ...market, marketStats: statsResponse.data };
                })
            );
            setMarketData(marketsWithStats);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

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