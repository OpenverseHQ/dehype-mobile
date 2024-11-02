import { Text, StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import CardItem from '../components/CardItem'
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Định nghĩa kiểu dữ liệu cho route và navigation
interface FilterResultScreenProps {
    route: {
        params: {
            filteredMarkets: any[];
        };
    };
    navigation: any;
}

const FilterResultScreen: React.FC<FilterResultScreenProps> = ({ route, navigation }) => {
    const { filteredMarkets } = route.params;

    if (!filteredMarkets || filteredMarkets.length === 0) {
        return (
            <View style={styles.container}>
                <Header />
                <Text>Không có dữ liệu phù hợp.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header />
            <TouchableOpacity
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 10, width: '90%' }}
                onPress={() => navigation.navigate('Filter')}
            >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Kết quả lọc</Text>
                <Icon name='filter-variant' size={20} />
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false}>
                {filteredMarkets.map((market, index) => (
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


export default FilterResultScreen;


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1
    }
})