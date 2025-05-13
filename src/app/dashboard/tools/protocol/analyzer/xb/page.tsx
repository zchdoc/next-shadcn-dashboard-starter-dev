'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import type { ProtocolData, ProtocolField } from './types';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProtocolAnalyzerPage() {
  const [inputData, setInputData] = useState('');
  const [protocolType, setProtocolType] = useState('');
  const [parsedData, setParsedData] = useState<ProtocolData | null>(null);
  const [error, setError] = useState('');
  const [isInputValid, setIsInputValid] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 检查输入是否有效
  useEffect(() => {
    setIsInputValid(inputData.trim().length >= 10);
  }, [inputData]);

  // 当选择协议类型时自动解析
  useEffect(() => {
    if (protocolType && isInputValid) {
      handleAnalyze();
    }
  }, [protocolType, isInputValid]);

  // 监听滚动
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setShowScrollTop(containerRef.current.scrollTop > 100);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

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

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
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
    <div className='mb-4 overflow-x-auto rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[180px]'>字段名称</TableHead>
            <TableHead className='w-[60px]'>字节数</TableHead>
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
                    <span>{String(field.dec)}</span>
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
      <div className='mb-6 rounded-md border p-3'>
        <h3 className='mb-2 text-base font-medium'>原始协议数据</h3>
        <div className='flex flex-wrap font-mono text-xs break-all'>
          {groups.map((byte, i) => (
            <Badge
              key={`byte-${i}-${byte}`}
              variant='outline'
              className='m-0.5'
            >
              {byte}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className='h-[calc(100dvh-52px)] overflow-auto'
      style={{ scrollbarGutter: 'stable' }}
    >
      <div className='mx-auto w-[98%] px-4 py-4 md:px-6'>
        {/* 紧凑的输入控件区域 */}
        <div className='mb-4 flex flex-col space-y-3 md:flex-row md:items-end md:space-y-0 md:space-x-4'>
          <div className='flex-grow'>
            <Input
              placeholder='输入十六进制数据包...'
              value={inputData}
              onChange={(e) => {
                setInputData(e.target.value);
                if (protocolType) setProtocolType('');
              }}
              className='font-mono'
            />
          </div>
          <div className='w-full md:w-48'>
            <Select
              value={protocolType}
              onValueChange={setProtocolType}
              disabled={!isInputValid}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='选择协议类型以解析' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='consumption'>消费数据</SelectItem>
                <SelectItem value='status'>状态包</SelectItem>
                <SelectItem value='subsidy'>补助请求</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <Alert variant='destructive' className='mb-4'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 解析结果区域 - 使用简单的卡片布局 */}
        {parsedData ? (
          <div>
            <Card className='mb-6'>
              <CardHeader className='py-3'>
                <CardTitle>XB协议分析结果</CardTitle>
                <CardDescription>协议数据解析完成</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue='all' className='w-full'>
                  <TabsList className='mb-4 w-full justify-start'>
                    <TabsTrigger value='all'>全部字段</TabsTrigger>
                    <TabsTrigger value='header'>协议头</TabsTrigger>
                    <TabsTrigger value='body'>协议体</TabsTrigger>
                  </TabsList>

                  <TabsContent value='all' className='mt-0 space-y-6'>
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
                </Tabs>
              </CardContent>
            </Card>

            {/* 原始数据单独显示 */}
            {renderRawDataPreview()}
          </div>
        ) : (
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle>XB协议分析器</CardTitle>
              <CardDescription>分析硬件通信协议数据包</CardDescription>
            </CardHeader>
            <CardContent className='p-8 text-center'>
              <p className='text-muted-foreground'>
                请输入协议数据并选择协议类型以开始解析
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 回到顶部按钮 */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className='fixed right-8 bottom-8 z-50'
            onClick={scrollToTop}
          >
            <Button
              className='bg-primary hover:bg-primary/90 dark:bg-primary/90 dark:hover:bg-primary border-primary-foreground/20 relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 p-0 shadow-lg'
              aria-label='回到顶部'
              title='回到顶部'
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }}
              >
                <ChevronsUp className='text-primary-foreground h-7 w-7' />
              </motion.div>
            </Button>
            <motion.div
              className='bg-primary/20 pointer-events-none absolute inset-0 rounded-full blur-sm'
              animate={{
                scale: [0.85, 1.05, 0.85],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
