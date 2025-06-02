import { Card, Text, Title } from '@tremor/react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface PriceCardProps {
  title: string;
  price: number;
  timestamp: string;
}

export function PriceCard({ title, price, timestamp }: PriceCardProps) {
  const formattedPrice = price ? `€${(price / 100000).toFixed(2)}/kWh` : 'Geen prijs beschikbaar';
  const formattedTime = timestamp ? format(new Date(timestamp), 'HH:mm', { locale: nl }) : 'onbekend';

  return (
    <Card className="h-full">
      <Title>{title}</Title>
      <div className="mt-4">
        <Text className="text-3xl font-bold">{formattedPrice}</Text>
      </div>
      <Text className="text-sm text-gray-500 mt-4">
        Bijgewerkt om {formattedTime}
      </Text>
    </Card>
  );
}
