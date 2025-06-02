import { EnergyPriceData, ApiResponse } from "./types";

export async function fetchElectricityPrices(date: string): Promise<ApiResponse<EnergyPriceData>> {
  try {
    console.log('Fetching electricity prices for date:', date);
    const response = await fetch(`http://localhost:12000/get_electricity_data?date=${date}`);
    console.log('Electricity response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Electricity API error:', errorText);
      throw new Error(`Failed to fetch electricity prices: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Electricity data:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchElectricityPrices:', error);
    throw error;
  }
}

export async function fetchGasPrices(date: string): Promise<ApiResponse<EnergyPriceData>> {
  try {
    console.log('Fetching gas prices for date:', date);
    const response = await fetch(`http://localhost:12000/get_gas_data?date=${date}`);
    console.log('Gas response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gas API error:', errorText);
      throw new Error(`Failed to fetch gas prices: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Gas data:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchGasPrices:', error);
    throw error;
  }
}
