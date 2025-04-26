'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconRefresh,
  IconChartLine,
  IconChartBar,
  IconChartCandle
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip
} from '@/components/ui/chart';
import { useTheme } from 'next-themes';
import {
  ApiProviderFactory,
  ApiProviderType
} from '../utils/api-providers/api-provider-factory';
import { HistoricalDataPoint } from '../utils/api-providers/api-provider';
import { fetchHistoricalData } from '../utils/exchange-rate-service';

interface ExchangeRateChartProps {
  fromCurrency: string;
  toCurrency: string;
  apiProvider?: ApiProviderType;
  onApiProviderChange?: (provider: ApiProviderType) => void;
}

// Define chart colors based on theme
const chartConfig: ChartConfig = {
  rate: {
    label: 'Exchange Rate',
    theme: {
      light: 'var(--primary)',
      dark: 'var(--primary)'
    }
  },
  grid: {
    theme: {
      light: 'var(--border)',
      dark: 'var(--border)'
    }
  },
  upTrend: {
    theme: {
      light: '#10b981', // green-500
      dark: '#10b981'
    }
  },
  downTrend: {
    theme: {
      light: '#ef4444', // red-500
      dark: '#ef4444'
    }
  }
};

export function ExchangeRateChart({
  fromCurrency,
  toCurrency,
  apiProvider,
  onApiProviderChange
}: ExchangeRateChartProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');
  const [isInitialDelay, setIsInitialDelay] = useState(true);
  const [isRefreshDisabled, setIsRefreshDisabled] = useState(true);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [selectedApiProvider, setSelectedApiProvider] =
    useState<ApiProviderType>(apiProvider || 'alltick');
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area');
  const { theme } = useTheme();

  // 获取可用的 API 提供者
  const availableProviders = ApiProviderFactory.getAvailableProviders();
  const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [percentChange, setPercentChange] = useState(0);

  // 初始延迟加载历史数据（20秒后）
  useEffect(() => {
    const initialDelayTimer = setTimeout(() => {
      setIsInitialDelay(false);
      setIsRefreshDisabled(false);
    }, 20000); // 20秒后允许刷新

    return () => clearTimeout(initialDelayTimer);
  }, []);

  // 监听 API Provider 变化
  useEffect(() => {
    if (apiProvider && apiProvider !== selectedApiProvider) {
      setSelectedApiProvider(apiProvider);
    }
  }, [apiProvider, selectedApiProvider]);

  // 获取历史数据
  const fetchData = async () => {
    if (isInitialDelay) return;

    setIsLoading(true);
    setIsRefreshDisabled(true);

    try {
      // 根据选择的时间范围确定 K 线类型和数量
      let klineType = 8; // 默认日 K
      let numKlines = 30; // 默认 30 条数据

      if (timeframe === 'week') {
        klineType = 9; // 周 K
        numKlines = 12; // 约 3 个月
      } else if (timeframe === 'month') {
        klineType = 10; // 月 K
        numKlines = 12; // 1 年
      }

      const data = await fetchHistoricalData(
        fromCurrency,
        toCurrency,
        numKlines,
        selectedApiProvider,
        klineType
      );

      if (data.length > 0) {
        setHistoricalData(data);

        // Calculate trend
        const firstRate = data[0].rate;
        const lastRate = data[data.length - 1].rate;
        const change = ((lastRate - firstRate) / firstRate) * 100;

        setPercentChange(parseFloat(change.toFixed(2)));
        setTrend(change > 0 ? 'up' : change < 0 ? 'down' : 'neutral');
      }

      setLastRefreshTime(new Date());
    } catch (error) {
      console.error('Error fetching historical data:', error);
    } finally {
      setIsLoading(false);

      // 10 秒后允许再次刷新（符合免费用户限制）
      setTimeout(() => {
        setIsRefreshDisabled(false);
      }, 10000);
    }
  };

  // 处理 API Provider 变更
  const handleApiProviderChange = (value: string) => {
    const newProvider = value as ApiProviderType;
    setSelectedApiProvider(newProvider);

    if (onApiProviderChange) {
      onApiProviderChange(newProvider);
    }
  };

  // 处理刷新按钮点击
  const handleRefresh = () => {
    if (!isRefreshDisabled) {
      fetchData();
    }
  };

  // 处理时间范围变更
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value as 'day' | 'week' | 'month');
    if (!isInitialDelay && !isRefreshDisabled) {
      // 设置一个短暂的延迟，确保状态更新后再获取数据
      setTimeout(() => fetchData(), 100);
    }
  };

  // 初始加载数据
  useEffect(() => {
    if (!isInitialDelay) {
      fetchData();
    }
  }, [isInitialDelay, fromCurrency, toCurrency]);

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
          <p className='text-sm'>
            <span className='font-medium'>1 {fromCurrency}</span> ={' '}
            <span className='text-primary font-medium'>
              {payload[0].value.toFixed(4)}
            </span>{' '}
            {toCurrency}
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
                <div
                  className='flex items-center'
                  style={{ color: 'var(--color-upTrend)' }}
                >
                  <IconArrowUpRight className='mr-1 h-4 w-4' />
                  <span className='font-medium'>+{percentChange}%</span>
                </div>
              ) : trend === 'down' ? (
                <div
                  className='flex items-center'
                  style={{ color: 'var(--color-downTrend)' }}
                >
                  <IconArrowDownRight className='mr-1 h-4 w-4' />
                  <span className='font-medium'>{percentChange}%</span>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className='flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center'>
          {/* API Provider 选择 */}
          <div className='w-full sm:w-1/3'>
            <Select
              value={selectedApiProvider}
              onValueChange={handleApiProviderChange}
              disabled={isInitialDelay || isRefreshDisabled}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select API provider' />
              </SelectTrigger>
              <SelectContent>
                {availableProviders.map((provider) => (
                  <SelectItem key={provider.type} value={provider.type}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 时间范围选择 */}
          <Tabs
            value={timeframe}
            onValueChange={handleTimeframeChange}
            className='w-full sm:w-auto'
          >
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger
                value='day'
                disabled={isInitialDelay || isRefreshDisabled}
              >
                Day
              </TabsTrigger>
              <TabsTrigger
                value='week'
                disabled={isInitialDelay || isRefreshDisabled}
              >
                Week
              </TabsTrigger>
              <TabsTrigger
                value='month'
                disabled={isInitialDelay || isRefreshDisabled}
              >
                Month
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* 图表类型和刷新按钮 */}
          <div className='flex gap-1'>
            {/* 图表类型切换 */}
            <Tabs
              value={chartType}
              onValueChange={(value) =>
                setChartType(value as 'area' | 'line' | 'bar')
              }
              className='w-auto'
            >
              <TabsList className='grid grid-cols-3'>
                <TabsTrigger value='area' className='px-2' title='Area Chart'>
                  <IconChartLine className='h-4 w-4' />
                </TabsTrigger>
                <TabsTrigger value='line' className='px-2' title='Line Chart'>
                  <IconChartLine className='h-4 w-4' />
                </TabsTrigger>
                <TabsTrigger value='bar' className='px-2' title='Bar Chart'>
                  <IconChartBar className='h-4 w-4' />
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* 刷新按钮 */}
            <Button
              variant='outline'
              size='icon'
              onClick={handleRefresh}
              disabled={isInitialDelay || isRefreshDisabled}
              className='ml-1'
            >
              <IconRefresh
                className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>
        </div>

        {/* 加载状态和上次刷新时间 */}
        <div className='text-muted-foreground text-xs'>
          {isInitialDelay ? (
            <span>Loading historical data (available in 20s)...</span>
          ) : lastRefreshTime ? (
            <span>Last updated: {lastRefreshTime.toLocaleTimeString()}</span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex h-[300px] w-full items-center justify-center'>
            <Skeleton className='h-[250px] w-full' />
          </div>
        ) : historicalData.length > 0 ? (
          <div className='h-[300px] w-full'>
            {chartType === 'area' && (
              <ChartContainer config={chartConfig} className='h-full w-full'>
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
                        stopColor='var(--color-rate)'
                        stopOpacity={0.8}
                      />
                      <stop
                        offset='95%'
                        stopColor='var(--color-rate)'
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
                    stroke='var(--color-grid)'
                  />
                  <ChartTooltip content={<CustomTooltip />} />
                  <Area
                    type='monotone'
                    dataKey='rate'
                    stroke='var(--color-rate)'
                    fillOpacity={1}
                    fill='url(#colorRate)'
                  />
                </AreaChart>
              </ChartContainer>
            )}

            {chartType === 'line' && (
              <ChartContainer config={chartConfig} className='h-full w-full'>
                <LineChart
                  data={historicalData.map((item) => ({
                    ...item,
                    formattedDate: formatDate(item.date)
                  }))}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
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
                    stroke='var(--color-grid)'
                  />
                  <ChartTooltip content={<CustomTooltip />} />
                  <Line
                    type='monotone'
                    dataKey='rate'
                    stroke='var(--color-rate)'
                    strokeWidth={2}
                    dot={{ r: 3, fill: 'var(--color-rate)' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ChartContainer>
            )}

            {chartType === 'bar' && (
              <ChartContainer config={chartConfig} className='h-full w-full'>
                <BarChart
                  data={historicalData.map((item) => ({
                    ...item,
                    formattedDate: formatDate(item.date)
                  }))}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
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
                    stroke='var(--color-grid)'
                  />
                  <ChartTooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey='rate'
                    fill='var(--color-rate)'
                    radius={[4, 4, 0, 0]}
                    barSize={
                      timeframe === 'day' ? 10 : timeframe === 'week' ? 20 : 30
                    }
                  />
                </BarChart>
              </ChartContainer>
            )}
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
