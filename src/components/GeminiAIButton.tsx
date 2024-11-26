import React, { useState, useEffect } from 'react';
import { View, Button, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import useGeminiAPI from '../utils/useGeminiApi';

const GeminiAIButton = () => {
  const { callGeminiAPI, loading, error, responseData } = useGeminiAPI();
  const [inputText, setInputText] = useState("Recommed user what deal to buy: Market name : Will SOL reached 1000$ at the end of this year?Today Percent : yes: 70% , No: 30% ; Yesterday Percent: yes: 80% , No: 20%");

  useEffect(() => {
    setInputText("Tóm tắt bài báo sau: https://dantri.com.vn/the-gioi/vu-khi-hoan-toan-moi-cua-nga-khien-ukraine-bat-an-20241126093832067.htm");
  }, []); 


  const handleGenerateContent = async () => {
    await callGeminiAPI(inputText); // Gọi API với inputText
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>AI Recommendation</Text>
        <Button title="Generate" onPress={handleGenerateContent} color="#3399FF" />
      </View>

      {loading && <Text style={styles.statusText}>Loading...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {responseData && <Text style={styles.responseText}>{responseData || 'No response'}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 20,
    color: '#333',
  },
  input: {
    height: 120,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
  responseText: {
    fontSize: 16,
    color: '#333',
    marginTop: 20,
  },
});

export default GeminiAIButton;
