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
  const [currentPrices, setCurrentPrices] = useState<{
    electricity: any;
    gas: any;
  }>({ electricity: null, gas: null });

  const now = new Date();
  const currentHour = now.getHours();

  // Fetch current prices once when page loads
  useEffect(() => {
    const fetchCurrentPrices = async () => {
      try {
        const todayFormatted = format(now, 'yyyy-MM-dd');
        const [electricityData, gasData] = await Promise.all([
          fetchElectricityPrices(todayFormatted),
          fetchGasPrices(todayFormatted)
        ]);

        const currentElectricityPrice = electricityData?.data?.data?.find((price: any) => {
          const priceDate = new Date(price.start_date_datetime);
          return priceDate.getHours() === currentHour;
        });

        const currentGasPrice = gasData?.data?.data?.find((price: any) => {
          const priceDate = new Date(price.start_date_datetime);
          return priceDate.toDateString() === now.toDateString();
        });

        setCurrentPrices({
          electricity: currentElectricityPrice,
          gas: currentGasPrice
        });
      } catch (error) {
        console.error('Error fetching current prices:', error);
      }
    };

    fetchCurrentPrices();
  }, []); // Empty dependency array - only run once

  // Fetch historical prices when selected date changes
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        
        const [electricityData, gasData] = await Promise.all([
          fetchElectricityPrices(formattedDate).catch(() => ({ data: null })),
          fetchGasPrices(formattedDate).catch(() => ({ data: null }))
        ]);

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
        // Silently handle any other errors and just show no data
        setElectricityPrices({ data: null });
        setGasPrices({ data: null });
      }
    };

    fetchHistoricalData();
  }, [selectedDate]);

  const handlePreviousDay = () => setSelectedDate(prev => subDays(prev, 1));
  const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1));

  // Current prices are already defined above

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-[1400px] w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentPrices.electricity && (
            <PriceCard
              title="Huidige Elektriciteitsprijs"
              price={currentPrices.electricity.total_price_tax_included}
            />
          )}
          {currentPrices.gas && (
            <PriceCard
              title="Huidige Gasprijs"
              price={currentPrices.gas.total_price_tax_included}
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
