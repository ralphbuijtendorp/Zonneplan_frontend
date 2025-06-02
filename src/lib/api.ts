import { EnergyPriceData, ApiResponse } from "./types";

export async function fetchElectricityPrices(date: string): Promise<ApiResponse<EnergyPriceData>> {
  try {
    const response = await fetch(`http://localhost:12000/get_electricity_data?date=${date}`);
    
    if (!response.ok) {
      return { data: null };
    }

    return await response.json();
  } catch (error) {
    return { data: null };
  }
}

export async function fetchGasPrices(date: string): Promise<ApiResponse<EnergyPriceData>> {
  try {
    const response = await fetch(`http://localhost:12000/get_gas_data?date=${date}`);

    if (!response.ok) {
      return { data: null };
    }

    return await response.json();
  } catch (error) {
    return { data: null };
  }
}
