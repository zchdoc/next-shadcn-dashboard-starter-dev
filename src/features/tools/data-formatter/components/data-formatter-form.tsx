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
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import { Copy, FileText, RotateCcw } from 'lucide-react';

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

  const watchedValues = form.watch();
  const isCustomFormat = watchedValues.outputFormat === 'custom';

  // 实时预览
  React.useEffect(() => {
    if (watchedValues.inputData && watchedValues.inputData.trim()) {
      const preview = DataFormatterService.previewFormat(watchedValues, 3);
      setPreviewResult(preview);
    } else {
      setPreviewResult(null);
    }
  }, [watchedValues]);

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

  const currentFormatOption = outputFormatOptions.find(
    (option) => option.value === watchedValues.outputFormat
  );

  return (
    <div className='grid gap-6 md:grid-cols-2'>
      {/* 左侧：表单 */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5' />
            数据格式转换
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='space-y-6'
            >
              {/* 输入数据 */}
              <FormField
                control={form.control}
                name='inputData'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>输入数据</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='请输入要转换的数据，每行一个项目...'
                        className='min-h-[200px] font-mono'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      每行输入一个数据项，支持最多 10,000 行
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 快捷操作 */}
              <div className='flex gap-2'>
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
                  <RotateCcw className='mr-1 h-4 w-4' />
                  重置
                </Button>
              </div>

              <Separator />

              {/* 输出格式 */}
              <FormField
                control={form.control}
                name='outputFormat'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>输出格式</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='选择输出格式' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {outputFormatOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
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

              {/* 自定义格式选项 */}
              {isCustomFormat && (
                <div className='bg-muted/50 space-y-4 rounded-lg border p-4'>
                  <h4 className='font-medium'>自定义格式设置</h4>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='customPrefix'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>前缀</FormLabel>
                          <FormControl>
                            <Input placeholder='例如: "' {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='customSuffix'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>后缀</FormLabel>
                          <FormControl>
                            <Input placeholder='例如: "' {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='customSeparator'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>分隔符</FormLabel>
                        <FormControl>
                          <Input placeholder='例如: ,' {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Separator />

              {/* 处理选项 */}
              <div className='space-y-4'>
                <h4 className='font-medium'>处理选项</h4>

                <div className='grid gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='removeEmptyLines'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>去除空行</FormLabel>
                          <FormDescription>自动移除空白行</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='trimWhitespace'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>
                            去除首尾空格
                          </FormLabel>
                          <FormDescription>清理每行的空白字符</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='removeDuplicates'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>
                            去除重复项
                          </FormLabel>
                          <FormDescription>移除重复的数据项</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='toLowerCase'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>
                            转换为小写
                          </FormLabel>
                          <FormDescription>将所有文本转为小写</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              if (checked) {
                                form.setValue('toUpperCase', false);
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='toUpperCase'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>
                            转换为大写
                          </FormLabel>
                          <FormDescription>将所有文本转为大写</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              if (checked) {
                                form.setValue('toLowerCase', false);
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 提交按钮 */}
              <Button
                type='submit'
                className='w-full'
                disabled={isProcessing || !watchedValues.inputData?.trim()}
              >
                {isProcessing ? '处理中...' : '开始转换'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* 右侧：预览 */}
      <Card>
        <CardHeader>
          <CardTitle>实时预览</CardTitle>
        </CardHeader>
        <CardContent>
          {previewResult ? (
            <div className='space-y-4'>
              {/* 格式信息 */}
              <div className='flex items-center gap-2'>
                <Badge variant='secondary'>
                  {currentFormatOption?.label || '未知格式'}
                </Badge>
                {previewResult.stats && (
                  <span className='text-muted-foreground text-sm'>
                    预览前 3 行
                  </span>
                )}
              </div>

              {/* 预览结果 */}
              <div className='relative'>
                <Textarea
                  value={
                    previewResult.success
                      ? previewResult.data
                      : previewResult.error
                  }
                  readOnly
                  className={`min-h-[100px] font-mono ${
                    previewResult.success
                      ? 'text-foreground'
                      : 'text-destructive'
                  }`}
                />
                {previewResult.success && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute top-2 right-2'
                    onClick={() => {
                      if (previewResult.data) {
                        DataFormatterService.copyToClipboard(
                          previewResult.data
                        );
                        toast.success('预览结果已复制到剪贴板');
                      }
                    }}
                  >
                    <Copy className='h-4 w-4' />
                  </Button>
                )}
              </div>

              {/* 示例说明 */}
              <p className='text-muted-foreground text-sm'>
                {currentFormatOption?.example && (
                  <>
                    <strong>格式示例：</strong>
                    <code className='bg-muted ml-2 rounded px-2 py-1 text-xs'>
                      {currentFormatOption.example}
                    </code>
                  </>
                )}
              </p>
            </div>
          ) : (
            <div className='text-muted-foreground flex h-[200px] items-center justify-center'>
              <div className='text-center'>
                <FileText className='mx-auto mb-2 h-12 w-12 opacity-50' />
                <p>输入数据后将显示预览</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
