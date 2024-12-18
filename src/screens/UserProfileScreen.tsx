import React from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';  // Import icon
import { formatDistanceToNow, parseISO, parse } from 'date-fns';
import { TopBar } from '../components/top-bar/top-bar-feature';
import useApi from '../utils/useApi';
import { useEffect, useState } from 'react';
import api from '../api/registerAccountApi';
import { useAuthorization } from '../utils/useAuthorization';

interface UserProfileScreenProps {
    route: {
        params: {
            address: string;
        };
    };
}

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ route }) => {
    const { address } = route.params;
    console.log('Địa chỉ người dùng mới của tauuuuuuuuuuu:', address);
    const [loading, setLoading] = useState(true);
    const { selectedAccount } = useAuthorization();
    console.log('nick chinhhhh:', selectedAccount.publicKey)
    const [error, setError] = useState('');
    const [betHistory, setBetHistory] = useState([]);
    const { handleGetUserInfo } = useApi();
    const [userInfo, setUserInfo] = useState({
        "walletAddress": "AXvu8CZGasQ72sHVBD9cdYBqKvb7PR6VtHA55JYYXAPA",
        "username": "Hoang",
        "avatarUrl": "https://res.cloudinary.com/diwacy6yr/image/upload/v1728441530/User/default.png",
        "joinedMarkets": 0,
        "profitLoss": 0,
        "totalAmount": 0
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfo = await handleGetUserInfo(address);
                setUserInfo(userInfo);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserInfo();
    }
        , [address]);
    const fetchBetHistory = async () => {
        const id = userInfo.walletAddress;
        try {
            setLoading(true);
            const response = await api.get(`/users/${id}/history`)
            const result = response.data.bets;
            setBetHistory(result);
        } catch (err) {
            setError("Failed to fetch bet history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBetHistory()
    }, []);




    //const navigation = useNavigation() ;
    return (
        <ScrollView style={styles.container}>


            {/* Thông tin người dùng */}
            <View style={styles.userInfo}>

                <Image
                    source={{ uri: userInfo.avatarUrl }}
                    style={styles.avatar}
                />

                {selectedAccount.publicKey === null || selectedAccount.publicKey.toString() !== address ? (
                    <View>
                        <Text style={styles.username}>{userInfo.username}</Text>
                        <Text style={styles.wallet}>{userInfo.walletAddress}</Text>
                    </View>
                ) : (
                    <View>
                        <TopBar />
                    </View>
                )}
            </View>


            {/* Thẻ thống kê */}
            <View style={styles.cardContainer}>
                <TouchableOpacity
                    style={styles.card}
                >
                    <Icon name="pulse-outline" size={30} color="#000" />
                    <Text style={styles.cardTitle}>Position Value</Text>
                    <Text style={styles.cardValue}>{ }</Text>
                </TouchableOpacity>
                <View style={styles.card}>
                    <Icon name="trending-down-outline" size={30} color="#000" />
                    <Text style={styles.cardTitle}>Profit/loss</Text>
                    <Text style={styles.cardValue}>{userInfo.profitLoss}</Text>
                </View>
                <View style={styles.card}>
                    <Icon name="bar-chart-outline" size={30} color="#000" />
                    <Text style={styles.cardTitle}>Volume traded</Text>
                    <Text style={styles.cardValue}>{userInfo.totalAmount}</Text>
                </View>
                <View style={styles.card}>
                    <Icon name="checkbox-outline" size={30} color="#000" />
                    <Text style={styles.cardTitle}>Markets traded</Text>
                    <Text style={styles.cardValue}>{userInfo.joinedMarkets}</Text>
                </View>
            </View>

            {/* Activity */}
            <View style={styles.profileFooter}>
                <View style={styles.titleFooter}>
                    <Text style={styles.titleText}>Activity</Text>
                </View>

                {betHistory.length === 0 ? (
                    <Text style={styles.noBetText}>The user has not placed a bet yet!</Text>
                ) : (
                    betHistory.map((bet, index) => {
                        const parsedTime = new Date(bet.createTime);
                        const timeAgo = !isNaN(parsedTime.getTime()) ? formatDistanceToNow(parsedTime) : '';
                        return (
                            <View key={index} style={styles.contentFooter}>
                                <View style={styles.leftFooter}>
                                    <Text style={styles.titleMarket}>{bet.marketTitle}</Text>
                                    <View style={styles.dateBet}>
                                        <Text style={styles.result}>{`${bet.answerKey} - ${bet.tokens}$`}</Text>
                                        <Text style={styles.date}>{timeAgo} ago</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })
                )}
            </View>



        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',

    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    logo: {
        width: 80,
        height: 40,
        resizeMode: 'contain',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: '70%',
    },
    searchIcon: {
        marginRight: 5,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    userInfo: {
        maxWidth: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 5,
        marginTop: 5,
    },
    username: {
        fontSize: 14,
        fontWeight: 'bold',
        justifyContent: "flex-start",
        flexWrap: 'wrap',
        width: '100%',
    },

    userId: {
        fontSize: 12,
        color: '#888',
    },
    favorite: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 15,
    },
    favoriteText: {
        fontSize: 16,
        marginRight: 5,
    },
    cardContainer: {
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 10,
    },
    cardValue: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    favoriteBadge: {
        position: 'absolute',
        top: 25,
        right: 10,
        backgroundColor: 'red',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    favoriteBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    profileFooter: {
        paddingTop: 15,
        padding: 10,
        flexDirection: 'column',
    },
    titleFooter: {
        borderBottomWidth: 1,
        borderColor: '#f2f2f2',
        paddingBottom: 8,
    },
    titleText: {
        fontWeight: 'bold'
    },
    contentFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#f2f2f2',
        backgroundColor: '#fff',
    },
    leftFooter: {
        flexDirection: 'column',
        padding: 8,
    },
    result: {
        fontSize: 14,
        color: '#666',
    },
    titleMarket: {
        color: 'rgb(16, 104, 115)',
    },
    dateBet: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 5
    },
    date: {
        color: '#666',
        fontSize: 12
    },
    noBetText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 16,
        marginTop: 20,
    },
    wallet: {
        color: '#666',
    }
});

export default UserProfileScreen;