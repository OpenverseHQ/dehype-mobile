import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import debounce from 'lodash.debounce';
import api from '../api/registerAccountApi';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';


type RootStackParamList = {
    DetailMarket: { publicKey: string };
};

interface HeaderProps { }

const Header: React.FC<HeaderProps> = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Array<any>>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useFocusEffect(
        useCallback(() => {
            setModalVisible(false);
            setSearchQuery('');
        }, [])
    );

    const handleSearch = useCallback(
        debounce(async (query: string) => {
            if (!query) {
                setSearchResults([]);
                setModalVisible(false);
                return;
            }

            try {
                const response = await api.get(`/search`, {
                    params: { q: query },
                });
                const results = response.data;
                setSearchResults(results);
                setModalVisible(results.length > 0);
            } catch (error) {
                Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tìm kiếm.');
                console.error(error);
            }
        }, 500),
        []
    );


    const handleTextChange = (text: string) => {
        setSearchQuery(text);
        handleSearch(text);
    };
    const handleOutsidePress = () => {
        setModalVisible(false);
        Keyboard.dismiss(); 
    };

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={styles.header}>
                <View style={styles.text_image}>
                    <Image style={styles.image} source={require('../../assets/image.png')} />
                    <Text style={styles.text}>Dehype</Text>
                </View>
                <View style={styles.search}>
                    <Icon name="search" style={styles.icon_search} />
                    <TextInput
                        placeholder="Search Markets"
                        style={styles.text_input}
                        onChangeText={handleTextChange}
                        value={searchQuery}
                    />
                </View>
                {modalVisible && (
                    <View style={styles.resultContainer}>
                        <ScrollView nestedScrollEnabled={true}>
                            {searchResults.map((item) => (
                                <TouchableOpacity key={item.marketId.toString()} onPress={() => navigation.navigate('DetailMarket', { publicKey: item.marketId })}>
                                    <View style={styles.resultItem}>
                                        <Image source={{ uri: item.coverUrl }} style={styles.resultIcon} />
                                        <Text style={styles.resultText}>{item.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>

    );
};
export default Header;

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#f5f5f5',
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        height: 60,
        zIndex: 1,
    },
    text_image: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        marginBottom: 5,
    },
    image: {
        width: 30,
        height: 30,
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    search: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    text_input: {
        borderWidth: 2,
        borderRadius: 15,
        borderColor: '#aaaaaa',
        paddingLeft: 30,
        marginRight: 30,
        height: 30,
        width: 220,
        fontSize: 10,
    },
    icon_search: {
        color: 'blue',
        position: 'absolute',
        fontSize: 14,
        marginLeft: 10,
    },
    resultContainer: {
        position: 'absolute',
        zIndex: 200,
        padding: 5,
        top: 62,
        left: '5%',
        right: '5%',
        backgroundColor: '#f0f5ff',
        borderRadius: 10,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 4,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingLeft: 5,
        borderBottomWidth: 2,
        borderBottomColor: '#eee',
    },
    resultIcon: {
        width: 35,
        height: 35,
        borderRadius: 8,
        marginRight: 10,
    },
    resultText: {
        fontSize: 16,
    },
});
