import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import api from "../api/registerAccountApi";
// import EventSource from 'eventsource'
const EventSource = require('rn-eventsource');

interface ChartMarketScreenProps {
  idMarket: string;
}

const ChartScreen: React.FC<ChartMarketScreenProps> = ({ idMarket }) => {
  const [ptData, setPtData] = useState<{ value: number; date: string }[]>([]);
  const [ptData2, setPtData2] = useState<{ value: number; date: string }[]>([]);


  useEffect(() => {
    // const url = 'https://dehype.api.openverse.tech/api/v1/markets/7GL9fMUzY9r6WPCvJbtbJAhNdLr1h8pNf9Je9oqjxapf/live-updates';
    const url = '';
    const es = new EventSource(url);
    es.onopen = () => {
      console.log('SSE connection opened.');
    };

    es.onmessage = (event) => {
      console.log('Received event:', event.data);
    };

    es.onerror = (error) => {
      console.error('Error:', error);
    };
    // es.addEventListener("open", () => {
    //   console.log("SSE connection opened successfully.");
    // });

    // es.addEventListener("message", (event) => {
    //   try {
    //     console.log("Raw SSE event:", event);
    //     const stat = JSON.parse(event.data);

    //     console.log("Received stat:", stat); 

    //     const yesValue = parseFloat(stat.data.find((d: any) => d.name === "Yes")?.percentage || "0");
    //     const noValue = parseFloat(stat.data.find((d: any) => d.name === "No")?.percentage || "0");
    //     const date = new Date(stat.timestamp).toLocaleDateString("en-GB", {
    //       day: "numeric",
    //       month: "short",
    //       year: "numeric",
    //     });

    //     setPtData((prev) => [...prev, { value: yesValue, date }].slice(-20));
    //     setPtData2((prev) => [...prev, { value: noValue, date }].slice(-20));
    //   } catch (error) {
    //     console.error("Error parsing SSE data:", error);
    //   }
    // });

    // es.addEventListener("error", (error) => {
    //   console.error("SSE connection error:", error);
    //   es.close();
    // });

    return () => {
      console.log("Closing SSE connection...");
      es.close();
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
