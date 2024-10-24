import { Text, StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import CardItem from '../components/CardItem'
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Định nghĩa kiểu dữ liệu cho route và navigation
interface CategoryScreenProps {
    route: {
        params: {
            category: string;
        };
    };
    navigation: any;
}

const CategoryScreen: React.FC<CategoryScreenProps> = ({ route, navigation }) => {
    const marketData = require('../data.json');
    const { category } = route.params;

    // Lọc các market theo category
    const filteredMarkets = marketData.markets.filter((market: any) => market.category === category);

    return (
        <View style={styles.container}>
            <Header />
            <TouchableOpacity
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 10, width: '90%' }}
                onPress={() => navigation.navigate('Filter')}
            >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{category}</Text>
                <Icon name='filter-variant' size={20} />
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false}>
                {filteredMarkets.map((market: any, index: number) => (
                    <CardItem
                        key={index}
                        nameMarket={market.name}
                        outcome='Yes' 
                        percent={Math.floor(Math.random() * 50) + 50}
                        cate={market.category}
                        traders={market.traders}
                        volume={market.volume}
                        liquidity={market.liquidity}
                    />
                ))}
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
    }
})