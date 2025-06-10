import { Card, LineChart, Title } from '@tremor/react';
import { EnergyPriceData, ApiResponse } from '@/lib/types';
import { format } from 'date-fns';
import { nl } from "date-fns/locale";

interface PriceChartProps {
  data: ApiResponse<EnergyPriceData>;
  date: Date;
  title: string;
}

type ChartDataPoint = {
  time: string;
  value: number;
};

export function PriceChart({ data, date, title }: PriceChartProps) {
  console.log('PriceChart received data:', JSON.stringify(data, null, 2));
  const dateStr = format(date, 'd MMMM yyyy', { locale: nl });
  if (!data?.data?.data) {
    return (
      <Card className="zonneplan-card">
        <div className="w-full h-full">
          <Title className="text-[#00aa65] font-medium text-center mb-4">{title} - {dateStr}</Title>
          <div className="h-72 flex items-center justify-center text-gray-500">
            Geen prijzen beschikbaar
          </div>
        </div>
      </Card>
    );
  }

  const chartData: ChartDataPoint[] = data.data.data.map((price: EnergyPriceData) => {
    console.log('Processing price data:', price);
    const datetime = new Date(price.start_date_datetime);
    return {
      time: format(datetime, 'HH:mm'),
      value: price.total_price_tax_included / 1000000
    };
  }).sort((a: ChartDataPoint, b: ChartDataPoint) => {
    // Sort by time to ensure correct line chart
    const [aHour, aMinute] = a.time.split(':').map(Number);
    const [bHour, bMinute] = b.time.split(':').map(Number);
    return (aHour * 60 + aMinute) - (bHour * 60 + bMinute);
  });

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded shadow">
          <p>Tijd: {payload[0].payload.time}</p>
          <p>Prijs: €{(payload[0].payload.value).toFixed(2)}/kWh</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="zonneplan-card">
      <Title className="text-[#00aa65] font-medium text-center mb-4">{title} - {dateStr}</Title>
      <LineChart
        className="h-72"
        data={chartData}
        index="time"
        categories={['value']}
        colors={['#00aa65']}
        valueFormatter={(value) => `€${value.toFixed(2)}`}
        yAxisWidth={60}
        showAnimation={true}
        showLegend={false}
        curveType="natural"
        customTooltip={customTooltip}
      />
    </Card>
  );
}
