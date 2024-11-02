import { Text, StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import CardItem from './CardItem'

interface myProps{
    nameCategory: string;
}


const CategoryCollection: React.FC<myProps> = ({ nameCategory }) => {
        return (
            <View style={styles.sportCollection}>
                <View style={styles.headerSportCollection}>
                    <View><Text style={{fontSize:18, fontWeight:'500'}}>{nameCategory}</Text></View>
                    <View><Text style={{fontSize:12, color:'#808080'}}>Show All</Text></View>
                </View>
            </View>
        )
}

export default CategoryCollection;

const styles = StyleSheet.create({
    sportCollection: {
        paddingRight: 10
    },
    headerSportCollection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center'
    },
    scrollItem: {
    }
})