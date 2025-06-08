import { Card, Title, Text } from '@tremor/react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface PriceCardProps {
  title: string;
  price: number;
  unit?: 'kWh' | 'M³';
}

export function PriceCard({ title, price, unit = 'kWh' }: PriceCardProps) {
  const formattedPrice = price ? (price / 10000000).toFixed(2) : 'Geen prijs beschikbaar';

  return (
    <Card className="zonneplan-card">

      <Title className="text-[#00aa65] font-medium text-center">{title}</Title>
      <div className="mt-6 flex items-baseline justify-center">
        <span className="text-3xl font-bold text-gray-900">{formattedPrice}</span>
        <span className="text-gray-500 text-sm ml-2">/ {unit}</span>
      </div>
    </Card>
  );
}
