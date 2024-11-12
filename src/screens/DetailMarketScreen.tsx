import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Image, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import CommentMarketScreen from '../components/CommentMarket';
import api from '../api/registerAccountApi';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Marquee from 'react-native-marquee';
import BettingHistory from '../components/BettingHistory';
import { htmlToText } from 'html-to-text';

interface DetailMarketScreenProps {
  route: {
    params: {
      publicKey: string;
    };
  };
}

const DetailMarketScreen: React.FC<DetailMarketScreenProps> = ({ route }) => {
  const [amount, setAmount] = useState('0');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<any>(null);
  const [selectedChoice, setSelectedChoice] = useState<'Yes' | 'No'>('Yes');
  const { publicKey } = route.params;
  const [market, setMarket] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState('Comment'); 
  const [isLiked, setIsLiked] = useState(false);

  const toggleHeartColor = () => {
    setIsLiked(!isLiked);
  };


  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await api.get(`/markets/${publicKey}`);
        const marketData = response.data;

        if (marketData) {

          const statsResponse = await api.get(`/markets/${publicKey}/stats`);
          const marketStats = statsResponse.data;
          const totalVolume = marketStats.answerStats[0].totalVolume;
          setMarket({ ...marketData, marketStats: { ...marketStats, totalVolume } });
        } else {
          console.error('Market data is undefined');
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchMarketData();
  }, [publicKey]);


  if (!market) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const outcomesArray = market.marketStats.answerStats.map((stat: any) => ({
    option: stat.name,
    percentage: stat.percentage,
    totalValue: stat.totalTokens
  }));


  const handlePressRow = (item: any) => {
    setSelectedOutcome(item);
    setModalVisible(true);
  };


  return (
    <FlatList
      style={styles.container}
      data={outcomesArray}
      keyExtractor={(item) => item.option}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          {/* Tiêu đề và thông tin chung */}
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image style={{ width: 30, height: 30, marginRight: 10 }} source={{ uri: market.coverUrl }} />
              <Marquee
                style={styles.title}
                marqueeOnStart={true}
                loop
              >
                {market.title}
              </Marquee>
            </View>
            <Text style={styles.subtitle}>
              Started: {market.start_date} | Ends: {market.end_date} | Total Volume: {market.marketStats.totalVolume} SOL
            </Text>
          </View>
          {/* Creater */}
          <View style={{ flexDirection: 'row', marginBottom: 10, marginLeft: 5, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
              <Image style={{ width: 28, height: 28 }} source={require('../../assets/Male_User.png')} />
              <View style={{ margin: 5 }}>
                <Text style={{ fontSize: 10, color: '#666' }}>Creator</Text>
                <Text style={{ fontSize: 12 }}>Thang Tran</Text>
              </View>
            </View>
            <Image style={{ width: 20, height: 20, marginRight: 10 }} source={{ uri: market.coverUrl }} />
            <Icon name='check-circle-outline' size={20} color={'green'} />
            <TouchableOpacity onPress={toggleHeartColor} style={{ margin: 10 }}>
              <Icon
                name='heart'
                color={isLiked ? 'red' : '#666'}
                size={20}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.table}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Text style={styles.tableHeader}>Outcome</Text>
              <Text style={styles.tableHeader}>Percentage(%)</Text>
              <Text style={styles.tableHeader}>Total Value</Text>
            </View>
          </View>
        </>
      }
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handlePressRow(item)}>
          <View style={styles.row}>
            <Text style={styles.rowText}>{item.option}</Text>
            <Text style={styles.rowText}>{item.percentage}</Text>
            <Text style={styles.rowText}> {(item.totalValue / 1e9).toFixed(2)} </Text>
          </View>
        </TouchableOpacity>
      )}
      ListFooterComponent={
        <>
          {/* Phần biểu đồ */}
         {/* <Chart/> */}
          {/* Phần mô tả thị trường */}
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutTitle}>About Market</Text>
            <Text style={styles.aboutText}>
              {htmlToText(market.description || 'No description available.')}
            </Text>
          </View>

          {/* Các tab bình luận và lịch sử cược */}
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 8,
                borderBottomWidth: selectedTab === 'Comment' ? 2 : 0,
                borderBottomColor: 'blue',
              }}
              onPress={() => setSelectedTab('Comment')}
            >
              <Text style={{ color: selectedTab === 'Comment' ? 'blue' : 'black' }}>Comments</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 8,
                borderBottomWidth: selectedTab === 'Betting history' ? 2 : 0,
                borderBottomColor: 'blue',
              }}
              onPress={() => setSelectedTab('Betting history')}
            >
              <Text style={{ color: selectedTab === 'Betting history' ? 'blue' : 'black' }}>Activity</Text>
            </TouchableOpacity>
          </View>

          {selectedTab === 'Comment' ? (
            <CommentMarketScreen idMarket={publicKey.toString()} />
          ) : (
            <BettingHistory idMarket={publicKey.toString()} />
          )}

          {/* Modal hiển thị chi tiết khi nhấn vào một hàng */}
          {selectedOutcome && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <View style={styles.closeButton}></View>
                  </TouchableOpacity>
                  <View style={styles.modalHeader}>
                    <Image style={{ flex: 1, marginRight: 5 }} source={require('../../assets/Male_User.png')} />
                    <View style={{ flex: 6 }}>
                      <Text style={styles.modalTitle}>{selectedOutcome.option}</Text>
                      <Text style={{ fontSize: 10 }}>
                        $ {((parseFloat(selectedOutcome.percentage) / 100) * market.volume).toFixed(2)} {market.coin}
                      </Text>
                    </View>
                    <Text style={{ flex: 1, fontSize: 20 }}>{selectedOutcome.percentage}</Text>
                  </View>
                  <View style={styles.choiceContainer}>
                    <TouchableOpacity
                      style={[
                        styles.choiceButton,
                        selectedChoice === 'Yes' ? styles.activeChoice : null
                      ]}
                      onPress={() => setSelectedChoice('Yes')}
                    >
                      <Text style={styles.choiceText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.choiceButton,
                        selectedChoice === 'No' ? styles.activeChoice : null
                      ]}
                      onPress={() => setSelectedChoice('No')}
                    >
                      <Text style={styles.choiceText}>No</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.buyContainer}>
                    <View style={styles.buyHeader}>
                      <Text style={styles.buyTitle}>You're Buying</Text>
                      <Text style={styles.balance}>{amount} SOL</Text>
                      <View style={styles.valueButtons}>
                        <TouchableOpacity style={styles.valueButton}>
                          <Text style={styles.valueButtonText}>HALF</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.valueButton}>
                          <Text style={styles.valueButtonText}>MAX</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.buyBody}>
                      <View style={styles.currencySelector}>
                        <Image source={require('../../assets/Male_User.png')} style={styles.currencyIcon} />
                        <Text style={styles.currencyText}>SOL</Text>
                      </View>
                      <TextInput style={styles.amountInput} placeholder='0' keyboardType="numeric" value={amount} onChangeText={setAmount} />
                    </View>
                    <TouchableOpacity style={styles.buyButton}>
                      <Text style={styles.buyButtonText}>Buy</Text>
                    </TouchableOpacity>
                    <Text style={styles.networkFee}>Network fee: 0 SOL</Text>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </>
      }
    />
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginLeft: 0,
  },

  table: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#e6e6e6',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  tableHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    // marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    backgroundColor: '#fff',
  },
  rowText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  aboutContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
  },
  choiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  choiceButton: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d3d3d3', // Màu nền mặc định
  },
  activeChoice: {
    backgroundColor: '#007bff',  // Màu xanh cho lựa chọn Yes/No
  },
  choiceText: {
    fontSize: 16,
    color: 'white',  // Màu chữ
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { flexDirection: 'column', backgroundColor: 'white', padding: 20, borderRadius: 10, width: '100%', height: '50%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 2 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: 80,
  },
  closeButton: {
    width: 50,
    height: 5,
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 10,
  },
  buyContainer: {
    backgroundColor: '#f5f5f5',  // Light background color
    borderRadius: 10,
    padding: 20,
  },
  buyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  balance: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  valueButtons: {
    flexDirection: 'row',
  },
  valueButton: {
    backgroundColor: '#1e1e1e',
    borderRadius: 5,
    padding: 5,
    marginLeft: 5,
  },
  valueButtonText: {
    color: 'white',
    fontSize: 12,
  },
  buyBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amountInput: {
    fontSize: 16,
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  buyButton: {
    backgroundColor: '#0F1A2D',  // Green button
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  networkFee: {
    textAlign: 'center',
    color: '#a9a9a9',
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default DetailMarketScreen;