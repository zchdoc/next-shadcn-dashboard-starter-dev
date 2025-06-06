'use client';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { ExchangeRateChart } from './exchange-rate-chart';
import { ExchangeRateForm } from './exchange-rate-form';
import { ApiProviderType } from '../utils/api-providers/api-provider-factory';
import {
  DEFAULT_FROM_CURRENCY,
  DEFAULT_TO_CURRENCY
} from '../utils/currency-data';

export default function ExchangeRateViewPage() {
  const [fromCurrency, setFromCurrency] = useState(DEFAULT_FROM_CURRENCY);
  const [toCurrency, setToCurrency] = useState(DEFAULT_TO_CURRENCY);
  const [apiProvider, setApiProvider] =
    useState<ApiProviderType>('exchangerate-api');

  const handleCurrencyChange = (from: string, to: string) => {
    setFromCurrency(from);
    setToCurrency(to);
  };

  const handleApiProviderChange = (provider: ApiProviderType) => {
    setApiProvider(provider);
  };

  return (
    <PageContainer>
      <div className='space-y-6'>
        <div>
          <Heading
            title='Currency Exchange Rate Tool'
            description='Convert between different currencies with real-time exchange rates'
          />
          <Separator className='my-4' />
        </div>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <ExchangeRateForm
            onCurrencyChange={handleCurrencyChange}
            onApiProviderChange={handleApiProviderChange}
          />
          <ExchangeRateChart
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            apiProvider={apiProvider}
            onApiProviderChange={handleApiProviderChange}
          />
        </div>
      </div>
    </PageContainer>
  );
}
