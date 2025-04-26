import {
  ApiProviderFactory,
  ApiProviderType
} from './api-providers/api-provider-factory';
import { HistoricalDataPoint } from './api-providers/api-provider';

/**
 * 获取实时汇率
 * @param fromCurrency 源货币代码
 * @param toCurrency 目标货币代码
 * @param apiProviderType API 提供者类型
 * @returns 汇率值或 null（如果获取失败）
 */
export async function fetchExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  apiProviderType: ApiProviderType = ApiProviderFactory.getDefaultProviderType()
): Promise<number | null> {
  const provider = ApiProviderFactory.getProvider(apiProviderType);
  return await provider.fetchExchangeRate(fromCurrency, toCurrency);
}

/**
 * 获取历史汇率数据
 * @param fromCurrency 源货币代码
 * @param toCurrency 目标货币代码
 * @param days 数据点数量
 * @param apiProviderType API 提供者类型
 * @param klineType K线类型（8=日K, 9=周K, 10=月K）
 * @returns 历史汇率数据点数组
 */
export async function fetchHistoricalData(
  fromCurrency: string,
  toCurrency: string,
  days: number = 30,
  apiProviderType: ApiProviderType = ApiProviderFactory.getDefaultProviderType(),
  klineType?: number
): Promise<HistoricalDataPoint[]> {
  const provider = ApiProviderFactory.getProvider(apiProviderType);

  // 如果是 AllTick API 且提供了 klineType，则传递给 provider
  if (apiProviderType === 'alltick' && klineType) {
    // 检查 provider 是否支持 klineType 参数
    if ('fetchHistoricalDataWithKlineType' in provider) {
      return await (provider as any).fetchHistoricalDataWithKlineType(
        fromCurrency,
        toCurrency,
        days,
        klineType
      );
    }
  }

  return await provider.fetchHistoricalData(fromCurrency, toCurrency, days);
}

/**
 * 转换货币
 * @param amount 金额
 * @param rate 汇率
 * @returns 转换后的金额
 */
export function convertCurrency(amount: number, rate: number): number {
  return amount * rate;
}
