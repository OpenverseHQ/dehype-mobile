import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CateFilterModal from '../components/CateFilterModal';
import { Dropdown } from 'react-native-element-dropdown';


type Category = string;
type Status = string;
type Currency = string;

const FilterScreen = ({ navigation }: any) => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Status[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency[]>([]);

  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);
  const [isCurrencyModalVisible, setCurrencyModalVisible] = useState(false);

  const [sortOption, setSortOption] = useState('Newest');

  // Hàm để thêm category mới mà không xóa những cái đã chọn trước đó
  const handleApply = (categories: string[], status?: string[], currency?: string[]) => {
    if (categories) {
      setSelectedCategories(prevCategories => {
        const updatedCategories = new Set([...prevCategories, ...categories]);
        return Array.from(updatedCategories);
      });
    }
    if (status) {
      setSelectedStatus(prevStatus => {
        const updatedStatus = new Set([...prevStatus, ...status]);
        return Array.from(updatedStatus);
      });
    }
    if (currency) {
      setSelectedCurrency(prevCurrency => {
        const updatedCurrency = new Set([...prevCurrency, ...currency]);
        return Array.from(updatedCurrency);
      });
    }
  };

  const toggleCategoryModal = () => {
    setCategoryModalVisible(!isCategoryModalVisible);
  };

  const toggleStatusModal = () => {
    setStatusModalVisible(!isStatusModalVisible);
  };

  const toggleCurrencyModal = () => {
    setCurrencyModalVisible(!isCurrencyModalVisible);
  };

  const handleSortChange = () => {
    setSortOption(sortOption === 'Newest' ? 'Oldest' : 'Newest');
  };

  const removeCategory = (categoryToRemove: string) => {
    setSelectedCategories(selectedCategories.filter(category => category !== categoryToRemove));
  };

  const removeStatus = (statusToRemove: string) => {
    setSelectedStatus(selectedStatus.filter(status => status !== statusToRemove));
  };

  const removeCurrency = (currencyToRemove: string) => {
    setSelectedCurrency(selectedCurrency.filter(currency => currency !== currencyToRemove));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filters</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.clearButton} onPress={() => {
          setSelectedCategories([]);
          setSelectedStatus([]);
          setSelectedCurrency([]);
        }}>
          <Text>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị danh sách các category đã chọn */}
      <View style={styles.selectedCategoriesContainer}>
        {selectedCategories.length > 0 || selectedStatus.length > 0 || selectedCurrency.length > 0 ? (
          // Kết hợp ba mảng vào một mảng duy nhất
          [...selectedCategories, ...selectedStatus, ...selectedCurrency].map((item, index) => (
            <View key={index} style={styles.categoryButton}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
                // Xử lý xóa theo loại
                if (selectedCategories.includes(item)) {
                  removeCategory(item);
                } else if (selectedStatus.includes(item)) {
                  removeStatus(item);
                } else if (selectedCurrency.includes(item)) {
                  removeCurrency(item);
                }
              }}>
                <Text style={styles.categoryButtonText}>{item}</Text>
                <Icon name="close-outline" size={16} color="black" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ color: '#FF8C00' }}>No categories, status, or currency selected</Text>
        )}
      </View>


      {/* Nút mở modal cho Category */}
      <TouchableOpacity style={styles.filterOption} onPress={toggleCategoryModal}>
        <Text>Category</Text>
        <Icon name="add-outline" size={20} />
      </TouchableOpacity>

      {/* Nút mở modal cho Status */}
      <TouchableOpacity style={styles.filterOption} onPress={toggleStatusModal}>
        <Text>Status</Text>
        <Icon name="add-outline" size={20} />
      </TouchableOpacity>

      {/* Nút mở modal cho Currency */}
      <TouchableOpacity style={styles.filterOption} onPress={toggleCurrencyModal}>
        <Text>Currency</Text>
        <Icon name="add-outline" size={20} />
      </TouchableOpacity>

      {/* Modal cho Category */}
      <Modal visible={isCategoryModalVisible} animationType="slide" transparent={true}>
        <CateFilterModal onApply={handleApply} onClose={toggleCategoryModal} typeFilter='Category' />
      </Modal>

      {/* Modal cho Status */}
      <Modal visible={isStatusModalVisible} animationType="slide" transparent={true}>
        <CateFilterModal onApply={handleApply} onClose={toggleStatusModal} typeFilter='Status' />
      </Modal>

      {/* Modal cho Currency */}
      <Modal visible={isCurrencyModalVisible} animationType="slide" transparent={true}>
        <CateFilterModal onApply={handleApply} onClose={toggleCurrencyModal} typeFilter='Currency' />
      </Modal>

      {/* Sort Option */}
      <TouchableOpacity style={styles.filterOption} onPress={handleSortChange}>
        <Text>Sort By: {sortOption}</Text>
        <Icon name="chevron-down-outline" size={20} />
      </TouchableOpacity>

      <View style={styles.checkboxContainer}>
        {/* Tùy chọn Liquidity */}
        {/* <Text style={styles.checkboxLabel}>Liquidity only</Text> */}
      </View>

      <TouchableOpacity
        style={styles.showMarketsButton}
        onPress={() => {
          const marketData = require('../data.json');

          console.log("Selected:", [...selectedCategories, ...selectedStatus, ...selectedCurrency]);

          const filteredMarkets = marketData.markets.filter((market: any) => {
            const isCategoryMatch = selectedCategories.length ? selectedCategories.includes(market.category) : false;
            const isStatusMatch = selectedStatus.length ? selectedStatus.includes(market.status) : false;
            const isCurrencyMatch = selectedCurrency.length ? selectedCurrency.includes(market.coin) : false;
            return isCategoryMatch || isStatusMatch || isCurrencyMatch;
          });

          const sortedMarkets = filteredMarkets.sort((a: any, b: any) => {
            const dateA = new Date(a.start_date); // chuyển đổi sang đối tượng Date
            const dateB = new Date(b.start_date);

            // Sắp xếp theo order được chọn
            return sortOption === 'Newest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
          });
          navigation.navigate('FilterResult', { filteredMarkets: sortedMarkets });
        }}
      >
        <Text style={styles.buttonText}>Show Markets</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilterScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  clearButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  showMarketsButton: {
    backgroundColor: '#4c84e6',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedCategoriesContainer: {
    marginVertical: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#d8e2ed'
  },
  categoryButtonText: {
    color: 'ccc',
    fontSize: 12,
  },
});
