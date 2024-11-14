import React from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, View, Text } from "react-native";


const data = [
  { datetime: "2024-11-01T10:00:00", yes: 55, no: 45 },
  { datetime: "2024-11-01T11:00:00", yes: 60, no: 40 },
  { datetime: "2024-11-01T12:00:00", yes: 58, no: 42 },
  // Thêm dữ liệu khác
];


// Định dạng dữ liệu cho biểu đồ
const transformData = (data) => {
  return {
    labels: data.map((item) => new Date(item.datetime).toLocaleTimeString()), // Giờ
    datasets: [
      {
        data: data.map((item) => item.yes),
        color: () => "blue", // Màu cho Yes
        strokeWidth: 2,
      },
      {
        data: data.map((item) => item.no),
        color: () => "red", // Màu cho No
        strokeWidth: 2,
      },
    ],
    legend: ["Yes %", "No %"], // Chú thích
  };
};

const ChartScreen = () => {
  const chartData = transformData(data);
  const screenWidth = Dimensions.get("window").width;

  return (
    <View>
      <Text style={{ textAlign: "center", fontSize: 18, marginVertical: 10 }}>
        Yes and No Percentage Over Time
      </Text>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 2, // Làm tròn dữ liệu
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default ChartScreen;
