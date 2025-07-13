'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowRight, Database, Code, Zap, Info } from 'lucide-react';

import { DataFormatterForm } from './data-formatter-form';
import { DataFormatterResult } from './data-formatter-result';
import { type FormatResult } from '../utils/data-formatter-service';

export function DataFormatterViewPage() {
  const [result, setResult] = React.useState<FormatResult | null>(null);
  const [showResult, setShowResult] = React.useState(false);

  const handleResult = (newResult: FormatResult) => {
    setResult(newResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setResult(null);
    setShowResult(false);
  };

  return (
    <div className='space-y-6'>
      {/* 页面标题和描述 */}
      <div className='space-y-4'>
        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg'>
            <FileText className='text-primary h-6 w-6' />
          </div>
          <div>
            <h1 className='text-3xl font-bold'>数据格式转换工具</h1>
            <p className='text-muted-foreground'>
              将竖列数据转换为横列，支持多种格式输出
            </p>
          </div>
        </div>

        {/* 功能特点 */}
        <div className='grid gap-4 md:grid-cols-3'>
          <Card className='border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50'>
            <CardContent className='p-4'>
              <div className='mb-2 flex items-center gap-2'>
                <Database className='h-5 w-5 text-blue-600' />
                <h3 className='font-semibold text-blue-900 dark:text-blue-100'>
                  SQL 查询优化
                </h3>
              </div>
              <p className='text-sm text-blue-700 dark:text-blue-200'>
                直接生成 SQL IN 子句格式，提升数据库查询效率
              </p>
            </CardContent>
          </Card>

          <Card className='border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50'>
            <CardContent className='p-4'>
              <div className='mb-2 flex items-center gap-2'>
                <Code className='h-5 w-5 text-green-600' />
                <h3 className='font-semibold text-green-900 dark:text-green-100'>
                  多种格式
                </h3>
              </div>
              <p className='text-sm text-green-700 dark:text-green-200'>
                支持逗号分隔、引号包围、数组格式等多种输出格式
              </p>
            </CardContent>
          </Card>

          <Card className='border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/50'>
            <CardContent className='p-4'>
              <div className='mb-2 flex items-center gap-2'>
                <Zap className='h-5 w-5 text-purple-600' />
                <h3 className='font-semibold text-purple-900 dark:text-purple-100'>
                  实时预览
                </h3>
              </div>
              <p className='text-sm text-purple-700 dark:text-purple-200'>
                输入即时预览，所见即所得的转换体验
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 使用说明 */}
      {!showResult && (
        <Alert>
          <Info className='h-4 w-4' />
          <AlertDescription>
            <strong>使用说明：</strong>
            在左侧输入框中每行输入一个数据项，选择合适的输出格式，工具会自动将竖列数据转换为横列格式。
            特别适合处理需要在数据库中使用 IN 语句查询的数据。
          </AlertDescription>
        </Alert>
      )}

      {/* 主要内容 */}
      {!showResult ? (
        <DataFormatterForm onResult={handleResult} />
      ) : (
        <DataFormatterResult result={result!} onReset={handleReset} />
      )}

      {/* 使用示例 */}
      {!showResult && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ArrowRight className='h-5 w-5' />
              转换示例
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6 md:grid-cols-2'>
              {/* 输入示例 */}
              <div>
                <h4 className='mb-2 flex items-center gap-2 font-semibold'>
                  <Badge variant='outline'>输入</Badge>
                  竖列数据
                </h4>
                <div className='bg-muted rounded p-3 font-mono text-sm'>
                  apple
                  <br />
                  banana
                  <br />
                  cherry
                  <br />
                  date
                  <br />
                  elderberry
                </div>
              </div>

              {/* 输出示例 */}
              <div>
                <h4 className='mb-2 flex items-center gap-2 font-semibold'>
                  <Badge variant='outline'>输出</Badge>
                  横列格式
                </h4>
                <div className='space-y-2'>
                  <div>
                    <div className='text-muted-foreground mb-1 text-xs'>
                      逗号分隔
                    </div>
                    <div className='bg-muted rounded p-2 font-mono text-sm'>
                      apple,banana,cherry,date,elderberry
                    </div>
                  </div>
                  <div>
                    <div className='text-muted-foreground mb-1 text-xs'>
                      SQL IN 子句
                    </div>
                    <div className='bg-muted rounded p-2 font-mono text-sm'>
                      (&apos;apple&apos;,&apos;banana&apos;,&apos;cherry&apos;,&apos;date&apos;,&apos;elderberry&apos;)
                    </div>
                  </div>
                  <div>
                    <div className='text-muted-foreground mb-1 text-xs'>
                      数组格式
                    </div>
                    <div className='bg-muted rounded p-2 font-mono text-sm'>
                      [&quot;apple&quot;,&quot;banana&quot;,&quot;cherry&quot;,&quot;date&quot;,&quot;elderberry&quot;]
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
