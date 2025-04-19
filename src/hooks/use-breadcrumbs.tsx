'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { navItems } from '@/constants/data';
import { NavItem } from '@/types';

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

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      const mappedBreadcrumbs = [...routeMapping[pathname]];

      // Add siblings and children information
      return mappedBreadcrumbs.map((crumb, index) => {
        // For the first level, add all main nav items as siblings
        if (index === 0) {
          return {
            ...crumb,
            siblings: navItems.map((item) => ({
              title: item.title,
              link: item.url
            }))
          };
        }

        // For other levels, find the parent and add its children as siblings
        const parent = findParentNavItem(crumb.link);
        if (parent && parent.items) {
          return {
            ...crumb,
            siblings: parent.items.map((item) => ({
              title: item.title,
              link: item.url
            }))
          };
        }

        return crumb;
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

      // For the first level (usually 'dashboard'), add all main nav items as siblings
      if (index === 0) {
        breadcrumb.siblings = navItems.map((item) => ({
          title: item.title,
          link: item.url
        }));
      } else {
        // For other levels, find the parent and add its children as siblings
        const parent = findParentNavItem(path);
        if (parent && parent.items) {
          breadcrumb.siblings = parent.items.map((item) => ({
            title: item.title,
            link: item.url
          }));
        }

        // Add children if this item has any
        const currentItem = findNavItemByPath(path);
        if (currentItem && currentItem.items && currentItem.items.length > 0) {
          breadcrumb.children = currentItem.items.map((item) => ({
            title: item.title,
            link: item.url
          }));
        }
      }

      return breadcrumb;
    });
  }, [pathname]);

  return breadcrumbs;
}
