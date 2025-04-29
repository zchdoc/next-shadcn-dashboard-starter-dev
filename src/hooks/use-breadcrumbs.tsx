'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { navItems } from '@/constants/data';
import type { NavItem } from '@/types';

export type BreadcrumbItem = {
  title: string;
  link: string;
  siblings?: Array<{ title: string; link: string }>;
  children?: Array<{ title: string; link: string }>;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/overview': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Overview', link: '/dashboard/overview' }
  ],
  '/dashboard/employee': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Employee', link: '/dashboard/employee' }
  ],
  '/dashboard/product': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Product', link: '/dashboard/product' }
  ]
  // Add more custom mappings as needed
};

// Helper function to find a nav item by path
function findNavItemByPath(
  path: string,
  items: NavItem[] = navItems
): NavItem | null {
  // 特殊处理，对于"/dashboard/tools"这样的路径，尝试匹配navItems中的"Tools"
  if (path.startsWith('/dashboard/')) {
    const segment = path.split('/')[2]; // 获取第三段路径
    if (segment) {
      // 查找title匹配的nav item
      const matchByTitle = items.find(
        (item) => item.title.toLowerCase() === segment.toLowerCase()
      );
      if (matchByTitle) return matchByTitle;
    }
  }

  // 原有的精确URL匹配逻辑
  for (const item of items) {
    if (item.url === path) {
      return item;
    }

    if (item.items && item.items.length > 0) {
      const found = findNavItemByPath(path, item.items);
      if (found) return found;
    }
  }

  return null;
}

// Helper function to find parent nav item
function findParentNavItem(
  childPath: string,
  items: NavItem[] = navItems
): NavItem | null {
  for (const item of items) {
    if (item.items && item.items.length > 0) {
      for (const subItem of item.items) {
        if (subItem.url === childPath) {
          return item;
        }
      }

      const found = findParentNavItem(childPath, item.items);
      if (found) return found;
    }
  }

  return null;
}

// Helper to find siblings at the same level in the nav hierarchy
function findSiblingsAtLevel(
  level: number,
  pathname: string
): Array<{ title: string; link: string }> {
  // 第一级是Dashboard，第二级是大模块
  const segments = pathname.split('/').filter(Boolean);

  // 对于overview特殊处理
  if (level === 1 && segments[1]?.toLowerCase() === 'overview') {
    // 返回所有主模块，而不仅仅是Overview自己
    return navItems
      .filter((item) => item.title.toLowerCase() !== 'dashboard')
      .map((item) => ({
        title: item.title,
        // 如果有子模块，链接到第一个子模块，否则链接到模块本身
        link: item.items?.length ? item.items[0].url : item.url
      }));
  }

  // 对于第二级（大模块层级）
  if (level === 1) {
    // 返回除了Dashboard以外的所有主模块，确保不包含子模块
    return navItems
      .filter((item) => item.title.toLowerCase() !== 'dashboard')
      .map((item) => ({
        title: item.title,
        // 如果有子模块，链接到第一个子模块，否则链接到模块本身
        link: item.items?.length ? item.items[0].url : item.url
      }));
  }

  // 对于第三级（子模块层级）
  if (level === 2 && segments.length >= 3) {
    // 构建父模块的路径
    const moduleSegment = segments[1]; // 第二段是模块名称

    // 查找对应的父模块
    const parentModule = navItems.find(
      (item) => item.title.toLowerCase() === moduleSegment.toLowerCase()
    );

    if (parentModule?.items?.length) {
      // 只返回子模块，不包含父模块本身
      return parentModule.items.map((item) => ({
        title: item.title,
        link: item.url
      }));
    }
  }

  return [];
}

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // 处理根路径跳转到dashboard/overview的情况
    if (pathname === '/' || pathname === '/dashboard') {
      return [
        { title: 'Dashboard', link: '/dashboard' },
        {
          title: 'Overview',
          link: '/dashboard/overview',
          siblings: navItems
            .filter((item) => item.title.toLowerCase() !== 'dashboard')
            .map((item) => ({
              title: item.title,
              link: item.items?.length ? item.items[0].url : item.url
            }))
        }
      ];
    }

    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      const mappedBreadcrumbs = [...routeMapping[pathname]];

      // Add siblings and children information
      return mappedBreadcrumbs.map((crumb, index) => {
        // Skip adding siblings for Dashboard
        if (index === 0 && crumb.title.toLowerCase() === 'dashboard') {
          return crumb;
        }

        // 特殊处理overview
        if (crumb.title.toLowerCase() === 'overview') {
          return {
            ...crumb,
            siblings: navItems
              .filter((item) => item.title.toLowerCase() !== 'dashboard')
              .map((item) => ({
                title: item.title,
                link: item.items?.length ? item.items[0].url : item.url
              }))
          };
        }

        // For other items, add appropriate siblings and children
        return {
          ...crumb,
          siblings: findSiblingsAtLevel(index, pathname)
        };
      });
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);

    // 创建面包屑项
    const items = segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;

      // 对于主模块，尝试查找对应的导航项来获取正确的标题
      let title = segment.charAt(0).toUpperCase() + segment.slice(1);

      // 处理可能的URL格式与title不匹配的情况
      if (index === 1) {
        // 大模块层级
        // 查找与URL段匹配的导航项
        const navItem = navItems.find(
          (item) =>
            item.url.includes(segment) ||
            item.title.toLowerCase() === segment.toLowerCase()
        );
        if (navItem) {
          title = navItem.title; // 使用导航项中定义的标题
        }
      } else if (index === 2) {
        // 子模块层级
        // 查找父模块
        const parentModule = navItems.find(
          (item) => item.title.toLowerCase() === segments[1].toLowerCase()
        );
        // 在父模块的子项中查找
        const childItem = parentModule?.items?.find(
          (item) =>
            item.url.includes(segment) ||
            item.title.toLowerCase() === segment.toLowerCase()
        );
        if (childItem) {
          title = childItem.title;
        }
      }

      const breadcrumb: BreadcrumbItem = {
        title,
        link: path
      };

      // 第一级是Dashboard，不添加下拉
      if (index === 0 && segment.toLowerCase() === 'dashboard') {
        return breadcrumb;
      }

      // 处理overview作为特殊情况
      if (index === 1 && segment.toLowerCase() === 'overview') {
        breadcrumb.siblings = navItems
          .filter((item) => item.title.toLowerCase() !== 'dashboard')
          .map((item) => ({
            title: item.title,
            link: item.items?.length ? item.items[0].url : item.url
          }));
        return breadcrumb;
      }

      // 第二级是主模块 (Product, Account等)
      if (index === 1) {
        // 只获取主模块作为siblings，不包含子模块
        breadcrumb.siblings = navItems
          .filter((item) => item.title.toLowerCase() !== 'dashboard')
          .map((item) => ({
            title: item.title,
            link: item.items?.length ? item.items[0].url : item.url
          }));

        // 查找当前模块
        const currentItem = navItems.find(
          (item) => item.title.toLowerCase() === segment.toLowerCase()
        );
        // 使用更安全的写法处理可能为null的情况
        const childItems = currentItem?.items || [];
        if (childItems.length > 0) {
          // 添加子模块作为下拉子项
          breadcrumb.children = childItems.map((item) => ({
            title: item.title,
            link: item.url
          }));
        }
      }

      // 第三级是子模块（如Profile, ExchangeRate）
      if (index === 2) {
        // 获取同级子模块作为兄弟项
        breadcrumb.siblings = findSiblingsAtLevel(2, pathname);
      }

      return breadcrumb;
    });

    return items;
  }, [pathname]);

  return breadcrumbs;
}
