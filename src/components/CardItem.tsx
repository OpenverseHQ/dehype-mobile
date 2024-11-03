import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
    DetailMarket: { publicKey: string };
};

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
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [isLiked, setIsLiked] = useState(false);

    const toggleHeartColor = () => {
        setIsLiked(!isLiked);
    };
    return (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DetailMarket', { publicKey })}>
            <View style={styles.cardHeader}>
                <View style={styles.leftSection}>
                    <Image
                        source={{ uri: coverUrl }}
                        style={{ width: 30, height: 30 }}
                    />
                    <Text style={styles.cardTitle}>{title}</Text>
                </View>
                <TouchableOpacity onPress={toggleHeartColor} style={{ margin: 10 }}>
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
                            <View style={[styles.progressFill, { width: `${Math.min(parseFloat(answer.percentage), 100)}%` }]} />
                            <Text style={styles.outcomeText}>{answer.name}</Text>
                            <Text style={styles.percentageText}>{answer.percentage}%</Text>
                        </View>
                    </View>
                ))}
            </View>
            
            <View style={styles.footer}>
                <Text style={styles.footerText}> Ended Sep 27 | {marketStats.answerStats.length} outcomes</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12 }}><Icon size={14} name='account-multiple' /> {marketStats.numVoters}</Text>
                    <Text style={{ fontSize: 12, marginLeft: 8 }}><Icon size={14} name='poll' /> {marketStats.totalVolume}</Text>
                    <Image source={{ uri: coverUrl }} style={{ width: 14, height: 14, marginLeft: 8 }} />
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
        width: '100%',

    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
        flexWrap: 'wrap',
    },
    progressBarContainer: {

    },
    progressBar: {
        flexDirection: 'row',
        height: 30,
        width: '100%',
        backgroundColor: '#E5E7EB',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
        overflow: 'hidden',
    },
    outcomeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        zIndex: 1,
        marginLeft: 8
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
    progressBarWrapper: {
        height: '100%',
        backgroundColor: '#E5E7EB',
        borderRadius: 5,
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        position: 'relative',


    },
    progressFill: {
        height: '100%',
        backgroundColor: '#C9DBFF',
        position: 'absolute',
        top: 0,
        left: 0,

    },
    percentageText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        zIndex: 1,
        position: 'absolute',
        right: 5,
    },
});