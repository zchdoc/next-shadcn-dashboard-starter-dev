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
  // For top level items, we return main nav items excluding Dashboard
  if (level === 0) {
    return navItems
      .filter((item) => item.title.toLowerCase() !== 'dashboard')
      .map((item) => ({
        title: item.title,
        link: item.items?.length ? item.items[0].url : item.url
      }));
  }

  // For level 1 (modules), find parent and get siblings from same parent
  // First get the path segments
  const segments = pathname.split('/').filter(Boolean);
  const parentPath = `/${segments.slice(0, level).join('/')}`;

  // Find the parent nav item
  const parentItem = findNavItemByPath(parentPath);

  if (parentItem?.items) {
    // Use optional chain
    // Return siblings (other items under same parent)
    return parentItem.items.map((item) => ({
      title: item.title,
      link: item.url
    }));
  }

  return [];
}

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      const mappedBreadcrumbs = [...routeMapping[pathname]];

      // Add siblings and children information
      return mappedBreadcrumbs.map((crumb, index) => {
        // Skip adding siblings for Dashboard
        if (index === 0 && crumb.title.toLowerCase() === 'dashboard') {
          return crumb;
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
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      const breadcrumb: BreadcrumbItem = {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };

      // Skip adding siblings for the Dashboard level
      if (index === 0 && segment.toLowerCase() === 'dashboard') {
        return breadcrumb;
      }

      // For main modules and sub-modules
      breadcrumb.siblings = findSiblingsAtLevel(index, pathname);

      // Add children if this item has any
      const currentItem = findNavItemByPath(path);
      // 使用更安全的方式处理可能为null的值
      const childItems = currentItem?.items || [];
      if (childItems.length > 0) {
        breadcrumb.children = childItems.map((item) => ({
          title: item.title,
          link: item.url
        }));
      }

      return breadcrumb;
    });
  }, [pathname]);

  return breadcrumbs;
}
