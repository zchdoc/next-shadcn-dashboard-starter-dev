import { Metadata } from 'next';

// 网站默认元数据
const DEFAULT_TITLE = 'Z1.Tool';
const DEFAULT_DESCRIPTION = 'Build tool box site with Next.js and Shadcn';

// 统一的图标配置
const SITE_ICONS = {
  icon: [
    {
      url: '/favicon.ico', // 使用网站根目录下的favicon.ico
      type: 'image/x-icon'
    },
    // 可以添加其他尺寸的图标
    {
      url: '/icon.png', // 如果有PNG版本
      type: 'image/png',
      sizes: '32x32'
    },
    // 也可以使用SVG图标
    {
      url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>👋</text></svg>',
      type: 'image/svg+xml'
    }
  ],
  // 如果需要，可以添加Apple Touch Icon
  apple: {
    url: '/apple-icon.png',
    type: 'image/png'
  }
};

/**
 * 创建页面元数据，统一图标配置并允许自定义标题和描述
 * @param title 页面标题
 * @param description 页面描述
 * @returns Metadata对象
 */
export function createMetadata(title?: string, description?: string): Metadata {
  return {
    title: title || DEFAULT_TITLE,
    description: description || DEFAULT_DESCRIPTION,
    icons: SITE_ICONS
  };
}

/**
 * 生成带有前缀的页面标题
 * @param pageTitle 页面标题
 * @param prefix 前缀，默认为'Dashboard : '
 * @returns 带前缀的完整标题
 */
export function createPageTitle(
  pageTitle: string,
  prefix: string = 'Dashboard : '
): string {
  return `${prefix}${pageTitle}`;
}

// 导出默认元数据作为根布局使用
export const defaultMetadata: Metadata = createMetadata();
