import { z } from 'zod';

// 输出格式枚举
export const outputFormatEnum = z.enum([
  'comma-separated', // 逗号分隔：item1,item2,item3
  'quoted-comma', // 带引号逗号分隔："item1","item2","item3"
  'single-quoted-comma', // 单引号逗号分隔：'item1','item2','item3'
  'sql-in-clause', // SQL IN 子句格式：('item1','item2','item3')
  'sql-in-numbers', // SQL IN 数字格式：(1,2,3)
  'array-format', // 数组格式：["item1","item2","item3"]
  'space-separated', // 空格分隔：item1 item2 item3
  'semicolon-separated', // 分号分隔：item1;item2;item3
  'pipe-separated', // 管道分隔：item1|item2|item3
  'horizontal-to-vertical', // 横向转竖列：将横向文本按指定分隔符转换为竖列
  'custom' // 自定义格式
]);

export const dataFormatterSchema = z.object({
  // 输入数据（每行一个项目）
  inputData: z
    .string()
    .min(1, '请输入要转换的数据')
    .refine((value) => value.trim().length > 0, '输入数据不能为空'),

  // 输出格式
  outputFormat: outputFormatEnum.default('comma-separated'),

  // 是否去除空行
  removeEmptyLines: z.boolean().default(true),

  // 是否去除首尾空格
  trimWhitespace: z.boolean().default(true),

  // 是否去除重复项
  removeDuplicates: z.boolean().default(false),

  // 自定义前缀（当格式为 custom 时）
  customPrefix: z.string().optional(),

  // 自定义后缀（当格式为 custom 时）
  customSuffix: z.string().optional(),

  // 自定义分隔符（当格式为 custom 时）
  customSeparator: z.string().default(','),

  // 横向转竖列的分隔符（当格式为 horizontal-to-vertical 时）
  horizontalSeparator: z.string().default('。'),

  // 是否转换为小写
  toLowerCase: z.boolean().default(false),

  // 是否转换为大写
  toUpperCase: z.boolean().default(false)
});

export type DataFormatterFormData = z.infer<typeof dataFormatterSchema>;

// 输出格式选项
export const outputFormatOptions = [
  { value: 'comma-separated', label: '逗号分隔', example: 'item1,item2,item3' },
  {
    value: 'quoted-comma',
    label: '双引号+逗号',
    example: '"item1","item2","item3"'
  },
  {
    value: 'single-quoted-comma',
    label: '单引号+逗号',
    example: "'item1','item2','item3'"
  },
  {
    value: 'sql-in-clause',
    label: 'SQL IN (字符串)',
    example: "('item1','item2','item3')"
  },
  {
    value: 'sql-in-numbers',
    label: 'SQL IN (数字)',
    example: '(1,2,3)'
  },
  {
    value: 'array-format',
    label: '数组格式',
    example: '["item1","item2","item3"]'
  },
  { value: 'space-separated', label: '空格分隔', example: 'item1 item2 item3' },
  {
    value: 'semicolon-separated',
    label: '分号分隔',
    example: 'item1;item2;item3'
  },
  { value: 'pipe-separated', label: '管道分隔', example: 'item1|item2|item3' },
  {
    value: 'horizontal-to-vertical',
    label: '横向转竖列',
    example: '按分隔符拆分为多行'
  },
  { value: 'custom', label: '自定义格式', example: '自定义前缀和后缀' }
] as const;
