import { Card, Text, Title } from '@tremor/react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface PriceCardProps {
  title: string;
  price: number;
}

export function PriceCard({ title, price }: PriceCardProps) {
  const formattedPrice = price ? `€${(price / 100000).toFixed(2)}/kWh` : 'Geen prijs beschikbaar';

  return (
    <Card className="h-full">
      <Title>{title}</Title>
      <div className="mt-4">
        <Text className="text-3xl font-bold">{formattedPrice}</Text>
      </div>
    </Card>
  );
}
