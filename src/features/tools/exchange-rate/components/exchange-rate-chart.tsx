'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  HistoricalDataPoint,
  fetchHistoricalData
} from '../utils/historical-data';

interface ExchangeRateChartProps {
  fromCurrency: string;
  toCurrency: string;
}

export function ExchangeRateChart({
  fromCurrency,
  toCurrency
}: ExchangeRateChartProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [percentChange, setPercentChange] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const data = await fetchHistoricalData(fromCurrency, toCurrency, days);

      if (data.length > 0) {
        setHistoricalData(data);

        // Calculate trend
        const firstRate = data[0].rate;
        const lastRate = data[data.length - 1].rate;
        const change = ((lastRate - firstRate) / firstRate) * 100;

        setPercentChange(parseFloat(change.toFixed(2)));
        setTrend(change > 0 ? 'up' : change < 0 ? 'down' : 'neutral');
      }

      setIsLoading(false);
    };

    fetchData();
  }, [fromCurrency, toCurrency, timeframe]);

  // Format date for display in the chart
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().substr(2, 2)}`;
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-background rounded-md border p-2 shadow-sm'>
          <p className='text-sm font-medium'>
            {new Date(label).toLocaleDateString()}
          </p>
          <p className='text-primary text-sm'>
            1 {fromCurrency} = {payload[0].value.toFixed(4)} {toCurrency}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className='h-full w-full'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Exchange Rate History</CardTitle>
            <CardDescription>
              Historical rates for {fromCurrency} to {toCurrency}
            </CardDescription>
          </div>
          {!isLoading && (
            <div className='flex items-center'>
              {trend === 'up' ? (
                <div className='flex items-center text-green-500'>
                  <IconArrowUpRight className='mr-1 h-4 w-4' />
                  <span className='font-medium'>+{percentChange}%</span>
                </div>
              ) : trend === 'down' ? (
                <div className='flex items-center text-red-500'>
                  <IconArrowDownRight className='mr-1 h-4 w-4' />
                  <span className='font-medium'>{percentChange}%</span>
                </div>
              ) : null}
            </div>
          )}
        </div>
        <Tabs
          defaultValue='30d'
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as '7d' | '30d' | '90d')}
          className='w-full'
        >
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='7d'>7D</TabsTrigger>
            <TabsTrigger value='30d'>30D</TabsTrigger>
            <TabsTrigger value='90d'>90D</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex h-[300px] w-full items-center justify-center'>
            <Skeleton className='h-[250px] w-full' />
          </div>
        ) : historicalData.length > 0 ? (
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart
                data={historicalData.map((item) => ({
                  ...item,
                  formattedDate: formatDate(item.date)
                }))}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id='colorRate' x1='0' y1='0' x2='0' y2='1'>
                    <stop
                      offset='5%'
                      stopColor='hsl(var(--primary))'
                      stopOpacity={0.8}
                    />
                    <stop
                      offset='95%'
                      stopColor='hsl(var(--primary))'
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey='formattedDate'
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={5}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.toFixed(2)}
                />
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='hsl(var(--border))'
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type='monotone'
                  dataKey='rate'
                  stroke='hsl(var(--primary))'
                  fillOpacity={1}
                  fill='url(#colorRate)'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className='flex h-[300px] w-full items-center justify-center'>
            <p className='text-muted-foreground'>
              No historical data available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
