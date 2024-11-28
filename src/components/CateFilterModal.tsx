import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../api/registerAccountApi';
type Category = string;
type Status = string;
type Currency = string;

const CateFilterModal = ({
    onApply,
    onClose,
    typeFilter,
}: {
    onApply: (categories: Category[], status?: Status[], currency?: Currency[]) => void;
    onClose: () => void;
    typeFilter: string;
}) => {
    const [categories, setCategories] = useState<Category[][]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<Status[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<Currency[]>([]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/category');
            const categoryData = response.data;

            if (Array.isArray(categoryData)) {
                const groupedCategories: Category[][] = [];
                const groupSize = 2; // Số danh mục trên mỗi hàng

                for (let i = 0; i < categoryData.length; i += groupSize) {
                    const group = categoryData.slice(i, i + groupSize).map(item => item.name);
                    groupedCategories.push(group);
                }

                setCategories(groupedCategories); // Lưu vào state
            } else {
                console.error('API không trả về đúng định dạng mảng:', categoryData);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách category:', error);
        }
    };


    useEffect(() => {
        if (typeFilter === 'Category') {
            fetchCategories();
        } else if (typeFilter === 'Status') {
            setCategories([
                ['Proposed', 'Active'],
                ['Closed', 'Resolved'],
                ['Reported', 'Disputed'],
            ]);
        } else if (typeFilter === 'Currency') {
            setCategories([
                ['ZTG', 'EUR'],
                ['SOL', 'USDCS'],
            ]);
        }
    }, [typeFilter]);
    const toggleSelection = (item: string) => {
        if (typeFilter === 'Category') {
            if (selectedCategories.includes(item)) {
                setSelectedCategories(selectedCategories.filter((category) => category !== item));
            } else {
                setSelectedCategories([...selectedCategories, item]);
            }
        } else if (typeFilter === 'Status') {
            if (selectedStatus.includes(item)) {
                setSelectedStatus(selectedStatus.filter((status) => status !== item));
            } else {
                setSelectedStatus([...selectedStatus, item]);
            }
        } else if (typeFilter === 'Currency') {
            if (selectedCurrency.includes(item)) {
                setSelectedCurrency(selectedCurrency.filter((currency) => currency !== item));
            } else {
                setSelectedCurrency([...selectedCurrency, item]);
            }
        }
    };

    return (
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.categoryContainer}>
                    <Text style={styles.categoryTitle}>{typeFilter}</Text>
                    <View style={styles.categories}>
                        {categories.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.categoryRow}>
                                {row.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.categoryButton}
                                        onPress={() => toggleSelection(item)}
                                    >
                                        <Text
                                            style={[
                                                styles.categoryText,
                                                (typeFilter === 'Category' && selectedCategories.includes(item)) ||
                                                    (typeFilter === 'Status' && selectedStatus.includes(item)) ||
                                                    (typeFilter === 'Currency' && selectedCurrency.includes(item))
                                                    ? styles.selectedCategoryText
                                                    : {},
                                            ]}
                                        >
                                            {item}
                                            {(typeFilter === 'Category' && selectedCategories.includes(item)) ||
                                                (typeFilter === 'Status' && selectedStatus.includes(item)) ||
                                                (typeFilter === 'Currency' && selectedCurrency.includes(item))
                                                ? ' ✕'
                                                : ''}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => {
                        if (typeFilter === 'Category') {
                            onApply(selectedCategories);
                        } else if (typeFilter === 'Status') {
                            onApply([], selectedStatus);
                        } else if (typeFilter === 'Currency') {
                            onApply([], [], selectedCurrency);
                        }
                        onClose(); // Đóng modal
                    }}
                >
                    <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CateFilterModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end', // Đặt modal ở phía dưới
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Hiệu ứng nền trong suốt
    },
    modalContent: {
        height: '50%', // Modal chiếm một nửa chiều cao màn hình
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    header: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    backButton: {
        fontSize: 16,
        color: '#000',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    closeButton: {
        fontSize: 24,
        color: '#000',
    },
    categoryContainer: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    categories: {
        flex: 1,
    },
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    categoryButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 5,
    },
    categoryText: {
        fontSize: 16,
        color: '#000',
    },
    selectedCategoryText: {
        color: '#1e90ff',
    },
    applyButton: {
        backgroundColor: '#1e90ff',
        borderRadius: 25,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});