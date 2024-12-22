import React, { useState, useEffect } from 'react';
import { View, Button, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import useGeminiAPI from '../utils/useGeminiApi';
import { MarketSummary } from '../utils/marketSummary';

interface GeminiAIButtonProps {
  marketTitle: string;
  marketDescription: string;
}

const GeminiAIButton: React.FC<GeminiAIButtonProps> = ({ marketTitle, marketDescription }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const marketSummary = new MarketSummary();

  const handleGenerateSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await marketSummary.summaryMarketTopic(
        marketTitle,
        marketDescription
      );
      setSummary(result);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>✨ AI-Powered Summary ✨</Text>
        <Button
          title="Generate"
          onPress={handleGenerateSummary}
          color="#0066FF"
        />
      </View>

      {loading && <Text style={styles.statusText}>Generating summary...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {summary && (
        <View style={styles.summaryContainer}>
          <View style={styles.iconWrapper}>
            <Text style={styles.icon}>💡</Text>
          </View>
          <Text style={styles.summaryHeader}>Here is your summary:</Text>
          <Text style={styles.summaryText}>{summary}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#E8F0FE",
  },
  header: {
    marginBottom: 16,
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0047AB",
    textAlign: "center",
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  summaryContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    alignItems: "center",
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    fontSize: 24,
  },
  summaryHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  summaryText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
    textAlign: "center",
  },
});

export default GeminiAIButton;