import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import api from "../api/registerAccountApi";
import EventSource, { EventSourceListener } from "react-native-sse";

interface ChartMarketScreenProps {
  idMarket: string;
}

const ChartScreen: React.FC<ChartMarketScreenProps> = ({ idMarket }) => {
  const [ptData, setPtData] = useState<{ value: number; date: string }[]>([]);
  const [ptData2, setPtData2] = useState<{ value: number; date: string }[]>([]);

  const fetchData = async (isFirstTimeConnect = false) => {
    try {
      const url = isFirstTimeConnect
        ? "http://192.168.1.7:8080/api/v1/markets/7GL9fMUzY9r6WPCvJbtbJAhNdLr1h8pNf9Je9oqjxapf/stats-updates?init=true"
        : "http://192.168.1.7:8080/api/v1/markets/7GL9fMUzY9r6WPCvJbtbJAhNdLr1h8pNf9Je9oqjxapf/stats-updates?init=false";

      console.log(isFirstTimeConnect ? "First time connect" : "Polling data");
      const response = await fetch(url);
      const result = await response.json();
      console.log("Data fetched:", result[0].data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(fetchData, 1000 * 20); // Poll every 20 seconds
    return () => {
      console.log("Clearing interval");
      clearInterval(interval);
    };
  }, [idMarket]);

  return (
    <View
      style={{
        paddingVertical: 20,
        paddingLeft: 10,
        backgroundColor: "#fff",
      }}
    >
      <LineChart
        areaChart
        data={ptData}
        data2={ptData2}
        rotateLabel
        width={320}
        hideDataPoints
        spacing={10}
        color="green"
        color2="red"
        thickness={2}
        startOpacity={0}
        endOpacity={0}
        initialSpacing={0}
        noOfSections={6}
        maxValue={100}
        yAxisColor="white"
        yAxisThickness={0}
        rulesType="dashed"
        rulesColor="gray"
        yAxisTextStyle={{ color: "gray" }}
        xAxisColor="lightgray"
        pointerConfig={{
          pointerStripHeight: 160,
          pointerStripColor: "lightgray",
          pointerStripWidth: 2,
          pointerColor: "lightgray",
          radius: 6,
          pointerLabelWidth: 100,
          pointerLabelHeight: 90,
          activatePointersOnLongPress: true,
          autoAdjustPointerLabelPosition: false,
          pointerLabelComponent: (items) => {
            return (
              <View
                style={{
                  height: 90,
                  width: 100,
                  justifyContent: "center",
                  marginTop: -20,
                  marginLeft: -40,
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 14,
                    marginBottom: 6,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {items[0].date}
                </Text>

                <View
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 16,
                    backgroundColor: "black",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    {items[0].value + "%"}
                  </Text>
                </View>
              </View>
            );
          },
        }}
      />
    </View>
  );
};

export default ChartScreen;
