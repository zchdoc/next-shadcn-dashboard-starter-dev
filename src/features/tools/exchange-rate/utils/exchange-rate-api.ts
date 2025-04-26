import { DEFAULT_EXCHANGE_RATE } from './currency-data';

// API Key for Exchange Rate API
const API_KEY = 'ce4e516209655820db1afeae';

// Interface for API response (v6)
interface ExchangeRateApiResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: Record<string, number>;
}

// Using v6 of the Exchange Rate API
const API_URL = 'https://v6.exchangerate-api.com/v6/';

/**
 * Fetches the exchange rate from the API
 * @param fromCurrency The currency to convert from
 * @param toCurrency The currency to convert to
 * @returns The exchange rate or null if there was an error
 */
export async function fetchExchangeRate(
  fromCurrency: string,
  toCurrency: string
): Promise<number | null> {
  try {
    // Set a timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(
      `${API_URL}${API_KEY}/latest/${fromCurrency}`,
      {
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('Error fetching exchange rate:', response.statusText);
      return null;
    }

    const data: ExchangeRateApiResponse = await response.json();

    if (data.result !== 'success' || !data.conversion_rates) {
      console.error('Invalid API response:', data);
      return null;
    }

    const rate = data.conversion_rates[toCurrency];

    if (!rate) {
      console.error(`Rate not found for ${toCurrency}`);
      return null;
    }

    return rate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return null;
  }
}

/**
 * Converts an amount from one currency to another
 * @param amount The amount to convert
 * @param rate The exchange rate
 * @returns The converted amount
 */
export function convertCurrency(amount: number, rate: number): number {
  return amount * rate;
}
