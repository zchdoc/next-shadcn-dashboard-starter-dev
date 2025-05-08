import { DEFAULT_EXCHANGE_RATE } from '../currency-data';
import {
  ExchangeRateApiProvider,
  HistoricalDataPoint,
  generateDatesForLastDays
} from './api-provider';

// 聚合数据 API Key
const API_KEY = 'd34b5e115bfd16290dd1d3a061b26bb5';

// 聚合数据 API 响应接口
interface JuheApiResponse {
  reason: string;
  result: JuheExchangeRateResult[];
  error_code: number;
}

interface JuheExchangeRateResult {
  currencyF: string; // 源货币代码
  currencyF_Name: string; // 源货币名称
  currencyT: string; // 目标货币代码
  currencyT_Name: string; // 目标货币名称
  currencyFD: number; // 基数
  exchange: string; // 汇率值（字符串形式）
  result: string | number; // 汇率结果
  updateTime: string; // 更新时间
}

/**
 * 聚合数据汇率 API 提供者实现
 * 使用 juhe.cn 的汇率 API
 */
export class JuheApiExchangeProviderImpl implements ExchangeRateApiProvider {
  name = '聚合数据汇率';

  // API URL
  private API_URL = 'http://op.juhe.cn/onebox/exchange/currency';

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
      // 设置请求超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

      // 构建API请求URL
      const url = `${this.API_URL}?key=${API_KEY}&from=${fromCurrency}&to=${toCurrency}&version=2`;

      const response = await fetch(url, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('获取汇率失败:', response.statusText);
        return null;
      }

      const data: JuheApiResponse = await response.json();

      // 检查API响应
      if (data.error_code !== 0 || !data.result || data.result.length === 0) {
        console.error('无效的API响应:', data);
        return null;
      }

      // 获取汇率值
      const rateInfo = data.result[0];
      const rate = parseFloat(rateInfo.exchange);

      if (isNaN(rate)) {
        console.error(`汇率解析失败: ${rateInfo.exchange}`);
        return null;
      }

      return rate;
    } catch (error) {
      console.error('获取汇率时发生错误:', error);
      return null;
    }
  }

  /**
   * 获取历史汇率数据
   * 注意：聚合数据API不支持历史数据，所以我们生成模拟数据
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
      // 获取当前汇率
      const currentRate =
        (await this.fetchExchangeRate(fromCurrency, toCurrency)) ||
        DEFAULT_EXCHANGE_RATE;

      // 生成过去n天的日期
      const dates = generateDatesForLastDays(days);

      // 基于当前汇率生成随机波动的模拟数据
      const data: HistoricalDataPoint[] = dates.map((date) => {
        // 当前汇率的-5%到+5%之间的随机波动
        const fluctuation = (Math.random() * 0.1 - 0.05) * currentRate;
        const rate = currentRate + fluctuation;

        return {
          date,
          rate: parseFloat(rate.toFixed(4))
        };
      });

      // 按日期排序（最早的在前）
      return data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } catch (error) {
      console.error('生成模拟历史数据时发生错误:', error);
      return [];
    }
  }
}
