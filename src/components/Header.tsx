import { Text, SafeAreaView, StyleSheet, View, Image, TextInput } from 'react-native';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';

interface Props {}

interface State {}

export default class Header extends Component<Props, State> {
    render() {
        return (
            <View style={styles.header}>
                <View style={styles.text_image}>
                    <View>
                        <Image style={styles.image} source={require('../../assets/image.png')} />
                    </View>
                    <View>
                        <Text style={styles.text}>Dehype</Text>
                    </View>
                </View>
                <View style={styles.search}>
                    <Icon name='magnifying-glass' style={styles.icon_search} />
                    <TextInput placeholder='Search Markets' style={styles.text_input} />
                </View>
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
        paddingTop:5,
        height: 30,
        width: 220,
        fontSize: 10
    },
    icon_search: {
        color: 'blue',
        position: 'absolute',
        fontSize: 14,
        marginLeft: 10
    }
});
