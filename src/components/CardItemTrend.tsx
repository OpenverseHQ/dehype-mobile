import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState } from 'react';


interface CardItems {
    nameMarket: string;
    outcome: string;
    percent: number;
    LikeCount:number
}

const CardItemTrend: React.FC<CardItems> = ({ nameMarket, outcome, percent, LikeCount }) => {
    const [isLiked, setIsLiked] = useState(false);

    const [likeCount, setLikeCount] = useState(LikeCount);

    const toggleHeartColor = () => {
        setIsLiked(!isLiked);
        setLikeCount(likeCount + (isLiked ? -1 : 1)); 
    };

    return (
        <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
                <Image source={require('../../assets/Male_User.png')} />
                <Text style={styles.cardTitle}>{nameMarket}</Text>

                <TouchableOpacity onPress={toggleHeartColor}>
                    <Icon 
                        name='heart' 
                        color={isLiked ? 'red' : '#E5E7EB'}  
                        size={16}  
                        style={{ marginLeft: 45 }} 
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${percent}%` }]}>
                        <Text>{outcome}</Text>
                    </View>
                    <Text style={styles.percentage}>{percent}%</Text>
                </View>
            </View>

            <Text style={styles.footerText}>
                Ended Sep 27 | 2 outcomes 
                <Text style={styles.heartIcon}>    ❤️ {likeCount}</Text>
            </Text>
        </TouchableOpacity>
    );
};

export default CardItemTrend;

const styles = StyleSheet.create({
    card: {
        width: 220,
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
        marginBottom: 10,
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
    footerText: {
        fontSize: 12,
        color: '#777',
    },
    heartIcon: {
        color: 'red',
    },
});
