'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Copy,
  Download,
  CheckCircle,
  AlertCircle,
  BarChart3,
  FileText,
  Trash2
} from 'lucide-react';

import {
  DataFormatterService,
  type FormatResult
} from '../utils/data-formatter-service';

interface DataFormatterResultProps {
  result: FormatResult;
  onReset: () => void;
}

export function DataFormatterResult({
  result,
  onReset
}: DataFormatterResultProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (result.success && result.data) {
      const success = await DataFormatterService.copyToClipboard(result.data);
      if (success) {
        setCopied(true);
        toast.success('结果已复制到剪贴板');
        setTimeout(() => setCopied(false), 2000);
      } else {
        toast.error('复制失败，请手动复制');
      }
    }
  };

  const handleDownload = () => {
    if (result.success && result.data) {
      const blob = new Blob([result.data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `formatted-data-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('文件已下载');
    }
  };

  const handleSelectAll = () => {
    const textarea = document.getElementById(
      'result-textarea'
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
    }
  };

  if (!result.success) {
    return (
      <Card className='border-destructive'>
        <CardHeader>
          <CardTitle className='text-destructive flex items-center gap-2'>
            <AlertCircle className='h-5 w-5' />
            处理失败
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{result.error || '未知错误'}</AlertDescription>
          </Alert>

          <div className='mt-4'>
            <Button onClick={onReset} variant='outline'>
              重新开始
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* 成功状态和统计 */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-green-600'>
            <CheckCircle className='h-5 w-5' />
            转换成功
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result.stats && (
            <div className='grid gap-4 md:grid-cols-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600'>
                  {result.stats.originalCount}
                </div>
                <div className='text-muted-foreground text-sm'>原始行数</div>
              </div>

              <div className='text-center'>
                <div className='text-2xl font-bold text-green-600'>
                  {result.stats.processedCount}
                </div>
                <div className='text-muted-foreground text-sm'>处理后行数</div>
              </div>

              {result.stats.removedEmptyLines > 0 && (
                <div className='text-center'>
                  <div className='text-2xl font-bold text-orange-600'>
                    {result.stats.removedEmptyLines}
                  </div>
                  <div className='text-muted-foreground text-sm'>移除空行</div>
                </div>
              )}

              {result.stats.removedDuplicates > 0 && (
                <div className='text-center'>
                  <div className='text-2xl font-bold text-purple-600'>
                    {result.stats.removedDuplicates}
                  </div>
                  <div className='text-muted-foreground text-sm'>移除重复</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 结果展示 */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              转换结果
            </CardTitle>

            <div className='flex items-center gap-2'>
              <Badge variant='outline' className='font-mono'>
                {result.data?.length || 0} 字符
              </Badge>

              <Button variant='outline' size='sm' onClick={handleSelectAll}>
                全选
              </Button>

              <Button
                variant='outline'
                size='sm'
                onClick={handleCopy}
                disabled={copied}
              >
                {copied ? (
                  <>
                    <CheckCircle className='mr-1 h-4 w-4' />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className='mr-1 h-4 w-4' />
                    复制
                  </>
                )}
              </Button>

              <Button variant='outline' size='sm' onClick={handleDownload}>
                <Download className='mr-1 h-4 w-4' />
                下载
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='relative'>
            <Textarea
              id='result-textarea'
              value={result.data || ''}
              readOnly
              className='min-h-[300px] resize-none font-mono text-sm'
              placeholder='转换结果将显示在这里...'
            />

            {/* 字符统计 */}
            <div className='text-muted-foreground bg-background absolute right-2 bottom-2 rounded border px-2 py-1 text-xs'>
              {result.data?.split(/\r?\n/).length || 0} 行 |{' '}
              {result.data?.length || 0} 字符
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className='flex items-center justify-between'>
        <Button
          variant='outline'
          onClick={onReset}
          className='flex items-center gap-2'
        >
          <Trash2 className='h-4 w-4' />
          重新开始
        </Button>

        <div className='flex items-center gap-2'>
          <Button
            onClick={handleCopy}
            disabled={copied}
            className='flex items-center gap-2'
          >
            {copied ? (
              <>
                <CheckCircle className='h-4 w-4' />
                已复制
              </>
            ) : (
              <>
                <Copy className='h-4 w-4' />
                复制结果
              </>
            )}
          </Button>

          <Button
            onClick={handleDownload}
            variant='outline'
            className='flex items-center gap-2'
          >
            <Download className='h-4 w-4' />
            下载文件
          </Button>
        </div>
      </div>

      {/* 使用提示 */}
      <Alert>
        <BarChart3 className='h-4 w-4' />
        <AlertDescription>
          <strong>使用提示：</strong>
          转换结果已准备就绪，您可以直接复制使用，或下载为文本文件。 对于 SQL
          查询，可以直接将结果粘贴到 WHERE 子句中。
        </AlertDescription>
      </Alert>
    </div>
  );
}
