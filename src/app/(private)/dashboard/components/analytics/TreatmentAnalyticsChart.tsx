import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TreatmentData {
  name: string;
  quoted: number;
  closed: number;
  conversion: number;
}

interface TreatmentAnalyticsChartProps {
  data: TreatmentData[];
}

export const TreatmentAnalyticsChart = ({
  data,
}: TreatmentAnalyticsChartProps) => {
  // Show max 5 treatments for better display
  const displayData = data.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tratamentos Mais Orçados</CardTitle>
        <CardDescription>
          Top 5 tratamentos com maiores taxas de conversão
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value: any, name: string) => {
                if (name === "conversion") {
                  // Make sure value is a number we can format
                  if (typeof value === "number") {
                    return `${value.toFixed(1)}%`;
                  }
                  if (typeof value === "string") {
                    const numValue = parseFloat(value);
                    return isNaN(numValue) ? "0%" : `${numValue.toFixed(1)}%`;
                  }
                  return "0%";
                }
                return value;
              }}
            />
            <Legend />
            <Bar dataKey="quoted" name="Orçados" fill="#8884d8" />
            <Bar dataKey="closed" name="Convertidos" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
