import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTheme } from "../theme/Theme-Provider";

interface BarChartProps {
  data: {
    name: string;
    orçamentos: number;
    convertidos: number;
  }[];
}

export const BarChart = ({ data }: BarChartProps) => {
  const listData = [
    {
      name: "",
      orçamentos: 0,
      convertidos: 0,
    },

    // mais dados...
  ];
  console.log("data", listData);
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  const textColor = isDarkTheme ? "#e1e1e6" : "#1a1523";
  const gridColor = isDarkTheme
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={!data.length ? listData : data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={gridColor}
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: textColor }}
          axisLine={{ stroke: gridColor }}
          tickLine={{ stroke: gridColor }}
        />
        <YAxis
          tick={{ fill: textColor }}
          axisLine={{ stroke: gridColor }}
          tickLine={{ stroke: gridColor }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDarkTheme ? "#2a2a36" : "#fff",
            borderColor: isDarkTheme ? "#3d3d4e" : "#e2e8f0",
            color: textColor,
          }}
        />
        <Legend />
        <Bar
          dataKey="orçamentos"
          name="Orçamentos"
          fill="#3AAFB9"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="convertidos"
          name="Convertidos"
          fill="#4CAF50"
          radius={[4, 4, 0, 0]}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
