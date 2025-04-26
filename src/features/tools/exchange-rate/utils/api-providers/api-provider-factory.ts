import { ExchangeRateApiProvider } from './api-provider';
import { AllTickApiProviderImpl } from './alltick-api-provider';
import { ExchangeRateApiProviderImpl } from './exchange-rate-api-provider';

// API 提供者类型
export type ApiProviderType = 'alltick' | 'exchangerate-api';

/**
 * API 提供者工厂
 * 用于创建和管理不同的 API 提供者
 */
export class ApiProviderFactory {
  private static providers: Record<ApiProviderType, ExchangeRateApiProvider> = {
    alltick: new AllTickApiProviderImpl(),
    'exchangerate-api': new ExchangeRateApiProviderImpl()
  };

  /**
   * 获取指定类型的 API 提供者
   * @param type API 提供者类型
   * @returns API 提供者实例
   */
  static getProvider(type: ApiProviderType): ExchangeRateApiProvider {
    return this.providers[type];
  }

  /**
   * 获取所有可用的 API 提供者类型
   * @returns API 提供者类型数组
   */
  static getAvailableProviders(): { type: ApiProviderType; name: string }[] {
    return Object.entries(this.providers).map(([type, provider]) => ({
      type: type as ApiProviderType,
      name: provider.name
    }));
  }

  /**
   * 获取默认的 API 提供者类型
   * @returns 默认 API 提供者类型
   */
  static getDefaultProviderType(): ApiProviderType {
    return 'alltick'; // 默认使用 AllTick API
  }
}
