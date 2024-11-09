import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, Alert } from 'react-native';
import api from '../api/registerAccountApi';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface CommentMarketScreenProps {
    idMarket: string;
}

const BettingHistory: React.FC<CommentMarketScreenProps> = ({ idMarket }) => {
    const [voterData, setVoterData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
                const response = await api.get(`/markets/${idMarket}/voters`);
                const voters = response.data;
                await handleGetAccess(voters[0].account.voter);

                const infoVoter = await Promise.all(
                    voters.map(async (voter) => {
                        const voterInfo = await api.get(`/users/${voter.account.voter}`)
                        return { ...voter, info: voterInfo.data };
                    })
                );
                setVoterData(infoVoter)
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
    }, [idMarket]);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" style={{ margin: 20 }} />;
    if (error) return <Text>{error}</Text>;

    return (
        <FlatList
            data={voterData}
            keyExtractor={(item) => item.publicKey}
            renderItem={({ item }) => {
                const { username } = item.info;
                const truncatedUsername = username.length > 10
                    ? `${username.substring(0, 10)}...${username.substring(username.length - 4)}`
                    : username;
                return (
                    <View style={styles.container}>
                        <Image source={{ uri: item.info.avatarUrl }} style={styles.image} />
                        <View>
                            <Text style={styles.username}>{truncatedUsername}</Text>
                            <Text style={styles.bought}>Bought
                                <Text style={{ color: '#26ad5f' }}> {item.account.tokens} SOL <Text style={{ color: '#666' }}>for</Text> {item.account.answerKey}</Text> at {item.account.createTime}
                            </Text>
                        </View>
                    </View>
                );
            }}
        />


    );
};

export default BettingHistory;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        paddingBottom: 20,
        paddingTop: 20,
    },
    image: {
        width: 35,
        height: 35,
        marginRight: 10
    },
    username: {
        fontWeight: 'bold',
        fontSize: 12
    },
    bought: {
        color: '#666',
        fontSize: 14
    }

});
