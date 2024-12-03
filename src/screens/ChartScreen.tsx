import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, Switch, Alert, StyleSheet, ScrollView } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import Icon from 'react-native-vector-icons/Ionicons';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from "react-native-popup-menu";


const screenWidth = Dimensions.get('window').width;

interface ChartMarketScreenProps {
  idMarket: string;
}

const ChartScreen: React.FC<ChartMarketScreenProps> = ({ idMarket }) => {
  const [chartData, setChartData] = useState<{ [key: string]: { value: number; date: string }[] }>({});
  const [visibleKeys, setVisibleKeys] = useState<{ [key: string]: boolean }>({});
  const [grid, setGrid] = useState(false);
  const [color, setColor] = useState(false);


  const fetchData = async (isFirstTimeConnect = false) => {
    try {
      const url = isFirstTimeConnect
        ? `https://dehype.api.openverse.tech/api/v1/markets/${idMarket}/stats-updates?init=true`
        : `https://dehype.api.openverse.tech/api/v1/markets/${idMarket}/stats-updates?init=false`;

      // console.log(isFirstTimeConnect ? "First time connect" : "Polling data");

      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return;
      }

      const result = await response.json();
      // console.log("Data fetched:", result);

      // Create a new chartData object by merging old and new data
      setChartData((prevChartData) => {
        const updatedChartData = { ...prevChartData };

        result.forEach((item: any) => {

          const timestamp = new Date(item.timestamp).toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          item.data.forEach((entry: any) => {
            const name = entry.name;
            const value = parseFloat(entry.percentage);

            // Initialize array for new choice if not exist
            if (!updatedChartData[name]) {
              updatedChartData[name] = [];
            }

            // Avoid duplicate entries by comparing timestamps
            if (!updatedChartData[name].some((data) => data.date === timestamp)) {
              updatedChartData[name].push({ value, date: timestamp });
            }

            // Keep only the last 100 entries
            // if (updatedChartData[name].length > 100) {
            //   updatedChartData[name].shift();  // Remove the oldest entry if there are more than 100
            // }
          });
        });
        return updatedChartData;
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  useEffect(() => {
    fetchData(true);
    const interval = setInterval(fetchData, 1000 * 20);
    return () => {
      console.log("Clearing interval");
      clearInterval(interval);
    };
  }, [idMarket]);


  useEffect(() => {
    setVisibleKeys((prevVisibleKeys) => {
      const updatedKeys = { ...prevVisibleKeys };
      Object.keys(chartData).forEach((key) => {
        if (!(key in updatedKeys)) {
          updatedKeys[key] = true;
        }
      });
      return updatedKeys;
    });
  }, [chartData]);

  const toggleKeyVisibility = (key: string) => {
    setVisibleKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredChartData = Object.keys(chartData)
    .filter((key) => visibleKeys[key])
    .reduce((acc, key) => {
      acc[key] = chartData[key];
      return acc;
    }, {});

  // const firstKey = Object.keys(chartData)[0]; // Lấy key đầu tiên
  // const firstValue = chartData[firstKey]; // Lấy giá trị của key đầu tiên

  return (
    <MenuProvider>

      <View
        style={{
          paddingVertical: 20,
          backgroundColor: "#fff",
        }}
      >
        <LineChart
          areaChart
          data={filteredChartData[Object.keys(filteredChartData)[0]]}
          data2={filteredChartData[Object.keys(filteredChartData)[1]]}
          data3={filteredChartData[Object.keys(filteredChartData)[2]]}
          data4={filteredChartData[Object.keys(filteredChartData)[3]]}
          color1="red"
          color2="green"
          rotateLabel
          width={screenWidth * 0.8}
          hideDataPoints
          spacing={10}
          thickness={2}
          startFillColor2="rgba(20,105,81,0.3)"
          endFillColor2="rgba(20,85,81,0.01)"
          startFillColor="rgba(255, 0, 0, 0.3)"
          endFillColor="rgba(255, 0, 0, 0.01)"
          startOpacity={color ? 0.7 : 0}
          endOpacity={color ? 0.2 : 0}
          initialSpacing={0}
          noOfSections={6}
          maxValue={100}
          yAxisColor="lightgray"
          yAxisThickness={0}
          rulesType='dashed'
          hideRules={grid}
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
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: -10,
                    marginLeft: -40,
                  }}
                >
                  {items.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        height: 90,
                        width: 100,
                        justifyContent: "center",
                        marginBottom: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontSize: 10,
                          marginBottom: 6,
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {item.date}
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: 1,
                          paddingVertical: 6,
                          borderRadius: 16,
                          backgroundColor: index % 2 === 0 ? "red" : "green",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            textAlign: "center",
                            color: "white",
                            fontSize:10
                          }}
                        >
                          {item.value + "%"}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              );
            },
          }}

        />


        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: 10 }}>
          <Menu style={{ marginRight: 10 }}>
            <MenuTrigger>
              <Icon size={18} name="options-outline" />
            </MenuTrigger>
            <MenuOptions customStyles={{ optionsContainer: styles.menu }}>
              {Object.keys(chartData).map((key, index) => (
                <MenuOption
                  key={index}
                  style={styles.menuOption}
                  onSelect={() => Alert.alert(`Selected: ${key}`)} // Thay đổi hành động nếu cần
                >
                  <Text style={styles.menuOptionText}>{key}</Text>
                  <Switch value={visibleKeys[key] ?? true} onValueChange={() => toggleKeyVisibility(key)} />
                </MenuOption>
              ))}
            </MenuOptions>

          </Menu>

          {/* Menu for Settings */}
          <Menu>
            <MenuTrigger>
              <Icon size={18} name="settings-outline" />
            </MenuTrigger>
            <MenuOptions customStyles={{ optionsContainer: styles.menu }}>
              <MenuOption style={styles.menuOption} onSelect={() => Alert.alert("Setting 1 toggled")}>
                <Text style={styles.menuOptionText}>Hide Grid</Text>
                <Switch value={grid} onValueChange={setGrid} />
              </MenuOption>
              <MenuOption style={styles.menuOption} onSelect={() => Alert.alert("Setting 2 toggled")}>
                <Text style={styles.menuOptionText}>Color</Text>
                <Switch value={color} onValueChange={setColor} />
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      </View>
    </MenuProvider>

  );
};
const styles = StyleSheet.create({
  menuOptionText: {
    fontSize: 16,
    padding: 10,
    color: "#000",
  },
  menu: {
    width: 150,
    borderRadius: 10,
    margin: 3
  },
  menuOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Giảm chiều rộng menu
    backgroundColor: "#fff", // Màu nền menu
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,

  }
});
export default ChartScreen;
