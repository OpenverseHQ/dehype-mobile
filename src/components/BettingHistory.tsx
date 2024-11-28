import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity, ScrollView } from 'react-native';
import api from '../api/registerAccountApi';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDistanceToNow, parseISO, parse } from 'date-fns';

interface CommentMarketScreenProps {
    idMarket: string;
}

const BettingHistory: React.FC<CommentMarketScreenProps> = ({ idMarket }) => {
    const [voterData, setVoterData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [minAmount, setMinAmount] = useState(0);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const minAmountOptions = [0, 10, 100, 1000, 10000, 100000];

    const handleGetAccess = async (wallet) => {
        const requestBody = {
            walletAddress: wallet,
            // walletAddress: "laskdflaskjva234jhas",
        };
        const response = await api.post("/auth/login", requestBody, {
            isPublic: true, // Attach isPublic directly
        } as any);

        const { access_token, refresh_token } = response.data;
        await AsyncStorage.setItem("accessToken", access_token);
        await AsyncStorage.setItem("refreshToken", refresh_token);
    };

    useEffect(() => {
        const fetchVoters = async () => {

            try {
                const response = await api.get(`/markets/${idMarket}/voters?min=${minAmount}`);
                const voters = response.data;
                setVoterData(voters)
                setLoading(false);
            } catch (error: any) {
                if (error.response) {
                    console.error("Error fetching voters:", error.response.status, error.response.data);
                } else {
                    console.error("Error fetching voters:", error.message || "Unknown error");
                }
                throw error;
            }
        };

        fetchVoters();
    }, [idMarket, minAmount]);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" style={{ margin: 20 }} />;
    if (error) return <Text>{error}</Text>;

    return (
        <View style={styles.container}>
            {/* Bộ lọc Min Amount */}
            <View style={styles.filterContainer}>
                <TouchableOpacity onPress={() => setDropdownVisible(!isDropdownVisible)} style={styles.filterButton}>
                    <Text style={styles.filterText}>
                        Min amount {minAmount === 0 ? <Icon name='chevron-down' size={14} /> : `$${minAmount}`}
                    </Text>
                </TouchableOpacity>
                {isDropdownVisible && (
                    <View style={styles.dropdown}>
                        {minAmountOptions.map(amount => (
                            <TouchableOpacity
                                key={amount}
                                onPress={() => {
                                    setMinAmount(amount);
                                    setDropdownVisible(false);
                                }}
                                style={styles.dropdownItem}
                            >
                                <Text style={styles.dropdownText}>{amount === 0 ? 'None' : `$${amount}`}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View> 

            {/* Danh sách FlatList */}
            <FlatList
                data={voterData}
                keyExtractor={(item) => item.publicKey}
                renderItem={({ item }) => {
                    const username = item.username || 'Anonymous';
                    const truncatedUsername = username.length > 10
                        ? `${username.substring(0, 10)}...${username.substring(username.length - 4)}`
                        : username;
                    const parsedTime = new Date(item.account.createTime);
                    const timeAgo = !isNaN(parsedTime.getTime()) ? formatDistanceToNow(parsedTime) : '';
                    return (
                        <View style={styles.itemContainer}>
                            <Image source={{ uri: item.avatarUrl }} style={styles.image} />
                            <View>
                                <Text style={styles.username}>{truncatedUsername}</Text>
                                <Text style={styles.bought}>
                                    Bought
                                    <Text style={{ color: '#26ad5f' }}> {item.account.tokens} SOL <Text style={{ color: '#666' }}>for</Text> {item.account.answerKey}</Text>
                                    (${item.totalBet}) {timeAgo} ago
                                </Text>
                            </View>
                        </View>
                    );
                }}
            />
        </View>


    );
};

export default BettingHistory;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderRadius: 5,
        paddingBottom: 20,
        paddingTop: 10,
        flex: 1,
        position: 'relative',
        overflow: 'visible',
        minHeight: 300
    },
    image: {
        width: 35,
        height: 35,
        marginRight: 10,
        borderRadius: 30
    },
    username: {
        fontWeight: 'bold',
        fontSize: 12
    },
    bought: {
        color: '#666',
        fontSize: 14
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
        position: 'relative',
        zIndex: 10,
    },
    filterButton: {
        padding: 10,
        borderColor: '#ccc',
        borderRadius: 20,
        backgroundColor: '#f2f2f2',
    },
    filterText: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold'
    },
    dropdown: {
        position: 'absolute',
        top: 45,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderRadius: 5,
        zIndex: 20,
        elevation: 10,
    },
    dropdownItem: {
        padding: 8,
    },
    dropdownText: {
        fontSize: 16,
        color: '#666',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
});