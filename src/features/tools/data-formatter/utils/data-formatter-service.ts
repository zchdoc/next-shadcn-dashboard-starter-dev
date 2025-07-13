import type { DataFormatterFormData } from '../schemas/data-formatter-schema';

export interface FormatResult {
  success: boolean;
  data?: string;
  error?: string;
  stats?: {
    originalCount: number;
    processedCount: number;
    removedDuplicates: number;
    removedEmptyLines: number;
  };
}

export class DataFormatterService {
  /**
   * 格式化数据
   */
  static formatData(formData: DataFormatterFormData): FormatResult {
    try {
      const {
        inputData,
        outputFormat,
        removeEmptyLines,
        trimWhitespace,
        removeDuplicates,
        toLowerCase,
        toUpperCase
      } = formData;

      // 按行分割数据
      let lines = inputData.split(/\r?\n/);
      const originalCount = lines.length;
      let removedEmptyLinesCount = 0;
      let removedDuplicatesCount = 0;

      // 去除空行
      if (removeEmptyLines) {
        const beforeCount = lines.length;
        lines = lines.filter((line) => line.trim() !== '');
        removedEmptyLinesCount = beforeCount - lines.length;
      }

      // 去除首尾空格
      if (trimWhitespace) {
        lines = lines.map((line) => line.trim());
      }

      // 大小写转换
      if (toLowerCase) {
        lines = lines.map((line) => line.toLowerCase());
      } else if (toUpperCase) {
        lines = lines.map((line) => line.toUpperCase());
      }

      // 去除重复项
      if (removeDuplicates) {
        const beforeCount = lines.length;
        lines = Array.from(new Set(lines));
        removedDuplicatesCount = beforeCount - lines.length;
      }

      // 根据格式生成输出
      const formattedData = this.applyFormat(lines, outputFormat, formData);

      return {
        success: true,
        data: formattedData,
        stats: {
          originalCount,
          processedCount: lines.length,
          removedDuplicates: removedDuplicatesCount,
          removedEmptyLines: removedEmptyLinesCount
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '格式化失败'
      };
    }
  }

  /**
   * 应用格式化规则
   */
  private static applyFormat(
    lines: string[],
    format: string,
    formData: DataFormatterFormData
  ): string {
    switch (format) {
      case 'comma-separated':
        return lines.join(',');

      case 'quoted-comma':
        return lines.map((line) => `"${line}"`).join(',');

      case 'single-quoted-comma':
        return lines.map((line) => `'${line}'`).join(',');

      case 'sql-in-clause':
        return `(${lines.map((line) => `'${line}'`).join(',')})`;

      case 'array-format':
        return `[${lines.map((line) => `"${line}"`).join(',')}]`;

      case 'space-separated':
        return lines.join(' ');

      case 'semicolon-separated':
        return lines.join(';');

      case 'pipe-separated':
        return lines.join('|');

      case 'custom':
        return this.applyCustomFormat(lines, formData);

      default:
        return lines.join(',');
    }
  }

  /**
   * 应用自定义格式
   */
  private static applyCustomFormat(
    lines: string[],
    formData: DataFormatterFormData
  ): string {
    const {
      customPrefix = '',
      customSuffix = '',
      customSeparator = ','
    } = formData;

    const formattedLines = lines.map(
      (line) => `${customPrefix}${line}${customSuffix}`
    );
    return formattedLines.join(customSeparator);
  }

  /**
   * 预览格式化结果（只处理前几行）
   */
  static previewFormat(
    formData: DataFormatterFormData,
    maxLines: number = 3
  ): FormatResult {
    const previewData = {
      ...formData,
      inputData: formData.inputData.split(/\r?\n/).slice(0, maxLines).join('\n')
    };

    return this.formatData(previewData);
  }

  /**
   * 验证输入数据
   */
  static validateInput(input: string): { valid: boolean; message?: string } {
    if (!input || input.trim().length === 0) {
      return { valid: false, message: '输入数据不能为空' };
    }

    const lines = input.split(/\r?\n/).filter((line) => line.trim() !== '');
    if (lines.length === 0) {
      return { valid: false, message: '没有有效的数据行' };
    }

    if (lines.length > 10000) {
      return { valid: false, message: '数据行数过多，请控制在10000行以内' };
    }

    return { valid: true };
  }

  /**
   * 获取示例数据
   */
  static getExampleData(): string {
    return `apple
banana
cherry
date
elderberry`;
  }

  /**
   * 复制到剪贴板（浏览器环境）
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // 兼容旧浏览器
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand('copy');
        textArea.remove();
        return success;
      }
    } catch (error) {
      console.error('复制失败:', error);
      return false;
    }
  }
}
