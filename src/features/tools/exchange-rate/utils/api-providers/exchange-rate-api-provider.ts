import { DEFAULT_EXCHANGE_RATE } from '../currency-data';
import {
  ExchangeRateApiProvider,
  HistoricalDataPoint,
  generateDatesForLastDays
} from './api-provider';

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

/**
 * ExchangeRate API 提供者实现
 * 使用 exchangerate-api.com 的 API
 */
export class ExchangeRateApiProviderImpl implements ExchangeRateApiProvider {
  name = 'ExchangeRate-API';

  // Using v6 of the Exchange Rate API
  private API_URL = 'https://v6.exchangerate-api.com/v6/';

  /**
   * 获取实时汇率
   * @param fromCurrency 源货币代码
   * @param toCurrency 目标货币代码
   * @returns 汇率值或 null（如果获取失败）
   */
  async fetchExchangeRate(
    fromCurrency: string,
    toCurrency: string
  ): Promise<number | null> {
    try {
      // Set a timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(
        `${this.API_URL}${API_KEY}/latest/${fromCurrency}`,
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
   * 获取历史汇率数据
   * 注意：免费版 ExchangeRate API 不支持历史数据，所以我们生成模拟数据
   * @param fromCurrency 源货币代码
   * @param toCurrency 目标货币代码
   * @param days 天数
   * @returns 历史汇率数据点数组
   */
  async fetchHistoricalData(
    fromCurrency: string,
    toCurrency: string,
    days: number = 30
  ): Promise<HistoricalDataPoint[]> {
    try {
      // Get the current exchange rate
      const currentRate =
        (await this.fetchExchangeRate(fromCurrency, toCurrency)) ||
        DEFAULT_EXCHANGE_RATE;

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
    } catch (error) {
      console.error('Error generating mock historical data:', error);
      return [];
    }
  }
}
