import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import api from '../api/registerAccountApi';
import { useEffect, useState } from 'react';

interface CommentMarketScreenProps {
    idMarket: string;
}

const BettingHistory: React.FC<CommentMarketScreenProps> = ({ idMarket }) => {
    const [voterData, setVoterData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVoters = async () => {
            try {
                const response = await api.get(`/markets/${idMarket}/voters`);
                const voters = response.data;
                console.log(voters[0].account.voter)

                const infoVoter = await Promise.all(
                    voters.map(async (voter) => {
                        const voterInfo = await api.get(`/users/${voter.account.voter}`)
                        return { ...voter, info: voterInfo.data };
                    })
                );
                setVoterData(infoVoter)
                console.log(infoVoter)

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

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>{error}</Text>;

    return (
        <FlatList
            data={voterData}
            keyExtractor={(item) => item.voter.publicKey}
            renderItem={({ item }) => (
                <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                    <Text style={{ fontWeight: 'bold' }}>{item.voter.account.answerKey}</Text>
                    <Text>Vote: {item.voter.account.voter}</Text>
                    <Text>Username: {item.info.username}</Text>
                    <Image source={{ uri: item.info.avatarUrl }} style={{ width: 50, height: 50 }} />
                </View>
            )}
        />

    );
};

export default BettingHistory;
