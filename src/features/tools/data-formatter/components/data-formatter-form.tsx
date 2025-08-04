'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Copy, FileText, RotateCcw, Settings } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';

import {
  dataFormatterSchema,
  outputFormatOptions,
  type DataFormatterFormData
} from '../schemas/data-formatter-schema';
import {
  DataFormatterService,
  type FormatResult
} from '../utils/data-formatter-service';

interface DataFormatterFormProps {
  onResult: (result: FormatResult) => void;
}

export function DataFormatterForm({ onResult }: DataFormatterFormProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [previewResult, setPreviewResult] = React.useState<FormatResult | null>(
    null
  );
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const form = useForm<DataFormatterFormData>({
    resolver: zodResolver(dataFormatterSchema),
    defaultValues: {
      inputData: '',
      outputFormat: 'comma-separated',
      removeEmptyLines: true,
      trimWhitespace: true,
      removeDuplicates: false,
      customPrefix: '',
      customSuffix: '',
      customSeparator: ',',
      toLowerCase: false,
      toUpperCase: false
    }
  });

  // 监听表单值变化
  const inputData = form.watch('inputData');
  const outputFormat = form.watch('outputFormat');
  const removeEmptyLines = form.watch('removeEmptyLines');
  const trimWhitespace = form.watch('trimWhitespace');
  const removeDuplicates = form.watch('removeDuplicates');
  const customPrefix = form.watch('customPrefix');
  const customSuffix = form.watch('customSuffix');
  const customSeparator = form.watch('customSeparator');
  const toLowerCase = form.watch('toLowerCase');
  const toUpperCase = form.watch('toUpperCase');

  const isCustomFormat = outputFormat === 'custom';

  // 实时预览 - 完整预览，不限制行数
  const currentPreview = React.useMemo(() => {
    if (inputData?.trim()) {
      const formData: DataFormatterFormData = {
        inputData,
        outputFormat,
        removeEmptyLines,
        trimWhitespace,
        removeDuplicates,
        customPrefix: customPrefix || '',
        customSuffix: customSuffix || '',
        customSeparator: customSeparator || ',',
        toLowerCase,
        toUpperCase
      };
      // 移除行数限制，直接格式化完整数据
      return DataFormatterService.formatData(formData);
    }
    return null;
  }, [
    inputData,
    outputFormat,
    removeEmptyLines,
    trimWhitespace,
    removeDuplicates,
    customPrefix,
    customSuffix,
    customSeparator,
    toLowerCase,
    toUpperCase
  ]);

  // 更新预览结果
  React.useEffect(() => {
    setPreviewResult(currentPreview);
  }, [currentPreview]);

  const handleSubmit = async (data: DataFormatterFormData) => {
    setIsProcessing(true);

    try {
      // 验证输入
      const validation = DataFormatterService.validateInput(data.inputData);
      if (!validation.valid) {
        toast.error(validation.message);
        return;
      }

      // 格式化数据
      const result = DataFormatterService.formatData(data);

      if (result.success) {
        onResult(result);
        toast.success('数据格式化成功！');
      } else {
        toast.error(result.error || '格式化失败');
      }
    } catch (error) {
      toast.error('处理过程中发生错误');
      console.error('Format error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadExample = () => {
    form.setValue('inputData', DataFormatterService.getExampleData());
    toast.success('已加载示例数据');
  };

  const handleReset = () => {
    form.reset();
    setPreviewResult(null);
    toast.success('已重置表单');
  };

  const handleCopyResult = async () => {
    if (previewResult?.data) {
      const success = await DataFormatterService.copyToClipboard(
        previewResult.data
      );
      if (success) {
        toast.success('结果已复制到剪贴板');
      } else {
        toast.error('复制失败');
      }
    }
  };

  const currentFormatOption = outputFormatOptions.find(
    (option) => option.value === outputFormat
  );

  // 计算输入数据统计
  const inputStats = React.useMemo(() => {
    if (!inputData?.trim()) return null;
    const lines = inputData.split(/\r?\n/);
    const nonEmptyLines = lines.filter((line) => line.trim() !== '');
    return {
      totalLines: lines.length,
      nonEmptyLines: nonEmptyLines.length
    };
  }, [inputData]);

  return (
    <div className='space-y-2'>
      {/* 顶部工具栏 - 更紧凑 */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-1'>
          <FileText className='text-primary h-3 w-3' />
          <h2 className='text-sm font-semibold'>数据格式转换</h2>
        </div>
        <div className='flex gap-1'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={handleLoadExample}
          >
            加载示例
          </Button>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={handleReset}
          >
            <RotateCcw className='mr-1 h-3 w-3' />
            重置
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-2'>
          <div className='grid gap-2 lg:grid-cols-2'>
            {/* 左侧：输入区域 - 更紧凑 */}
            <Card className='shadow-sm'>
              <CardHeader className='pt-1 pb-1'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-xs'>输入数据</CardTitle>
                  {inputStats && (
                    <div className='text-muted-foreground flex gap-2 text-xs'>
                      <span>总行数: {inputStats.totalLines}</span>
                      <span>有效行数: {inputStats.nonEmptyLines}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className='p-2'>
                <FormField
                  control={form.control}
                  name='inputData'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder='请输入要转换的数据，每行一个项目...'
                          className='h-[200px] overflow-y-auto font-mono text-xs'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 右侧：输出区域 - 更紧凑 */}
            <Card className='shadow-sm'>
              <CardHeader className='pt-1 pb-1'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-xs'>格式化结果</CardTitle>
                  {previewResult?.success && (
                    <div className='flex items-center gap-1'>
                      <Badge variant='secondary' className='text-xs'>
                        {currentFormatOption?.label || '未知格式'}
                      </Badge>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={handleCopyResult}
                      >
                        <Copy className='h-3 w-3' />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className='p-2'>
                {previewResult ? (
                  <Textarea
                    value={
                      previewResult.success
                        ? previewResult.data
                        : previewResult.error
                    }
                    readOnly
                    className={`h-[200px] overflow-y-auto font-mono text-xs ${
                      previewResult.success
                        ? 'text-foreground'
                        : 'text-destructive'
                    }`}
                  />
                ) : (
                  <div className='text-muted-foreground flex h-[200px] items-center justify-center'>
                    <div className='text-center'>
                      <FileText className='mx-auto mb-1 h-8 w-8 opacity-50' />
                      <p className='text-xs'>输入数据后将显示格式化结果</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 格式选择和设置 - 更紧凑 */}
          <Card className='shadow-sm'>
            <CardContent className='p-3'>
              <div className='grid gap-3 md:grid-cols-2'>
                {/* 输出格式选择 */}
                <FormField
                  control={form.control}
                  name='outputFormat'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs'>输出格式</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className='h-8 text-xs'>
                            <SelectValue placeholder='选择输出格式' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {outputFormatOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className='text-xs'
                            >
                              <div className='flex flex-col'>
                                <span>{option.label}</span>
                                <span className='text-muted-foreground font-mono text-xs'>
                                  {option.example}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 提交按钮 */}
                <div className='flex items-end'>
                  <Button
                    type='submit'
                    className='h-8 w-full text-xs'
                    disabled={isProcessing || !inputData?.trim()}
                  >
                    {isProcessing ? '处理中...' : '开始转换'}
                  </Button>
                </div>
              </div>

              {/* 自定义格式选项 */}
              {isCustomFormat && (
                <div className='bg-muted/50 mt-2 space-y-2 rounded-lg border p-2'>
                  <h4 className='text-xs font-medium'>自定义格式设置</h4>
                  <div className='grid gap-2 md:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='customPrefix'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xs'>前缀</FormLabel>
                          <FormControl>
                            <input
                              className='border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-7 w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                              placeholder='例如: "'
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='customSuffix'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xs'>后缀</FormLabel>
                          <FormControl>
                            <input
                              className='border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-7 w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                              placeholder='例如: "'
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='customSeparator'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xs'>分隔符</FormLabel>
                          <FormControl>
                            <input
                              className='border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-7 w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                              placeholder='例如: ,'
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* 高级选项 */}
              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='mt-2 w-full justify-center'
                  >
                    <Settings className='mr-1 h-3 w-3' />
                    {showAdvanced ? '隐藏' : '显示'}高级选项
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className='mt-2 space-y-2'>
                  <Separator />
                  <div className='grid gap-2 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='removeEmptyLines'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-2'>
                          <FormLabel className='text-xs font-medium'>
                            去除空行
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className='scale-75'
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='trimWhitespace'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-2'>
                          <FormLabel className='text-xs font-medium'>
                            去除首尾空格
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className='scale-75'
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='removeDuplicates'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-2'>
                          <FormLabel className='text-xs font-medium'>
                            去除重复项
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className='scale-75'
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='toLowerCase'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-2'>
                          <FormLabel className='text-xs font-medium'>
                            转换为小写
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (checked) {
                                  form.setValue('toUpperCase', false);
                                }
                              }}
                              className='scale-75'
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='toUpperCase'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-2'>
                          <FormLabel className='text-xs font-medium'>
                            转换为大写
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (checked) {
                                  form.setValue('toLowerCase', false);
                                }
                              }}
                              className='scale-75'
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
