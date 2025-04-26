import { DEFAULT_EXCHANGE_RATE } from '../currency-data';
import {
  ExchangeRateApiProvider,
  HistoricalDataPoint,
  formatDateForApi,
  generateDatesForLastDays
} from './api-provider';
// 使用我们的代理 API 而不是直接调用 AllTick API
const API_PROXY_URL = '/api/exchange-rate/alltick';
// 货币代码映射表 - 将标准货币代码映射到 AllTick 的代码
const CURRENCY_CODE_MAP: Record<string, string> = {
  USD: 'USD',
  CNY: 'CNY',
  EUR: 'EUR',
  GBP: 'GBP',
  JPY: 'JPY',
  KRW: 'KRW',
  HKD: 'HKD',
  CAD: 'CAD',
  AUD: 'AUD',
  SGD: 'SGD'
};
// 获取 AllTick 的货币对代码
function getAllTickCurrencyPairCode(
  fromCurrency: string,
  toCurrency: string
): string {
  return `${fromCurrency}${toCurrency}`;
}
// 生成唯一的 trace ID
function generateTraceId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}
/**
 * AllTick API 提供者实现
 */
export class AllTickApiProviderImpl implements ExchangeRateApiProvider {
  name = 'AllTick';
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
      const traceId = generateTraceId();
      if (!traceId) {
        console.warn('Failed to generate trace ID');
      }
      // 获取最新的 K 线数据（日 K）
      const data = await this.fetchKlineData(fromCurrency, toCurrency, 8, 1);
      if (data.length === 0) {
        console.error('No kline data returned from AllTick API');
        return null;
      }
      // 使用最新 K 线的收盘价作为当前汇率
      const latestKline = data[data.length - 1];
      const rate = parseFloat(latestKline.close_price);
      return rate;
    } catch (error) {
      console.error('Error fetching exchange rate from AllTick:', error);
      return null;
    }
  }
  /**
   * 获取历史汇率数据
   * @param fromCurrency 源货币代码
   * @param toCurrency 目标货币代码
   * @param days 数据点数量
   * @returns 历史汇率数据点数组
   */
  async fetchHistoricalData(
    fromCurrency: string,
    toCurrency: string,
    days: number = 30
  ): Promise<HistoricalDataPoint[]> {
    // 默认使用日 K
    return this.fetchHistoricalDataWithKlineType(
      fromCurrency,
      toCurrency,
      days,
      8
    );
  }
  /**
   * 获取指定 K 线类型的历史汇率数据
   * @param fromCurrency 源货币代码
   * @param toCurrency 目标货币代码
   * @param numKlines 数据点数量
   * @param klineType K 线类型（8=日K, 9=周K, 10=月K）
   * @returns 历史汇率数据点数组
   */
  async fetchHistoricalDataWithKlineType(
    fromCurrency: string,
    toCurrency: string,
    numKlines: number = 30,
    klineType: number = 8
  ): Promise<HistoricalDataPoint[]> {
    try {
      // 获取指定类型的 K 线数据
      const klineData = await this.fetchKlineData(
        fromCurrency,
        toCurrency,
        klineType,
        numKlines
      );
      if (klineData.length === 0) {
        console.error('No historical data returned from AllTick API');
        return this.generateMockHistoricalData(
          fromCurrency,
          toCurrency,
          numKlines
        );
      }
      // 将 K 线数据转换为历史数据点
      const historicalData: HistoricalDataPoint[] = klineData.map((kline) => ({
        date: this.timestampToDateString(kline.timestamp),
        rate: parseFloat(kline.close_price)
      }));
      // 按日期排序（从旧到新）
      return historicalData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } catch (error) {
      console.error('Error fetching historical data from AllTick:', error);
      return this.generateMockHistoricalData(
        fromCurrency,
        toCurrency,
        numKlines
      );
    }
  }
  /**
   * 获取 K 线数据
   * @param fromCurrency 源货币代码
   * @param toCurrency 目标货币代码
   * @param klineType K 线类型（8 表示日 K）
   * @param numKlines 要获取的 K 线数量
   * @returns K 线数据数组
   */
  private async fetchKlineData(
    fromCurrency: string,
    toCurrency: string,
    klineType: number,
    numKlines: number
  ): Promise<any[]> {
    try {
      // 构建货币对代码
      const currencyPairCode = getAllTickCurrencyPairCode(
        CURRENCY_CODE_MAP[fromCurrency] || fromCurrency,
        CURRENCY_CODE_MAP[toCurrency] || toCurrency
      );
      // 设置请求超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      // 通过我们的代理 API 发送请求
      const response = await fetch(API_PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: currencyPairCode,
          klineType: klineType,
          klineTimestampEnd: 0, // 从最新的交易日开始
          queryKlineNum: numKlines,
          adjustType: 0
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        console.error(
          'Error fetching kline data from AllTick proxy:',
          response.statusText
        );
        return [];
      }
      const responseData = await response.json();
      if (
        responseData.ret !== 200 ||
        !responseData.data ||
        !responseData.data.kline_list
      ) {
        console.error('Invalid response from AllTick API:', responseData);
        return [];
      }
      return responseData.data.kline_list;
    } catch (error) {
      console.error('Error fetching kline data from AllTick:', error);
      return [];
    }
  }
  /**
   * 将时间戳转换为日期字符串
   * @param timestamp 时间戳（秒）
   * @returns 日期字符串，格式为 YYYY-MM-DD
   */
  private timestampToDateString(timestamp: string): string {
    const date = new Date(parseInt(timestamp) * 1000);
    return formatDateForApi(date);
  }
  /**
   * 生成模拟历史数据（当 API 请求失败时使用）
   * @param fromCurrency 源货币代码
   * @param toCurrency 目标货币代码
   * @param days 天数
   * @returns 历史汇率数据点数组
   */
  private async generateMockHistoricalData(
    fromCurrency: string,
    toCurrency: string,
    days: number
  ): Promise<HistoricalDataPoint[]> {
    // 获取当前汇率或使用默认值
    const currentRate =
      (await this.fetchExchangeRate(fromCurrency, toCurrency)) ||
      DEFAULT_EXCHANGE_RATE;
    // 生成过去 n 天的日期
    const dates = generateDatesForLastDays(days);
    // 生成随机波动的汇率
    const data: HistoricalDataPoint[] = dates.map((date) => {
      // 随机波动范围为当前汇率的 -5% 到 +5%
      const fluctuation = (Math.random() * 0.1 - 0.05) * currentRate;
      const rate = currentRate + fluctuation;
      return {
        date,
        rate: parseFloat(rate.toFixed(4))
      };
    });
    // 按日期排序（从旧到新）
    return data.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }
}
