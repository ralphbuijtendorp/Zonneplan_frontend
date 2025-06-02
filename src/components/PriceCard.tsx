import { Card, Title, Text } from '@tremor/react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface PriceCardProps {
  title: string;
  price: number;
  unit?: 'kWh' | 'M³';
}

export function PriceCard({ title, price, unit = 'kWh' }: PriceCardProps) {
  const formattedPrice = price ? `€${(price / 10000000).toFixed(2)}/${unit}` : 'Geen prijs beschikbaar';

  return (
    <Card className="h-full">
      <Title>{title}</Title>
      <div className="mt-4">
        <Text className="text-3xl font-bold">{formattedPrice}</Text>
      </div>
    </Card>
  );
}
