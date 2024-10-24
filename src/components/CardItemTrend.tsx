import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Outcome {
    [key: string]: string;
}

interface CardItems {
    id:number;
    nameMarket: string;
    outcome: Outcome;
    LikeCount: number;
}

const CardItemTrend: React.FC<CardItems> = ({ id, nameMarket, outcome, LikeCount }) => {
    const navigation = useNavigation();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(LikeCount);

    const toggleHeartColor = () => {
        setIsLiked(!isLiked);
        setLikeCount(likeCount + (isLiked ? -1 : 1));
    };

    return (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DetailMarket', { id })}>
            <View style={styles.cardHeader}>
                <Image source={require('../../assets/Male_User.png')} />
                <Text style={styles.cardTitle}>{nameMarket}</Text>
                <TouchableOpacity onPress={toggleHeartColor}>
                    <Icon
                        name='heart'
                        color={isLiked ? 'red' : '#E5E7EB'}
                        size={16}
                        style={{ marginLeft: 90 }}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.progressBarContainer} showsVerticalScrollIndicator={false}>
                {Object.entries(outcome).map(([key, value]) => {
                    const percentage = parseFloat(value);
                    const width = `${percentage}%`;

                    return (
                        <View key={key} style={styles.progressBar}>

                            <View style={styles.progressBarWrapper}>
                                <View style={[styles.progressFill, { width }]}>
                                    <Text style={styles.outcomeText}>{key}</Text>
                                </View>
                                <Text style={styles.percentageText}>{value}</Text>

                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            <Text style={styles.footerText}>
                Ended Sep 27 | {Object.keys(outcome).length} outcomes
                <Text style={styles.heartIcon}>            ❤️ {likeCount}</Text>
            </Text>
        </TouchableOpacity>
    );
};

export default CardItemTrend;

const styles = StyleSheet.create({
    card: {
        width: 250,
        padding: 10,
        margin: 10,
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
        marginLeft: 10,
    },
    progressBarContainer: {
        marginBottom: 5,
        maxHeight: 100, // Đặt chiều cao tối đa để có thể cuộn nếu cần
    },
    progressBar: {
        height: 30,
        marginVertical: 5,
        justifyContent: 'center',
    },
    progressBarWrapper: {
        height: '100%',
        backgroundColor: '#E5E7EB',
        borderRadius: 5,
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#C9DBFF', // Màu sắc của thanh progress
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft:5
    },
    percentageText: {
        marginRight: 5,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000', // Màu chữ bên trong thanh progress
    },
    outcomeText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    footerText: {
        fontSize: 12,
        color: '#777',
    },
    heartIcon: {
        color: 'red',
    },
});
