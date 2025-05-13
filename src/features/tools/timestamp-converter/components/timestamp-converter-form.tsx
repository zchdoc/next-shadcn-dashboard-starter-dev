'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

type ConversionResult = {
  timestamp: string;
  date: string;
  valid: boolean;
};

export function TimestampConverterForm() {
  const [input, setInput] = useState<string>('');
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const convertTimestamp = (timestampStr: string): ConversionResult => {
    const trimmed = timestampStr.trim();
    if (!trimmed) {
      return { timestamp: '', date: '', valid: false };
    }

    let ts: number;

    // 如果是数字字符串
    if (/^\d+$/.test(trimmed)) {
      // 根据长度判断是秒还是毫秒
      ts =
        trimmed.length <= 10
          ? Number.parseInt(trimmed) * 1000 // 秒转毫秒
          : Number.parseInt(trimmed);
    } else {
      return { timestamp: trimmed, date: '无效的时间戳', valid: false };
    }

    try {
      const date = new Date(ts);
      // 检查是否是有效日期
      if (Number.isNaN(date.getTime())) {
        return { timestamp: trimmed, date: '无效的时间戳', valid: false };
      }

      // 格式化日期
      const formattedDate = date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      return { timestamp: trimmed, date: formattedDate, valid: true };
    } catch (error) {
      return { timestamp: trimmed, date: '转换错误', valid: false };
    }
  };

  const handleConvert = () => {
    if (!input.trim()) {
      toast('请输入至少一个时间戳进行转换');
      return;
    }

    const lines = input.split('\n').filter((line) => line.trim());
    const newResults = lines.map((line) => convertTimestamp(line));
    setResults(newResults);

    // 当结果数量较多时显示回到顶部按钮
    if (lines.length > 20) {
      setShowBackToTop(true);
    }
  };

  const handleClear = () => {
    setInput('');
    setResults([]);
    setShowBackToTop(false);
  };

  const scrollToTop = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='space-y-4' ref={formRef}>
      <div className='bg-background sticky top-0 z-10 flex gap-2 rounded-md border p-2 shadow-sm'>
        <Button onClick={handleConvert}>转换</Button>
        <Button variant='outline' onClick={handleClear}>
          清空
        </Button>
        {showBackToTop && (
          <Button variant='outline' className='ml-auto' onClick={scrollToTop}>
            返回顶部
          </Button>
        )}
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>输入时间戳</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder='每行输入一个时间戳，支持秒级和毫秒级时间戳'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={15}
              className='font-mono'
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>转换结果</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className='space-y-2 font-mono'>
                {results.map((result, index) => (
                  <div
                    key={`result-${index}-${result.timestamp}`}
                    className={`rounded p-2 ${
                      result.valid
                        ? 'bg-green-50 dark:bg-green-950/20'
                        : 'bg-red-50 dark:bg-red-950/20'
                    }`}
                  >
                    <div className='text-muted-foreground text-sm'>
                      {result.timestamp}
                    </div>
                    <div
                      className={
                        result.valid
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }
                    >
                      {result.date}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-muted-foreground flex h-[300px] items-center justify-center'>
                转换结果将显示在这里
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showBackToTop && (
        <div className='sticky right-4 bottom-4 flex justify-end'>
          <Button
            variant='secondary'
            className='shadow-md'
            onClick={scrollToTop}
          >
            返回顶部
          </Button>
        </div>
      )}
    </div>
  );
}
