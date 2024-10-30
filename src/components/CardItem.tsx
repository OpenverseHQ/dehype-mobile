import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../api';


interface AnswerStats {
    name: string;
    totalTokens: number;
    totalVolume: number;
    percentage: string;
}

interface MarketStats {
    numVoters: number;
    totalVolume: number;
    answerStats: AnswerStats[];
}

interface CardItems {
    publicKey: string;
    title: string;
    coverUrl: string;
    marketStats: MarketStats;
}

const CardItem: React.FC<CardItems> = ({ publicKey, title, coverUrl, marketStats }) => {
    const [isLiked, setIsLiked] = useState(false);

    const toggleHeartColor = () => {
        setIsLiked(!isLiked);
    };
    return (
        <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.leftSection}>
                    <Image source={{ uri: coverUrl }} />
                    <Text style={styles.cardTitle}>{title}</Text>
                </View>
                <TouchableOpacity onPress={toggleHeartColor}>
                    <Icon
                        name='heart'
                        color={isLiked ? 'red' : '#E5E7EB'}
                        size={16}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.progressBarContainer}>
                {marketStats.answerStats.map((answer, index) => (
                    
                    <View key={index} style={styles.progressBar}>

                        <View style={styles.progressBarWrapper}>
                            <View style={[styles.progressFill, { answer.percentage }]}>
                                <Text style={styles.outcomeText}>{index}</Text>
                            </View>
                            <Text style={styles.percentageText}>{answer.name}</Text>

                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}> Ended Sep 27 | 2 outcomes </Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 12 }}><Icon name='account-multiple' />{marketStats.numVoters}</Text>
                    <Text style={{ fontSize: 12, marginLeft: 8 }}><Icon name='poll' />{marketStats.totalVolume}</Text>
                    <Image source={{ uri: coverUrl }} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default CardItem;

const styles = StyleSheet.create({
    card: {
        width: '97%',
        padding: 10,
        margin: 10,
        marginLeft: 1,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 4,
        justifyContent: 'center',
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        width: '100%'
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10
    },
    progressBarContainer: {
        marginBottom: 5,
    },
    progressBar: {
        flexDirection: 'row',
        height: 30,
        width: '100%',
        backgroundColor: '#E5E7EB',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 5
    },
    progressFill: {
        backgroundColor: '#A7C7E7',
        height: '100%',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        paddingLeft: 5,
        justifyContent: 'center'
    },
    percentage: {
        marginLeft: 5,
        fontSize: 14,
        fontWeight: '500',
    },
    voteText: {
        fontSize: 16,
        color: '#4CAF50',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8
    },
    footerText: {
        fontSize: 12,
        color: '#777',
    },
    heartIcon: {
        color: 'red',
    },
});
