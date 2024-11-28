import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CateFilterModal from '../components/CateFilterModal';
import api from '../api/registerAccountApi';

type Category = string;
type Status = string;
type Currency = string;

const FilterScreen = ({ navigation }: any) => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Status[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency[]>([]);
  const [favourites, setfavourites] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);
  const [isCurrencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const [sortOption, setSortOption] = useState('Newest');

  // Hàm để thêm category mới mà không xóa những cái đã chọn trước đó
  const handleApply = (categories: { id: string; name: string }[], status?: string[], currency?: string[]) => {
    if (categories) {
      setSelectedCategories(prevCategories => {
        // Chỉ lưu trữ ID thay vì toàn bộ đối tượng hoặc tên
        const updatedCategories = new Set([
          ...prevCategories,
          ...categories.map((category) => category.id), // Chỉ lưu ID của categories
        ]);
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

  const fetchFilteredMarkets = async () => {
    try {
      // Chuyển các danh mục đã chọn thành chuỗi phân cách bằng dấu phẩy
      const categoryQuery = selectedCategories.join(','); // Ví dụ: '1,2,5'

      // Tạo query string
      const queryParams = `c=${categoryQuery}&fav=${favourites}`;

      // Gửi yêu cầu API
      const response = await api.get(`/search/details?${queryParams}`);

      // Trả về dữ liệu
      return response.data;
    } catch (error) {
      console.error('Lỗi khi fetch dữ liệu từ API:', error);
      return [];
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

      <View style={styles.filterContainer}>
        <Text>Favourite</Text>
        <Switch value={favourites} onValueChange={setfavourites} />
      </View>

      <TouchableOpacity
        style={styles.showMarketsButton}
        onPress={async () => {
          setLoading(true); // Bắt đầu trạng thái loading
          setError(null);  // Reset lỗi

          try {
            const filteredMarkets = await fetchFilteredMarkets();

            // Điều hướng sang màn hình kết quả cùng dữ liệu đã lọc
            navigation.navigate('FilterResult', { filteredMarkets });
          } catch (error) {
            setError('Có lỗi xảy ra khi lấy dữ liệu từ API.');
          } finally {
            setLoading(false); // Kết thúc trạng thái loading
          }
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
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
