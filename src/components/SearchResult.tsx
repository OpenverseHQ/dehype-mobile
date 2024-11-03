import React from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet } from 'react-native';

interface SearchResult {
  publicKey: string;
  title: string;
  totalVolume: string;
  avatarUrl: string;
}

interface SearchComponentProps {
  data: SearchResult[];
}

const SearchComponent: React.FC<SearchComponentProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.publicKey}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            {/* <Image source={{ uri: item.avatarUrl }} style={styles.icon} /> */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.totalVolume}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
});

export default SearchComponent;
