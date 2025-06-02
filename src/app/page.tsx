'use client';

import { useState, useEffect } from 'react';
import { PriceCard } from '@/components/PriceCard';
import { PriceChart } from '@/components/PriceChart';
import { fetchElectricityPrices, fetchGasPrices } from '@/lib/api';
import { EnergyPriceData, ApiResponse } from '@/lib/types';
import { format, addDays, subDays } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Button, Card, Title, LineChart } from '@tremor/react';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [electricityPrices, setElectricityPrices] = useState<any>(null);
  const [gasPrices, setGasPrices] = useState<any>(null);

  const now = new Date();
  const currentHour = now.getHours();

  const currentElectricityPrice = electricityPrices?.data?.data?.find((price: any) => {
    const priceDate = new Date(price.start_date_datetime);
    return priceDate.getHours() === currentHour;
  });

  const currentGasPrice = gasPrices?.data?.data?.find((price: any) => {
    const priceDate = new Date(price.start_date_datetime);
    return priceDate.toDateString() === now.toDateString();
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        console.log('Fetching data for date:', formattedDate);
        
        try {
          const [electricityData, gasData] = await Promise.all([
            fetchElectricityPrices(formattedDate),
            fetchGasPrices(formattedDate)
          ]);
          
          console.log('Raw API Response:', { electricityData, gasData });
          console.log('Electricity data structure:', JSON.stringify(electricityData, null, 2));
          console.log('Gas data structure:', JSON.stringify(gasData, null, 2));

          if (electricityData?.data?.data) {
            const filteredElectricityData = {
              data: {
                data: electricityData.data.data.filter((price: any) => {
                  const priceDate = new Date(price.start_date_datetime);
                  return priceDate.toDateString() === selectedDate.toDateString();
                })
              }
            };
            setElectricityPrices(filteredElectricityData);
          } else {
            setElectricityPrices({ data: null });
          }

          if (gasData?.data?.data) {
            const filteredGasData = {
              data: {
                data: gasData.data.data.filter((price: any) => {
                  const priceDate = new Date(price.start_date_datetime);
                  return priceDate.toDateString() === selectedDate.toDateString();
                })
              }
            };
            setGasPrices(filteredGasData);
          } else {
            setGasPrices({ data: null });
          }

        } catch (error) {
          console.error('API error:', error);
          setElectricityPrices({ data: null });
          setGasPrices({ data: null });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedDate]);

  const handlePreviousDay = () => setSelectedDate(prev => subDays(prev, 1));
  const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1));

  // Current prices are already defined above

  return (
    <main className="min-h-screen p-8">
      <div className="container-xxl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentElectricityPrice && (
            <PriceCard
              title="Huidige Elektriciteitsprijs"
              price={currentElectricityPrice.total_price_tax_included}
              timestamp={currentElectricityPrice.start_date_datetime}
            />
          )}
          {currentGasPrice && (
            <PriceCard
              title="Huidige Gasprijs"
              price={currentGasPrice.total_price_tax_included}
              timestamp={currentGasPrice.start_date_datetime}
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card>
            <Title>Elektriciteitsprijzen - {format(selectedDate, 'd MMMM yyyy', { locale: nl })}</Title>
            {electricityPrices?.data?.data?.length > 0 ? (
              <LineChart
                className="mt-6 h-72"
                data={electricityPrices.data.data.map((price: any) => ({
                  time: format(new Date(price.start_date_datetime), 'HH:mm'),
                  value: price.total_price_tax_included / 1000000
                }))}
                index="time"
                categories={['value']}
                colors={['indigo']}
                valueFormatter={(value) => `€${value.toFixed(2)}`}
                yAxisWidth={60}
                showAnimation={false}
                showLegend={false}
                style={{
                  stroke: '#4F46E5',
                  strokeWidth: 2
                }}
              />
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-500">
                No prices found for this date
              </div>
            )}
          </Card>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={handlePreviousDay}>Vorige Dag</Button>
          <Button onClick={handleNextDay}>Volgende Dag</Button>
        </div>
      </div>
    </main>
  );
}
