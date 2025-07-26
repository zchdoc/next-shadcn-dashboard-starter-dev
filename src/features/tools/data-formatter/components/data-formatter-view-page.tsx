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
  const [showFeatures, setShowFeatures] = React.useState(false);

  const handleResult = (newResult: FormatResult) => {
    setResult(newResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setResult(null);
    setShowResult(false);
  };

  return (
    <div className='space-y-3'>
      {/* 简化的页面标题 */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg'>
            <FileText className='text-primary h-4 w-4' />
          </div>
          <div>
            <h1 className='text-xl font-bold'>数据格式转换工具</h1>
            <p className='text-muted-foreground text-xs'>
              将竖列数据转换为横列，支持多种格式输出
            </p>
          </div>
        </div>

        {!showResult && (
          <button
            onClick={() => setShowFeatures(!showFeatures)}
            className='text-muted-foreground hover:text-primary text-xs'
          >
            {showFeatures ? '隐藏功能介绍' : '查看功能介绍'}
          </button>
        )}
      </div>

      {/* 功能特点 - 可折叠 */}
      {!showResult && showFeatures && (
        <div className='grid gap-2 md:grid-cols-3'>
          <Card className='border-blue-200 bg-blue-50/50 shadow-sm dark:border-blue-800 dark:bg-blue-950/50'>
            <CardContent className='p-2'>
              <div className='flex items-center gap-1'>
                <Database className='h-3 w-3 text-blue-600' />
                <h3 className='text-xs font-semibold text-blue-900 dark:text-blue-100'>
                  SQL 查询优化
                </h3>
              </div>
              <p className='mt-1 text-xs text-blue-700 dark:text-blue-200'>
                直接生成 SQL IN 子句格式，提升数据库查询效率
              </p>
            </CardContent>
          </Card>

          <Card className='border-green-200 bg-green-50/50 shadow-sm dark:border-green-800 dark:bg-green-950/50'>
            <CardContent className='p-2'>
              <div className='flex items-center gap-1'>
                <Code className='h-3 w-3 text-green-600' />
                <h3 className='text-xs font-semibold text-green-900 dark:text-green-100'>
                  多种格式
                </h3>
              </div>
              <p className='mt-1 text-xs text-green-700 dark:text-green-200'>
                支持逗号分隔、引号包围、数组格式等多种输出格式
              </p>
            </CardContent>
          </Card>

          <Card className='border-purple-200 bg-purple-50/50 shadow-sm dark:border-purple-800 dark:bg-purple-950/50'>
            <CardContent className='p-2'>
              <div className='flex items-center gap-1'>
                <Zap className='h-3 w-3 text-purple-600' />
                <h3 className='text-xs font-semibold text-purple-900 dark:text-purple-100'>
                  实时预览
                </h3>
              </div>
              <p className='mt-1 text-xs text-purple-700 dark:text-purple-200'>
                输入即时预览，所见即所得的转换体验
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 使用说明 - 简化 */}
      {!showResult && (
        <Alert className='py-1'>
          <Info className='h-3 w-3' />
          <AlertDescription className='text-xs'>
            在左侧输入框中每行输入一个数据项，选择合适的输出格式，工具会自动将竖列数据转换为横列格式。
          </AlertDescription>
        </Alert>
      )}

      {/* 主要内容 */}
      {!showResult ? (
        <DataFormatterForm onResult={handleResult} />
      ) : (
        <DataFormatterResult result={result!} onReset={handleReset} />
      )}

      {/* 使用示例 - 可选隐藏 */}
      {!showResult && showFeatures && (
        <Card className='shadow-sm'>
          <CardHeader className='py-2'>
            <CardTitle className='flex items-center gap-1 text-sm'>
              <ArrowRight className='h-3 w-3' />
              转换示例
            </CardTitle>
          </CardHeader>
          <CardContent className='p-2'>
            <div className='grid gap-3 md:grid-cols-2'>
              {/* 输入示例 */}
              <div>
                <h4 className='mb-1 flex items-center gap-1 text-xs font-semibold'>
                  <Badge variant='outline' className='h-4 text-[10px]'>
                    输入
                  </Badge>
                  竖列数据
                </h4>
                <div className='bg-muted rounded p-2 font-mono text-xs'>
                  apple
                  <br />
                  banana
                  <br />
                  cherry
                </div>
              </div>

              {/* 输出示例 */}
              <div>
                <h4 className='mb-1 flex items-center gap-1 text-xs font-semibold'>
                  <Badge variant='outline' className='h-4 text-[10px]'>
                    输出
                  </Badge>
                  横列格式
                </h4>
                <div className='space-y-1'>
                  <div>
                    <div className='text-muted-foreground mb-1 text-[10px]'>
                      SQL IN 子句
                    </div>
                    <div className='bg-muted rounded p-1 font-mono text-xs'>
                      (&apos;apple&apos;,&apos;banana&apos;,&apos;cherry&apos;)
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
