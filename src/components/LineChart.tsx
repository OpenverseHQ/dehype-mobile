import { LineChart } from "react-native-gifted-charts";
        
const Chart = () => {
    const data = [{value: 15}, {value: 30}, {value: 26}, {value: 40}];
    return (
        <LineChart
        areaChart
        data={data}
        startFillColor="rgb(46, 217, 255)"
        startOpacity={0.8}
        endFillColor="rgb(203, 241, 250)"
        endOpacity={0.3}
        />
    );
};

export default Chart;
