/**
 * 汇率 API 提供者接口
 * 定义了所有汇率 API 提供者需要实现的方法
 */
export interface ExchangeRateApiProvider {
  /**
   * 提供者名称
   */
  name: string;

  /**
   * 获取实时汇率
   * @param fromCurrency 源货币代码
   * @param toCurrency 目标货币代码
   * @returns 汇率值或 null（如果获取失败）
   */
  fetchExchangeRate(
    fromCurrency: string,
    toCurrency: string
  ): Promise<number | null>;

  /**
   * 获取历史汇率数据
   * @param fromCurrency 源货币代码
   * @param toCurrency 目标货币代码
   * @param days 天数
   * @returns 历史汇率数据点数组
   */
  fetchHistoricalData(
    fromCurrency: string,
    toCurrency: string,
    days: number
  ): Promise<HistoricalDataPoint[]>;
}

/**
 * 历史数据点接口
 */
export interface HistoricalDataPoint {
  date: string;
  rate: number;
}

/**
 * 生成过去 n 天的日期数组
 * @param days 天数
 * @returns 日期字符串数组，格式为 YYYY-MM-DD
 */
export function generateDatesForLastDays(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    dates.push(dateStr);
  }

  return dates;
}

/**
 * 格式化日期为 API 请求格式
 * @param date 日期对象
 * @returns 格式化的日期字符串 YYYY-MM-DD
 */
export function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
