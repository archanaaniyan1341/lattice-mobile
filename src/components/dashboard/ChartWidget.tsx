import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Widget } from "../../types";
import { MaterialIcons } from "@expo/vector-icons";
import { 
  CandlestickChart, 
  LineChart as WagmiLineChart, 
} from "react-native-wagmi-charts";

interface ChartWidgetProps {
  widget: Widget;
  onDelete: () => void;
}

interface TooltipProps {
  visible: boolean;
  value: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

const Tooltip: React.FC<TooltipProps> = ({ visible, value, label, x, y, color }) => {
  if (!visible) return null;

  return (
    <View style={[styles.tooltip, { top: y - 50, left: x - 40 }]}>
      <Text style={styles.tooltipText}>{label}</Text>
      <Text style={[styles.tooltipText, { color }]}>{value}</Text>
    </View>
  );
};

const ChartWidget: React.FC<ChartWidgetProps> = ({ widget, onDelete }) => {
  const { width: windowWidth } = useWindowDimensions();
  const chartWidth = windowWidth - 48;
  const [tooltip, setTooltip] = useState({
    visible: false,
    value: "",
    label: "",
    x: 0,
    y: 0,
    color: "#836cc7"
  });

  const handleDataPointClick = (data: any) => {
    if (data && data.value !== undefined) {
      setTooltip({
        visible: true,
        value: data.value.toString(),
        label: data.dataset?.label || widget.data.labels[data.index] || `Item ${data.index + 1}`,
        x: data.x,
        y: data.y,
        color: data.dataset?.color?.(1) || "#836cc7"
      });
      
      setTimeout(() => {
        setTooltip(prev => ({ ...prev, visible: false }));
      }, 3000);
    }
  };

  const handleBarChartClick = (data: any, index: number) => {
    const value = widget.data.datasets[0].data[index];
    const label = widget.data.labels[index] || `Item ${index + 1}`;
    
    const barWidth = (chartWidth - 30) / widget.data.labels.length;
    const x = index * barWidth + barWidth / 2;
    const y = 200 - (value / Math.max(...widget.data.datasets[0].data)) * 180;
    
    setTooltip({
      visible: true,
      value: value.toString(),
      label: label,
      x: x,
      y: y,
      color: widget.data.datasets[0].color?.(1) || "#836cc7"
    });
    
    setTimeout(() => {
      setTooltip(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handlePieChartClick = (data: any, index: number) => {
    const value = widget.data.datasets[0].data[index];
    const label = widget.data.labels[index] || `Item ${index + 1}`;
    
    const angle = (index / widget.data.datasets[0].data.length) * 2 * Math.PI;
    const x = chartWidth / 2 + Math.cos(angle) * 70;
    const y = 110 + Math.sin(angle) * 70;
    
    setTooltip({
      visible: true,
      value: value.toString(),
      label: label,
      x: x,
      y: y,
      color: `rgba(0, 122, 255, ${0.7 + index * 0.1})`
    });
    
    setTimeout(() => {
      setTooltip(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Format data for wagmi charts
  // const formatWagmiData = () => {
  //   if (!widget.data.candleData) return [];
    
  //   return widget.data.candleData.map((candle, index) => ({
  //     timestamp: index,
  //     open: candle.open,
  //     high: candle.high,
  //     low: candle.low,
  //     close: candle.close,
  //   }));
  // };

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
        stroke: "#836cc7",
      },
      propsForLabels: {
        fontSize: 10,
      },
    };

    switch (widget.type) {
      case "lineChart":
        return (
          <View style={styles.chartContainer}>
            <LineChart
              data={widget.data}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              fromZero={true}
              onDataPointClick={handleDataPointClick}
              decorator={() => (
                tooltip.visible && (
                  <View style={[styles.customTooltip, { top: tooltip.y - 40, left: tooltip.x - 30 }]}>
                    <Text style={styles.tooltipLabel}>{tooltip.label}</Text>
                    <Text style={[styles.tooltipValue, { color: tooltip.color }]}>
                      {tooltip.value}
                    </Text>
                  </View>
                )
              )}
            />
          </View>
        );
      case "barChart":
        return (
          <View style={styles.chartContainer}>
            <BarChart
              data={widget.data}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisLabel=""
              yAxisSuffix=""
              fromZero={true}
            />
            <View style={styles.barChartOverlay}>
              {widget.data.labels.map((_, index) => {
                const barWidth = (chartWidth - 30) / widget.data.labels.length;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.barTouchArea,
                      {
                        width: barWidth,
                        left: index * barWidth,
                      }
                    ]}
                    onPress={() => handleBarChartClick(null, index)}
                  />
                );
              })}
            </View>
            {tooltip.visible && (
              <View style={[styles.customTooltip, { top: tooltip.y - 40, left: tooltip.x - 30 }]}>
                <Text style={styles.tooltipLabel}>{tooltip.label}</Text>
                <Text style={[styles.tooltipValue, { color: tooltip.color }]}>
                  {tooltip.value}
                </Text>
              </View>
            )}
          </View>
        );
      case "pieChart":
        return (
          <View style={styles.chartContainer}>
            <PieChart
              data={widget.data.datasets[0].data.map((value, index) => ({
                name: widget.data.labels[index] || `Item ${index + 1}`,
                population: value,
                color: `rgba(0, 122, 255, ${0.7 + index * 0.1})`,
                legendFontColor: "#7F7F7F",
                legendFontSize: 10,
              }))}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              style={styles.chart}
              absolute
            />
            {tooltip.visible && (
              <View style={[styles.customTooltip, { top: tooltip.y - 40, left: tooltip.x - 30 }]}>
                <Text style={styles.tooltipLabel}>{tooltip.label}</Text>
                <Text style={[styles.tooltipValue, { color: tooltip.color }]}>
                  {tooltip.value}
                </Text>
              </View>
            )}
            <View style={styles.pieChartInstructions}>
              <Text style={styles.pieChartInstructionsText}>
                Tap on the chart segments to see values
              </Text>
            </View>
            <View style={styles.pieChartOverlay}>
              {widget.data.datasets[0].data.map((_, index) => {
                const segmentAngle = 360 / widget.data.datasets[0].data.length;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pieSegment,
                      {
                        transform: [
                          { rotate: `${index * segmentAngle}deg` },
                          { skewY: `${90 - segmentAngle / 2}deg` }
                        ]
                      }
                    ]}
                    onPress={() => handlePieChartClick(null, index)}
                  />
                );
              })}
            </View>
          </View>
        );
      // case "candlestickChart":
      //   const wagmiData = formatWagmiData();
      //   return (
      //     <View style={styles.chartContainer}>
      //       <CandlestickChart.Provider data={wagmiData}>
      //         <CandlestickChart width={chartWidth} height={220}>
      //           <CandlestickChart.Candles />
      //           <CandlestickChart.Crosshair>
      //             <CandlestickChart.Tooltip />
      //           </CandlestickChart.Crosshair>
      //         </CandlestickChart>
      //       </CandlestickChart.Provider>
      //     </View>
      //   );
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
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
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
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: 'relative',
  },
  chart: {
    borderRadius: 8,
    marginLeft: -16,
  },
  customTooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    maxWidth: 120,
    zIndex: 1000,
  },
  tooltipLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tooltipValue: {
    color: '#836cc7',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 8,
    borderRadius: 4,
    zIndex: 1000,
  },
  tooltipText: {
    color: 'white',
    fontSize: 12,
  },
  barChartOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  barTouchArea: {
    height: '100%',
    backgroundColor: 'transparent',
  },
  pieChartInstructions: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  pieChartInstructionsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  pieChartOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 100,
    overflow: 'hidden',
  },
  pieSegment: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: '50%',
    height: '100%',
    backgroundColor: 'transparent',
    transformOrigin: '0% 50%',
  },
});

export default ChartWidget;