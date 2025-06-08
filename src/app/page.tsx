'use client';

import { useState, useEffect } from 'react';
import { PriceCard } from '@/components/PriceCard';
import { PriceChart } from '@/components/PriceChart';
import { fetchElectricityPrices, fetchGasPrices } from '@/lib/api';
import { EnergyPriceData, ApiResponse } from '@/lib/types';
import { format, addDays, subDays } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Button, Card, Title, LineChart } from '@tremor/react';
import { DailyRecordsCard } from '@/components/DailyRecordsCard';

export default function Home() {
  const headerStyle = {
    background: 'white',
    borderBottom: '1px solid #E0E0E0',
    padding: '2rem 0',
    marginBottom: '2rem'
  };
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [electricityPrices, setElectricityPrices] = useState<any>(null);
  const [currentPrices, setCurrentPrices] = useState<{
    electricity: any;
    gas: any;
  }>({ electricity: null, gas: null });

  const [dailyRecords, setDailyRecords] = useState<{
    highest: { price: number; time: string } | null;
    lowest: { price: number; time: string } | null;
    mostSustainable: { score: number; time: string } | null;
  }>({ highest: null, lowest: null, mostSustainable: null });

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
        
        const electricityData = await fetchElectricityPrices(formattedDate).catch(() => ({ data: null }));

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

          // Process daily records from electricity data
          const prices = filteredElectricityData.data.data;
          let highest = { price: -Infinity, time: '' };
          let lowest = { price: Infinity, time: '' };
          let mostSustainable = { score: -Infinity, time: '' };

          prices.forEach((price: any) => {
            const priceValue = price.total_price_tax_included;
            const sustainabilityScore = price.sustainability_score || 0;
            const priceDate = new Date(price.start_date_datetime);
            const timeStr = `${priceDate.getHours()}:00 - ${priceDate.getHours() + 1}:00`;

            if (priceValue > highest.price) {
              highest = { price: priceValue, time: timeStr };
            }
            if (priceValue < lowest.price) {
              lowest = { price: priceValue, time: timeStr };
            }
            // Use sustainability score to determine the most sustainable hour
            if (sustainabilityScore > mostSustainable.score) {
              mostSustainable = { score: sustainabilityScore, time: timeStr };
            }
          });

          setDailyRecords({
            highest,
            lowest,
            mostSustainable
          });
        } else {
          setElectricityPrices({ data: null });
          setDailyRecords({ highest: null, lowest: null, mostSustainable: null });
        }
      } catch (error) {
        // Silently handle any other errors and just show no data
        setElectricityPrices({ data: null });
      }
    };

    fetchHistoricalData();
  }, [selectedDate]);

  const handlePreviousDay = () => setSelectedDate(prev => subDays(prev, 1));
  const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1));

  // Current prices are already defined above

  return (
    <main className="min-h-screen bg-gray-50">
      <header style={headerStyle}>
        <div className="mx-auto max-w-[1400px] w-full px-8 flex justify-center">
          <img src="/zonneplan-logo.png" alt="Zonneplan" className="h-12" />
        </div>
      </header>
      <div className="px-8 pb-8">
      <div className="mx-auto max-w-[1400px] w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
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
              unit="M³"
            />
          )}
          <DailyRecordsCard records={dailyRecords} />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card>
            <Title>Elektriciteitsprijzen - {format(selectedDate, 'd MMMM yyyy', { locale: nl })}</Title>
            {electricityPrices?.data?.data?.length > 0 ? (
              <LineChart
                className="mt-6 h-72"
                data={electricityPrices.data.data.map((price: any) => ({
                  time: format(new Date(price.start_date_datetime), 'HH:mm'),
                  value: (price.total_price_tax_included / 10000000).toFixed(2)
                }))}
                index="time"
                categories={['value']}
                colors={['#00aa65']}
                valueFormatter={(value) => `€${value}`}
                yAxisWidth={60}
                showAnimation={false}
                showLegend={false}
                style={{
                  stroke: '#00aa65',
                  strokeWidth: 2
                }}
              />
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-500">
                Geen prijzen gevonden voor deze datum!
              </div>
            )}
          </Card>
        </div>

        <div className="flex justify-center gap-4 mt-12">
          <Button
            onClick={handlePreviousDay}
            className="bg-[#00aa65] hover:bg-[#009959] text-white border-none"
          >
            Vorige Dag
          </Button>
          <Button
            onClick={handleNextDay}
            className="bg-[#00aa65] hover:bg-[#009959] text-white border-none"
          >
            Volgende Dag
          </Button>
        </div>
      </div>
      </div>
    </main>
  );
}
