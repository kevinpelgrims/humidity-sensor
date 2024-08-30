import {ChartData} from "@/models";
import moment from "moment";
import {Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis} from "recharts";

interface SensorWeatherChartProps {
  data?: ChartData[] | null;
}

function SensorWeatherChart({data}: SensorWeatherChartProps) {
  if (data) {
    return (
      <>
        <h2 className="text-2xl font-semibold mb-4">Humidity + Precipitation Chart</h2>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="timestamp" tickFormatter={(timestamp) => moment(timestamp).format("HH:mm")}/>
            <Tooltip
              labelFormatter={(value) =>  moment(value).format("DD/MM HH:mm:ss")}
              formatter={(value, name) => [value, name === 'humidity' ? 'Humidity (%)' : 'Precipitation (mm)']}
            />
            <Legend/>
            <Bar yAxisId="right" dataKey="precipitation" fill="#82ca9d" name="Precipitation"/>
            <Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#8884d8" name="humidity"/>
          </ComposedChart>
        </ResponsiveContainer>
      </>
    );
  } else return null;
}

export default SensorWeatherChart;
