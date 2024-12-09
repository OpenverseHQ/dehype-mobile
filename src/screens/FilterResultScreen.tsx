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
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Filter results</Text>
                <Icon name='filter-variant' size={20} />
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false} style={{marginLeft:10}}>
                {filteredMarkets.map((market, index) => (
                    <CardItem
                        key={index}
                        publicKey={market.publicKey}
                        title={market.title}
                        coverUrl={market.coverUrl}
                        participants={market.participants}
                        totalVolume={market.totalVolume}
                        marketStats={market.marketStats}
                        favourites={market.favourites}
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