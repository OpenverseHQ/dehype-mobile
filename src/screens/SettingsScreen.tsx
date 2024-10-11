import { Text, StyleSheet, View } from 'react-native'
import React, { Component } from 'react'
import Header from '../components/Header'


export default class SettingsScreen extends Component {
  render() {
    return (
      <View>
        <Header/>
        <Text>SettingsScreen</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({})