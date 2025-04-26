import * as z from 'zod';
import { ApiProviderType } from '../utils/api-providers/api-provider-factory';

export const exchangeRateSchema = z.object({
  fromCurrency: z.string().min(1, { message: 'Please select a currency' }),
  toCurrency: z.string().min(1, { message: 'Please select a currency' }),
  amount: z.coerce
    .number()
    .positive({ message: 'Amount must be a positive number' }),
  rate: z.coerce
    .number()
    .positive({ message: 'Rate must be a positive number' }),
  useCustomRate: z.boolean().default(false),
  apiProvider: z.string().min(1, { message: 'Please select an API provider' })
});

export type ExchangeRateFormValues = z.infer<typeof exchangeRateSchema>;
