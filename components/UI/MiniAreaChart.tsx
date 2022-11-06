import React from "react";
import { Dimensions, View } from "react-native";
import Svg, { Defs, LinearGradient, Stop } from "react-native-svg";
import { VictoryArea, VictoryAxis, VictoryChart } from "victory-native";
import { tw } from "../../utils/tailwind";

export type ChartData = {
  x: number;
  y: number;
};

export interface MiniChartProps {
  data: ChartData[];
}

const MiniAreaChart = ({ data }: MiniChartProps) => {
  const { width: screenWidth } = Dimensions.get("window");
  const width = screenWidth / 3;
  const height = (width * 2) / 3;
  const lastTwo = data.slice(-2);

  const color = lastTwo[1]?.y > lastTwo[0]?.y ? "#22C36B" : "#F65556";
  const maxY = Math.max(...data.map((item) => item.y));
  const minY = Math.min(...data.map((item) => item.y));
  //

  return (
    <View style={tw`w-100`}>
      <Svg style={{ height: height, width: width }}>
        <VictoryChart
          width={width}
          height={height}
          maxDomain={{ y: maxY }}
          minDomain={{ y: minY }}
          padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
        >
          <Defs>
            <LinearGradient id="gradientFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={color} />
              <Stop offset="100%" stopColor="#ffffff00" />
            </LinearGradient>
          </Defs>
          <VictoryArea
            data={data}
            interpolation="natural"
            style={{
              data: {
                stroke: color,
                strokeWidth: 3,
                fill: "url(#gradientFill)",
              },
            }}
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
          />
          <VictoryAxis
            style={{
              axis: { stroke: "transparent" },
              ticks: { stroke: "transparent" },
              tickLabels: { fill: "transparent" },
            }}
          />
        </VictoryChart>
      </Svg>
    </View>
  );
};

export default MiniAreaChart;
