import { Text, FlatList, StyleSheet, View, Image, TextInput, Alert, TouchableOpacity, Modal } from 'react-native';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import api from '../api/registerAccountApi';
import { debounce } from 'lodash';
import SearchComponent from './SearchResult';

interface Props { }

interface State {
    searchQuery: string;
    searchResults: Array<any>;
    modalVisible: boolean;
}

export default class Header extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            searchQuery: '',
            searchResults: [],
            modalVisible: false,
        };

        this.handleSearch = debounce(this.handleSearch.bind(this), 500);
    }

    handleSearch = async () => {
        if (!this.state.searchQuery) {
            this.setState({ searchResults: [], modalVisible: false });
            return;
        }
        try {
            const response = await api.get(`/markets`, {
                params: { query: this.state.searchQuery },
            });

            const results = response.data.filter((item: { title: string }) =>
                item.title.toLowerCase().includes(this.state.searchQuery.toLowerCase())
            );

            this.setState({ searchResults: results, modalVisible: results.length > 0 });
        } catch (error) {
            Alert.alert('Error', 'An error occurred while searching.');
            console.error(error);
        }
    };

    handleTextChange = (text: string) => {
        this.setState({ searchQuery: text }, () => {
            this.handleSearch();
        });
    };

    closeModal = () => {
        this.setState({ modalVisible: false });
    };

    render() {
        return (
            <View style={styles.header}>
                <View style={styles.text_image}>
                    <Image style={styles.image} source={require('../../assets/image.png')} />
                    <Text style={styles.text}>Dehype</Text>
                </View>
                <View style={styles.search}>
                    <Icon name="magnifying-glass" style={styles.icon_search} />
                    <TextInput
                        placeholder="Search Markets"
                        style={styles.text_input}
                        onChangeText={this.handleTextChange}
                    />
                </View>

                <Modal
                    visible={this.state.modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={this.closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity onPress={this.closeModal} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                            <FlatList
                                data={this.state.searchResults}
                                keyExtractor={(item) => item.publicKey.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity>
                                        <View style={styles.resultItem}>
                                            <Image source={{ uri: item.coverUrl }} style={styles.resultIcon} />
                                            <Text style={styles.resultText}>{item.title}</Text>
                                        </View>
                                    </TouchableOpacity>

                                )}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#f5f5f5',
        flexDirection: 'row',
        alignItems: 'stretch',
        height: 60
    },
    text_image: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        marginBottom: 5
    },
    image: {
        width: 30,
        height: 30
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
        fontSize: 10
    },
    icon_search: {
        color: 'blue',
        position: 'absolute',
        fontSize: 14,
        marginLeft: 10
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
    },
    closeButtonText: {
        color: 'blue',
        fontSize: 16,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    resultIcon: {
        width: 20,
        height: 20,
        borderRadius: 8,
        marginRight: 10,
    },
    resultText: {
        fontSize: 16,
    },
});
