'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconArrowsExchange, IconRefresh } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  exchangeRateSchema,
  ExchangeRateFormValues
} from '../schemas/exchange-rate-schema';
import {
  currencies,
  DEFAULT_EXCHANGE_RATE,
  DEFAULT_FROM_CURRENCY,
  DEFAULT_TO_CURRENCY
} from '../utils/currency-data';
import { ApiProviderFactory } from '../utils/api-providers/api-provider-factory';
import {
  convertCurrency,
  fetchExchangeRate
} from '../utils/exchange-rate-service';

import { ApiProviderType } from '../utils/api-providers/api-provider-factory';

interface ExchangeRateFormProps {
  onCurrencyChange?: (fromCurrency: string, toCurrency: string) => void;
  onApiProviderChange?: (apiProvider: ApiProviderType) => void;
}

export function ExchangeRateForm({
  onCurrencyChange,
  onApiProviderChange
}: ExchangeRateFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [rateLastUpdated, setRateLastUpdated] = useState<Date | null>(null);

  // 获取可用的 API 提供者
  const availableProviders = ApiProviderFactory.getAvailableProviders();
  const defaultProviderType = ApiProviderFactory.getDefaultProviderType();

  // Initialize form with default values
  const form = useForm<ExchangeRateFormValues>({
    resolver: zodResolver(exchangeRateSchema),
    defaultValues: {
      fromCurrency: DEFAULT_FROM_CURRENCY,
      toCurrency: DEFAULT_TO_CURRENCY,
      amount: 1,
      rate: DEFAULT_EXCHANGE_RATE,
      useCustomRate: false,
      apiProvider: defaultProviderType
    }
  });

  const { watch, setValue, getValues } = form;

  // Watch for changes to these fields
  const fromCurrency = watch('fromCurrency');
  const toCurrency = watch('toCurrency');
  const amount = watch('amount');
  const rate = watch('rate');
  const useCustomRate = watch('useCustomRate');
  const apiProvider = watch('apiProvider');

  // Notify parent component when currencies change
  useEffect(() => {
    if (onCurrencyChange) {
      onCurrencyChange(fromCurrency, toCurrency);
    }
  }, [fromCurrency, toCurrency, onCurrencyChange]);

  // Notify parent component when API provider changes
  useEffect(() => {
    if (onApiProviderChange) {
      onApiProviderChange(apiProvider as ApiProviderType);
    }
  }, [apiProvider, onApiProviderChange]);

  // Fetch exchange rate when currencies or API provider change
  useEffect(() => {
    if (!useCustomRate) {
      updateExchangeRate().then();
    }
  }, [fromCurrency, toCurrency, apiProvider, useCustomRate]);

  // Update converted amount when amount or rate changes
  useEffect(() => {
    const currentRate = getValues('rate');
    const currentAmount = getValues('amount');

    if (currentRate && currentAmount) {
      setConvertedAmount(convertCurrency(currentAmount, currentRate));
    }
  }, [amount, rate, getValues]);

  // Function to fetch and update the exchange rate
  const updateExchangeRate = async () => {
    if (useCustomRate) return;

    setIsLoading(true);

    try {
      const newRate = await fetchExchangeRate(
        fromCurrency,
        toCurrency,
        apiProvider as ApiProviderType
      );

      if (newRate) {
        setValue('rate', newRate);
        setRateLastUpdated(new Date());
      } else {
        // If API fails, keep using the default or current rate
        console.log('Using default or current rate as API request failed');
      }
    } catch (error) {
      console.error('Error updating exchange rate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to swap currencies
  const swapCurrencies = () => {
    const currentFrom = getValues('fromCurrency');
    const currentTo = getValues('toCurrency');

    setValue('fromCurrency', currentTo);
    setValue('toCurrency', currentFrom);
  };

  // Handle form submission
  const onSubmit = (data: ExchangeRateFormValues) => {
    const converted = convertCurrency(data.amount, data.rate);
    setConvertedAmount(converted);
  };

  return (
    <Card className='mx-auto w-full max-w-3xl'>
      <CardHeader>
        <CardTitle>Currency Exchange Calculator</CardTitle>
        <CardDescription>
          Convert between currencies using real-time exchange rates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Result Display - Moved to top */}
            {convertedAmount !== null ? (
              <div className='bg-muted mb-4 rounded-lg border p-4'>
                <h3 className='text-lg font-medium'>Result</h3>
                <div className='mt-2 flex flex-col gap-2 md:flex-row md:items-center'>
                  <p className='text-xl font-semibold'>
                    {amount} {fromCurrency} =
                  </p>
                  <p className='text-primary text-2xl font-bold'>
                    {convertedAmount.toFixed(2)} {toCurrency}
                  </p>
                </div>
                <p className='text-muted-foreground mt-2 text-sm'>
                  1 {fromCurrency} = {rate} {toCurrency}
                </p>
              </div>
            ) : (
              <div className='bg-muted mb-4 rounded-lg border p-4 text-center'>
                <p className='text-muted-foreground text-lg'>
                  Enter an amount to see the conversion result
                </p>
              </div>
            )}

            {/* Amount - Moved up near the top */}
            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.01'
                      placeholder='Enter amount'
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.handleSubmit(onSubmit)();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Convert Button - Moved up */}
            <Button type='submit' className='w-full'>
              Convert
            </Button>

            <div className='flex flex-col items-center gap-4 md:flex-row'>
              {/* From Currency */}
              <FormField
                control={form.control}
                name='fromCurrency'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>From</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select currency' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.flag} {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Swap Button */}
              <Button
                type='button'
                variant='outline'
                size='icon'
                className='mt-8'
                onClick={swapCurrencies}
              >
                <IconArrowsExchange className='h-4 w-4' />
              </Button>

              {/* To Currency */}
              <FormField
                control={form.control}
                name='toCurrency'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>To</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select currency' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.flag} {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* API Provider Selection */}
            <FormField
              control={form.control}
              name='apiProvider'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Provider</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select API provider' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableProviders.map((provider) => (
                        <SelectItem key={provider.type} value={provider.type}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose which API to use for exchange rate data
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Exchange Rate */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <FormField
                  control={form.control}
                  name='useCustomRate'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                      <div className='space-y-0.5'>
                        <FormLabel>Use Custom Rate</FormLabel>
                        <FormDescription>
                          Toggle to manually set the exchange rate
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='rate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exchange Rate</FormLabel>
                    <div className='flex gap-2'>
                      <FormControl>
                        <Input
                          type='number'
                          step='0.0001'
                          placeholder='Exchange rate'
                          {...field}
                          disabled={isLoading || !useCustomRate}
                          onChange={(e) => {
                            field.onChange(e);
                            form.handleSubmit(onSubmit)();
                          }}
                        />
                      </FormControl>
                      {!useCustomRate && (
                        <Button
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={updateExchangeRate}
                          disabled={isLoading}
                        >
                          <IconRefresh
                            className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                          />
                        </Button>
                      )}
                    </div>
                    <FormDescription>
                      {rateLastUpdated
                        ? `Last updated: ${rateLastUpdated.toLocaleTimeString()}`
                        : 'Using default rate'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='text-muted-foreground flex flex-col items-start text-sm'>
        <p>
          Note: Exchange rates are approximate and may vary from actual market
          rates.
        </p>
      </CardFooter>
    </Card>
  );
}
