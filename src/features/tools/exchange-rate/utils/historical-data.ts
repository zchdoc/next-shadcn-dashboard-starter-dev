// This file contains utility functions for fetching and processing historical exchange rate data

import { fetchExchangeRate } from './exchange-rate-api';

// API Key for Exchange Rate API
const API_KEY = 'ce4e516209655820db1afeae';

// API URL for historical data
const HISTORICAL_API_URL = 'https://v6.exchangerate-api.com/v6/';

// Interface for historical data point
export interface HistoricalDataPoint {
  date: string;
  rate: number;
}

/**
 * Generates dates for the last n days
 * @param days Number of days to generate
 * @returns Array of date strings in YYYY-MM-DD format
 */
export function generateDatesForLastDays(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();

  console.log(
    'Generating dates for last',
    days,
    'days from',
    today.toISOString()
  );

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    dates.push(dateStr);
    console.log(`Generated date for ${i} days ago:`, dateStr);
  }

  return dates;
}

/**
 * Generates mock historical data for demonstration purposes
 * In a real application, this would be replaced with actual API calls
 * @param fromCurrency The currency to convert from
 * @param toCurrency The currency to convert to
 * @param days Number of days of historical data to generate
 * @returns Promise resolving to array of historical data points
 */
export async function getMockHistoricalData(
  fromCurrency: string,
  toCurrency: string,
  days: number = 30
): Promise<HistoricalDataPoint[]> {
  console.info('fromCurrency:', fromCurrency);
  console.info('toCurrency:', toCurrency);
  // Get the current exchange rate
  const currentRate =
    (await fetchExchangeRate(fromCurrency, toCurrency)) || 7.31; // Default to 7.31 if API fails

  // Generate dates for the last n days
  const dates = generateDatesForLastDays(days);

  // Generate random fluctuations around the current rate
  // This is just for demonstration - real data would come from an API
  const data: HistoricalDataPoint[] = dates.map((date) => {
    // Random fluctuation between -5% and +5% of the current rate
    const fluctuation = (Math.random() * 0.1 - 0.05) * currentRate;
    const rate = currentRate + fluctuation;

    return {
      date,
      rate: parseFloat(rate.toFixed(4))
    };
  });

  // Sort by date (oldest first)
  return data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

/**
 * Format date as YYYY-MM-DD for API requests
 * @param date Date to format
 * @returns Formatted date string
 */
function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Fetches historical exchange rate data from the Exchange Rate API
 * @param fromCurrency The currency to convert from
 * @param toCurrency The currency to convert to
 * @param days Number of days of historical data to fetch
 * @returns Promise resolving to array of historical data points
 */
export async function fetchHistoricalData(
  fromCurrency: string,
  toCurrency: string,
  days: number = 30
): Promise<HistoricalDataPoint[]> {
  try {
    const result: HistoricalDataPoint[] = [];
    const dates = generateDatesForLastDays(days);

    // Exchange Rate API doesn't support batch historical requests in the free plan
    // We need to make individual requests for each date
    // To avoid rate limits, we'll fetch a few key dates and interpolate the rest

    // For performance reasons, we'll fetch data for specific points and interpolate
    // This reduces API calls while still providing realistic data
    const keyDates = [];

    if (days <= 7) {
      // For 7 days, fetch all days
      keyDates.push(...dates);
    } else if (days <= 30) {
      // For 30 days, fetch every 5 days
      for (let i = 0; i < dates.length; i += 5) {
        keyDates.push(dates[i]);
      }
      // Always include the first and last date
      if (!keyDates.includes(dates[0])) keyDates.push(dates[0]);
      if (!keyDates.includes(dates[dates.length - 1]))
        keyDates.push(dates[dates.length - 1]);
    } else {
      // For 90 days, fetch every 15 days
      for (let i = 0; i < dates.length; i += 15) {
        keyDates.push(dates[i]);
      }
      // Always include the first and last date
      if (!keyDates.includes(dates[0])) keyDates.push(dates[0]);
      if (!keyDates.includes(dates[dates.length - 1]))
        keyDates.push(dates[dates.length - 1]);
    }

    // Sort key dates to ensure they're in chronological order
    keyDates.sort();

    // Fetch data for key dates
    const keyDateRates: Record<string, number> = {};

    // Use Promise.all to fetch all key dates in parallel
    await Promise.all(
      keyDates.map(async (dateStr) => {
        try {
          const date = new Date(dateStr);
          const formattedDate = formatDateForApi(date);

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const response = await fetch(
            `${HISTORICAL_API_URL}${API_KEY}/history/${fromCurrency}/${formattedDate}`,
            { signal: controller.signal }
          );

          clearTimeout(timeoutId);

          if (!response.ok) {
            console.error(
              `Error fetching historical data for ${dateStr}:`,
              response.statusText
            );
            return;
          }

          const data = await response.json();

          if (data.result !== 'success' || !data.conversion_rates) {
            console.error(`Invalid API response for ${dateStr}:`, data);
            return;
          }

          const rate = data.conversion_rates[toCurrency];
          if (rate) {
            keyDateRates[dateStr] = rate;
          }
        } catch (err) {
          console.error(`Error fetching data for ${dateStr}:`, err);
        }
      })
    );

    // If we couldn't fetch any key dates, fall back to mock data
    if (Object.keys(keyDateRates).length === 0) {
      console.warn(
        'Could not fetch any historical data, falling back to mock data'
      );
      return await getMockHistoricalData(fromCurrency, toCurrency, days);
    }

    // Interpolate rates for all dates
    const sortedKeyDates = Object.keys(keyDateRates).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    for (const dateStr of dates) {
      // If we have the exact date, use it
      if (keyDateRates[dateStr] !== undefined) {
        result.push({
          date: dateStr,
          rate: keyDateRates[dateStr]
        });
        continue;
      }

      // Otherwise, interpolate between the closest dates we have
      const dateTime = new Date(dateStr).getTime();

      // Find the closest dates before and after
      let beforeDate = null;
      let afterDate = null;

      for (const keyDate of sortedKeyDates) {
        const keyDateTime = new Date(keyDate).getTime();

        if (keyDateTime <= dateTime) {
          beforeDate = keyDate;
        } else {
          afterDate = keyDate;
          break;
        }
      }

      // Interpolate the rate
      let rate;

      if (beforeDate && afterDate) {
        // Interpolate between two dates
        const beforeTime = new Date(beforeDate).getTime();
        const afterTime = new Date(afterDate).getTime();
        const beforeRate = keyDateRates[beforeDate];
        const afterRate = keyDateRates[afterDate];

        const timeFraction = (dateTime - beforeTime) / (afterTime - beforeTime);
        rate = beforeRate + (afterRate - beforeRate) * timeFraction;
      } else if (beforeDate) {
        // Use the closest date before
        rate = keyDateRates[beforeDate];
      } else if (afterDate) {
        // Use the closest date after
        rate = keyDateRates[afterDate];
      } else {
        // This shouldn't happen, but just in case
        const currentRate =
          (await fetchExchangeRate(fromCurrency, toCurrency)) || 7.31;
        rate = currentRate;
      }

      result.push({
        date: dateStr,
        rate: parseFloat(rate.toFixed(4))
      });
    }

    // Sort by date (oldest first)
    return result.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch (error) {
    console.error('Error fetching historical data:', error);
    // Fall back to mock data if there's an error
    return await getMockHistoricalData(fromCurrency, toCurrency, days);
  }
}
