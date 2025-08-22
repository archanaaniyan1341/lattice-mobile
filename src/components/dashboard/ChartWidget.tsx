import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Widget } from "../../types";
import { MaterialIcons } from "@expo/vector-icons";

interface ChartWidgetProps {
  widget: Widget;
  onDelete: () => void;
}

const ChartWidget: React.FC<ChartWidgetProps> = ({ widget, onDelete }) => {
  const screenWidth = Dimensions.get("window").width - 32; // Subtract padding

  const renderChart = () => {
    const chartConfig = {
      backgroundGradientFrom: "#FFFFFF",
      backgroundGradientTo: "#FFFFFF",
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#007AFF",
      },
    };

    switch (widget.type) {
      case "lineChart":
        return (
          <LineChart
            data={widget.data}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        );
      case "barChart":
        return (
          <BarChart
            data={widget.data}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisLabel={""}
            yAxisSuffix={""}
          />
        );
      case "pieChart":
        return (
          <PieChart
            data={widget.data.datasets[0].data.map((value, index) => ({
              name: widget.data.labels[index],
              population: value,
              color: `rgba(0, 122, 255, ${0.7 + index * 0.1})`,
              legendFontColor: "#7F7F7F",
              legendFontSize: 12,
            }))}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
            absolute
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{widget.title}</Text>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <MaterialIcons name="close" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
      {renderChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 4,
  },
  chart: {
    borderRadius: 8,
  },
});

export default ChartWidget;
