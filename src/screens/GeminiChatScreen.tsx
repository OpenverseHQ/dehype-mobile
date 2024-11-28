import React, { useState } from 'react';
import { View, Button, Text, TextInput, ScrollView } from 'react-native';
import useGeminiAPI from '../utils/useGeminiApi';

import GeminiAIButton from '../components/GeminiAIButton';

const GeminiChatScreen = () => {
  const [inputText, setInputText] = useState('');
  const { callGeminiAPI, loading, error, responseData } = useGeminiAPI();

  const handleGenerateContent = async () => {
    await callGeminiAPI(inputText); // Gọi API với inputText
  };

  return (
    <ScrollView style={{ padding: 20, backgroundColor: 'white' }}>
        <GeminiAIButton />

      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
        placeholder="Enter your prompt"
        value={inputText}
        onChangeText={setInputText}
      />
      <Button title="Generate" onPress={handleGenerateContent} />
      {loading && <Text>Loading...</Text>}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {responseData && <Text style={{ marginTop: 20 }}>Response: {responseData || 'No response'}</Text>}
    </ScrollView>
  );
};

export default GeminiChatScreen;