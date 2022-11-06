import React from "react";
import { Dimensions, View } from "react-native";
import { VictoryAxis, VictoryChart, VictoryLine } from "victory-native";
import { dangerColor, safeColor } from "../../configs/theme";
import { tw } from "../../utils/tailwind";

export type ChartData = {
  x: number;
  y: number;
};

export interface MiniChartProps {
  data: ChartData[];
}

const MiniLineChart = ({ data }: MiniChartProps) => {
  const { width: screenWidth } = Dimensions.get("window");
  const width = screenWidth / 5;
  const height = width / 2;
  const lastTwo = data.slice(-2);
  const color = lastTwo[1]?.y > lastTwo[0]?.y ? safeColor : dangerColor;

  return (
    <View style={tw``}>
      <VictoryChart
        width={width}
        height={height}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      >
        <VictoryLine
          data={data}
          interpolation="basis"
          style={{
            data: {
              stroke: color,
              strokeWidth: 3,
            },
          }}
          animate={{
            duration: 1000,
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
    </View>
  );
};

export default MiniLineChart;
