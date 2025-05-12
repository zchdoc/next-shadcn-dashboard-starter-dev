'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { parseProtocolData } from './protocol-parser';
import { ProtocolData, ProtocolField } from './types';

export default function ProtocolAnalyzerPage() {
  const [inputData, setInputData] = useState('');
  const [protocolType, setProtocolType] = useState('consumption');
  const [parsedData, setParsedData] = useState<ProtocolData | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = () => {
    if (!inputData.trim()) {
      setError('请输入协议数据');
      return;
    }

    if (protocolType !== 'consumption') {
      setError(`${getProtocolTypeLabel(protocolType)}暂不可用`);
      return;
    }

    try {
      const data = parseProtocolData(inputData);
      setParsedData(data);
      setError('');
    } catch (err) {
      setError(`解析错误: ${err instanceof Error ? err.message : '格式无效'}`);
      setParsedData(null);
    }
  };

  const getProtocolTypeLabel = (type: string) => {
    switch (type) {
      case 'consumption':
        return '消费数据';
      case 'status':
        return '状态包';
      case 'subsidy':
        return '补助请求';
      default:
        return type;
    }
  };

  // 渲染协议字段表格
  const renderFieldTable = (fields: Record<string, ProtocolField>) => (
    <div className='overflow-hidden rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[200px]'>字段名称</TableHead>
            <TableHead className='w-[70px]'>字节数</TableHead>
            <TableHead>十六进制值</TableHead>
            <TableHead>十进制值/解释</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(fields).map(([key, field]) => (
            <TableRow key={key} className='hover:bg-muted/50'>
              <TableCell className='font-medium'>{field.label}</TableCell>
              <TableCell>{field.size}</TableCell>
              <TableCell className='font-mono text-xs'>{field.hex}</TableCell>
              <TableCell>
                {typeof field.dec === 'string' ? (
                  field.dec
                ) : (
                  <div className='flex flex-col'>
                    <span>{field.dec.toLocaleString()}</span>
                    {field.description && (
                      <span className='text-muted-foreground text-xs'>
                        {field.description}
                      </span>
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  // 渲染原始数据可视化
  const renderRawDataPreview = () => {
    if (!parsedData) return null;

    const rawData = parsedData.rawData;
    const groups = [];

    for (let i = 0; i < rawData.length; i += 2) {
      groups.push(rawData.substring(i, i + 2));
    }

    return (
      <Card className='mb-4'>
        <CardHeader className='py-2'>
          <CardTitle className='text-sm'>原始协议数据</CardTitle>
        </CardHeader>
        <CardContent className='flex-wrap py-2 font-mono text-xs break-all'>
          {groups.map((byte, index) => (
            <Badge key={index} variant='outline' className='m-1'>
              {byte}
            </Badge>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className='container mx-auto py-4'>
      <Card className='mb-4'>
        <CardHeader className='pb-2'>
          <CardTitle>XB协议分析器</CardTitle>
          <CardDescription>分析硬件通信协议数据包</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div>
            <label className='mb-1 block text-sm font-medium'>
              协议数据（十六进制）
            </label>
            <Input
              placeholder='输入十六进制数据包...'
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              className='font-mono'
            />
          </div>

          <div className='flex items-end gap-4'>
            <div className='w-48'>
              <label className='mb-1 block text-sm font-medium'>
                下位机发送
              </label>
              <Select value={protocolType} onValueChange={setProtocolType}>
                <SelectTrigger>
                  <SelectValue placeholder='选择协议类型' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='consumption'>消费数据</SelectItem>
                  <SelectItem value='status'>状态包</SelectItem>
                  <SelectItem value='subsidy'>补助请求</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAnalyze}>解析</Button>
          </div>

          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {parsedData && (
        <>
          {renderRawDataPreview()}

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle>解析结果</CardTitle>
              <CardDescription>协议数据解析完成</CardDescription>
            </CardHeader>
            <CardContent className='p-1 sm:p-3'>
              <Tabs defaultValue='all' className='w-full'>
                <TabsList className='mb-2 w-full justify-start'>
                  <TabsTrigger value='all'>全部字段</TabsTrigger>
                  <TabsTrigger value='header'>协议头</TabsTrigger>
                  <TabsTrigger value='body'>协议体</TabsTrigger>
                </TabsList>

                <ScrollArea className='h-[70vh]'>
                  <TabsContent value='all' className='mt-0 space-y-4'>
                    <div>
                      <h3 className='mb-2 text-lg font-semibold'>CRC校验</h3>
                      {renderFieldTable({ crc: parsedData.crc })}
                    </div>

                    <div>
                      <h3 className='mb-2 text-lg font-semibold'>协议头</h3>
                      {renderFieldTable(parsedData.header)}
                    </div>

                    <div>
                      <h3 className='mb-2 text-lg font-semibold'>协议体</h3>
                      {renderFieldTable(parsedData.body)}
                    </div>
                  </TabsContent>

                  <TabsContent value='header' className='mt-0'>
                    {renderFieldTable(parsedData.header)}
                  </TabsContent>

                  <TabsContent value='body' className='mt-0'>
                    {renderFieldTable(parsedData.body)}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
