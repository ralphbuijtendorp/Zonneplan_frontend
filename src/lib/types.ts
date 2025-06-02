export interface EnergyPriceData {
  price: number;
  start_date_datetime: string;
  total_price_tax_included: number;
  market_price: number;
  price_incl_handling_vat: number;
  price_tax_with_vat: number;
  pricing_profile: 'low' | 'normal' | 'high';
  carbon_footprint_in_gram: number | null;
  sustainability_score: number;
  rank_total_price: number;
  rank_sustainability_score: number;
}

export interface ApiResponse<T> {
  data: {
    data: T[];
  } | null;
  success?: boolean;
  message?: string;
  error?: string;
}

export type EnergyPrice = ApiResponse<EnergyPriceData>;
export type GasPrice = ApiResponse<EnergyPriceData>;
