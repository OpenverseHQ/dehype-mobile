import React, { useState } from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, View, Text, StyleSheet, TouchableWithoutFeedback, Alert, TouchableOpacity } from "react-native";
import CheckBox from "react-native-checkbox";
import Svg, { Line } from "react-native-svg";

const rawData = {
  marketPubKey: "7GL9fMUzY9r6WPCvJbtbJAhNdLr1h8pNf9Je9oqjxapf",
  state: "Initial data",
  stats: [
    {
      timestamp: "2024-11-21T12:07:43.405Z",
      data: [
        { name: "Yes", percentage: "80.01" },
        { name: "No", percentage: "19.99" },
        { name: "Not Sure", percentage: "0.00" },
      ],
    },
    {
      timestamp: "2024-11-21T13:22:44.464Z",
      data: [
        { name: "Yes", percentage: "80.01" },
        { name: "No", percentage: "19.99" },
        { name: "Not Sure", percentage: "0.00" },
      ],
    },
    {
      timestamp: "2024-11-21T13:22:44.464Z",
      data: [
        { name: "Yes", percentage: "75.01" },
        { name: "No", percentage: "24.99" },
        { name: "Not Sure", percentage: "0.00" },
      ],
    },
    {
      timestamp: "2024-11-21T13:22:44.464Z",
      data: [
        { name: "Yes", percentage: "60" },
        { name: "No", percentage: "40" },
        { name: "Not Sure", percentage: "0.00" },
      ],
    },
    {
      timestamp: "2024-11-21T13:22:44.464Z",
      data: [
        { name: "Yes", percentage: "60" },
        { name: "No", percentage: "40" },
        { name: "Not Sure", percentage: "0.00" },
      ],
    },    {
      timestamp: "2024-11-21T13:22:44.464Z",
      data: [
        { name: "Yes", percentage: "60" },
        { name: "No", percentage: "40" },
        { name: "Not Sure", percentage: "0.00" },
      ],
    },    {
      timestamp: "2024-11-21T13:22:44.464Z",
      data: [
        { name: "Yes", percentage: "60" },
        { name: "No", percentage: "40" },
        { name: "Not Sure", percentage: "0.00" },
      ],
    },
  ],
};

// Chuyển đổi dữ liệu
const transformData = (rawData, filters) => {
  const maxLabels = 5;
  const stats = rawData.stats || [];

  const filteredData = stats.map((stat) => ({
    time: new Date(stat.timestamp).toLocaleTimeString(),
    yes: parseFloat(stat.data.find((item) => item.name === "Yes")?.percentage || 0),
    no: parseFloat(stat.data.find((item) => item.name === "No")?.percentage || 0),
    notSure: parseFloat(stat.data.find((item) => item.name === "Not Sure")?.percentage || 0),
  }));

  const interval = Math.ceil(filteredData.length / maxLabels);

  const datasets = [];
  if (filters.Yes) {
    datasets.push({
      data: filteredData.map((item) => item.yes),
      color: () => "blue",
      strokeWidth: 2,
    });
  }
  if (filters.No) {
    datasets.push({
      data: filteredData.map((item) => item.no),
      color: () => "red",
      strokeWidth: 2,
    });
  }
  if (filters.NotSure) {
    datasets.push({
      data: filteredData.map((item) => item.notSure),
      color: () => "green",
      strokeWidth: 2,
    });
  }

  if (datasets.length === 0) { // Chart Empty => Alert Error 
    datasets.push({
      data: filteredData.map((item) => item.yes),
      color: () => "blue",
      strokeWidth: 2,
    });
    const showAlert = () => {
      Alert.alert(
        "Alert", // Tiêu đề
        "Nothing to show on chart", // Nội dung
        [
          { text: "OK", onPress: () => console.log("Đã nhấn OK") },
        ],
        { cancelable: true }
      );
    };
    showAlert() ;
  }

  return {
    labels: filteredData.map((item, index) => (index % interval === 0 ? item.time : "")),
    datasets,
    legend: [
      filters.Yes && "Yes %",
      filters.No && "No %",
      filters.NotSure && "Not Sure %",
    ].filter(Boolean),
  };
};



// Chart Screen Component 
const ChartScreen = () => {
  const [filters, setFilters] = useState({
    Yes: true,
    No: true,
    NotSure: true,
  });
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const toggleFilter = (key) => {
    const updatedFilters = { ...filters, [key]: !filters[key] };
    setFilters(updatedFilters);
  };

  const screenWidth = Dimensions.get("window").width;
  const chartHeight = 220; // Chiều cao biểu đồ
  const chartWidth = screenWidth - 32; // Giảm padding

  const handlePress = (event) => {
    const { locationX } = event.nativeEvent;
  
    // Tính khoảng cách giữa các điểm dữ liệu
    const step = chartWidth / rawData.stats.length;
  
    // Xác định index từ vị trí nhấn
    const index = Math.floor(locationX / step);
  
    // Đảm bảo index nằm trong phạm vi hợp lệ
    if (index >= 0 && index < rawData.stats.length) {
      const point = rawData.stats[index];
      setSelectedIndex(index); // Cập nhật chỉ số điểm
      setSelectedPoint({
        time: new Date(point.timestamp).toLocaleTimeString(),
        yes: parseFloat(point.data.find((item) => item.name === "Yes")?.percentage || "0"),
        no: parseFloat(point.data.find((item) => item.name === "No")?.percentage || "0"),
        notSure: parseFloat(point.data.find((item) => item.name === "Not Sure")?.percentage || "0"),
      });
    } else {
      setSelectedPoint(null); // Xóa thông tin nếu không có điểm nào được chọn
      setSelectedIndex(null);
    }
  };

  const chartData = transformData(rawData, filters);

  const renderDotContent = ({ x, y, index, indexData }) => {
    if (index === selectedIndex) {
      return (
        <View style={{
          position: "absolute",
          top: y+11, // Điều chỉnh vị trí của text
          left: x - 10, // Điều chỉnh vị trí của text
          borderWidth:1,   borderRadius:5,  borderColor:"white" ,
          backgroundColor:'white',
          
        }}>
          <Text
            style={styles.dotContent}
          >
            {indexData}
          </Text>
        </View>
      );
    }

    return (
      <Text></Text>
    );
  };


  return (
    <View style={{marginTop:20}}>

      <View style={styles.checkboxContainer}>
      <TouchableOpacity
        style={[styles.checkbox, filters.Yes && styles.checked]}
        onPress={() => toggleFilter("Yes")}
      >
        <Text style={styles.checkboxLabel}>Yes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.checkbox, filters.No && styles.checked]}
        onPress={() => toggleFilter("No")}
      >
        <Text style={styles.checkboxLabel}>No</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.checkbox, filters.NotSure && styles.checked]}
        onPress={() => toggleFilter("NotSure")}
      >
        <Text style={styles.checkboxLabel}>Not Sure</Text>
      </TouchableOpacity>
    </View>

      <TouchableWithoutFeedback onPress={handlePress}>
        <View>
          <LineChart
            data={chartData}
            width={screenWidth}
            height={chartHeight}
            withDots={true}
            getDotProps={(value, index) => ({
              r: 1, // Kích thước của dot
            })}
            renderDotContent={renderDotContent}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
                backgroundColor: "#ffffff", // Đảm bảo màu nền là trắng
              },
              propsForBackgroundLines: {
                stroke: "transparent",
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />

        </View>
      </TouchableWithoutFeedback>

      {selectedPoint && (
        <View style={styles.infoBox}>
          <Text>Time: {selectedPoint.time}</Text>
          <Text>Yes: {selectedPoint.yes}%</Text>
          <Text>No: {selectedPoint.no}%</Text>
          <Text>Not Sure: {selectedPoint.notSure}%</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dotContent: {
    color: "red", // Màu đỏ cho điểm được làm nổi bật
    fontWeight: "bold",
    fontSize: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  infoBox: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },








  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 10,
    width: 80,
    justifyContent: "center",
  },
  checkboxLabel: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },
  checked: {
    backgroundColor: "#4CAF50", // Màu nền khi chọn
  },
});

export default ChartScreen;
