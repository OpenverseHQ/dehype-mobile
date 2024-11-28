import { useState } from 'react';
import axios from 'axios';
import * as GoogleGenerativeAI from "@google/generative-ai";


// Thay YOUR_API_KEY bằng API key của bạn
const API_KEY = 'AIzaSyBc74wz4lN1PELFrgMZSeh9WW-t_8pjyVs';

// Custom Hook gọi API Gemini
const useGeminiAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const callGeminiAPI = async (text) => {
    setLoading(true);
    setError(null);
    setResponseData(null);

    try {
      // Gọi API Gemini
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(text);
      const response = result.response;
      setResponseData(response.text());


    } catch (err) {
      setError('API call failed');
      console.error('API call failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    callGeminiAPI,
    loading,
    error,
    responseData,
  };
};

export default useGeminiAPI;