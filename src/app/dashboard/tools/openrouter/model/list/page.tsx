'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ReloadIcon, ExternalLinkIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';

type OpenRouterModel = {
  id: string;
  name: string;
  description: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
    image?: string;
  };
  top_provider: {
    context_length: number;
    is_moderated: boolean;
    max_completion_tokens: number | null;
  };
};

type SortConfig = {
  key: keyof OpenRouterModel | 'pricing.completion' | 'pricing.prompt';
  direction: 'asc' | 'desc';
};

export default function OpenRouterModelList() {
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<OpenRouterModel[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'asc'
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchModels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/openrouter/models');
      const data = await response.json();
      setModels(data.data);
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  useEffect(() => {
    if (!models.length) return;
    const filtered = models.filter(
      (model) =>
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredModels(filtered);
  }, [models, searchQuery]);

  const sortData = (data: OpenRouterModel[], sortConfig: SortConfig) => {
    return [...data].sort((a, b) => {
      if (sortConfig.key === 'pricing.prompt') {
        const aValue = Number(a.pricing.prompt);
        const bValue = Number(b.pricing.prompt);
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }

      if (sortConfig.key === 'pricing.completion') {
        const aValue = Number(a.pricing.completion);
        const bValue = Number(b.pricing.completion);
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }

      const key = sortConfig.key as keyof OpenRouterModel;
      const aValue = a[key];
      const bValue = b[key];

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;

      const aString = String(aValue);
      const bString = String(bValue);

      if (aString < bString) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aString > bString) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const requestSort = (key: SortConfig['key']) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedModels = sortData(filteredModels, sortConfig);

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
        加载中...
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <CardTitle>OpenRouter 可用模型列表</CardTitle>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              window.open('https://openrouter.ai/api/v1/models', '_blank')
            }
            className='ml-2'
          >
            <ExternalLinkIcon className='mr-1 h-4 w-4' />
            API文档
          </Button>
        </div>
        <div className='flex items-center space-x-2'>
          <Input
            placeholder='搜索模型...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-64'
          />
          <Button
            variant='outline'
            size='icon'
            onClick={() => {
              setLoading(true);
              fetchModels();
            }}
          >
            <ReloadIcon className='h-4 w-4' />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='relative h-[calc(100vh-12rem)] overflow-hidden'>
          <div className='absolute inset-0 overflow-auto'>
            <Table>
              <TableHeader className='bg-background sticky top-0'>
                <TableRow>
                  <TableHead
                    onClick={() => requestSort('name')}
                    className='cursor-pointer hover:bg-gray-100'
                  >
                    模型名称{' '}
                    {sortConfig.key === 'name' &&
                      (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead
                    onClick={() => requestSort('id')}
                    className='cursor-pointer hover:bg-gray-100'
                  >
                    模型ID{' '}
                    {sortConfig.key === 'id' &&
                      (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead
                    onClick={() => requestSort('pricing.prompt')}
                    className='cursor-pointer hover:bg-gray-100'
                  >
                    输入价格{' '}
                    {sortConfig.key === 'pricing.prompt' &&
                      (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead
                    onClick={() => requestSort('pricing.completion')}
                    className='cursor-pointer hover:bg-gray-100'
                  >
                    输出价格{' '}
                    {sortConfig.key === 'pricing.completion' &&
                      (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead
                    onClick={() => requestSort('context_length')}
                    className='cursor-pointer hover:bg-gray-100'
                  >
                    上下文长度{' '}
                    {sortConfig.key === 'context_length' &&
                      (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className='w-[180px]'>描述</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedModels.map((model) => (
                  <TableRow key={model.id} className='hover:bg-muted/50'>
                    <TableCell className='max-w-[200px] truncate font-medium'>
                      {model.name}
                    </TableCell>
                    <TableCell className='max-w-[180px] truncate'>
                      {model.id}
                    </TableCell>
                    <TableCell>
                      ${Number(model.pricing.prompt).toFixed(8)}
                    </TableCell>
                    <TableCell>
                      ${Number(model.pricing.completion).toFixed(8)}
                    </TableCell>
                    <TableCell>
                      {model.context_length.toLocaleString()}
                    </TableCell>
                    <TableCell className='max-w-[180px]'>
                      <div className='truncate hover:absolute hover:z-10 hover:overflow-visible hover:rounded-md hover:bg-white hover:p-2 hover:whitespace-normal hover:shadow-lg'>
                        {model.description}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
