import type { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Product',
    url: '/dashboard/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Account',
    url: '/dashboard/profile',
    icon: 'billing',
    isActive: false,
    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Tools',
    url: '/dashboard/tools/exchange-rate',
    icon: 'tools',
    isActive: false,
    shortcut: ['t', 't'],
    items: [
      {
        title: 'Exchange Rate',
        url: '/dashboard/tools/exchange-rate',
        icon: 'currency',
        shortcut: ['e', 'r']
      },
      {
        title: 'Protocol Analyzer',
        url: '/dashboard/tools/protocol/analyzer/xb',
        icon: 'chevronsLeftRightEllipsis',
        shortcut: ['p', 'a']
      },
      {
        title: 'Timestamp Converter',
        url: '/dashboard/tools/timestamp/to/time',
        icon: 'userPen',
        shortcut: ['t', 'c']
      },
      {
        title: 'OpenRouter Model List',
        url: '/dashboard/tools/openrouter/model/list',
        icon: 'userPen',
        shortcut: ['t', 'c']
      },
      {
        title: 'API认证测试',
        url: '/dashboard/auth-test',
        icon: 'settings',
        shortcut: ['a', 't']
      }
    ]
  },
  {
    title: 'Bookmark',
    url: '/dashboard/bookmark/zch',
    icon: 'bookmark',
    isActive: false,
    items: [
      {
        title: 'Zch',
        url: '/dashboard/bookmark/zch',
        icon: 'userPen',
        shortcut: ['bk', 'z']
      },
      {
        title: 'Chrome',
        url: '/dashboard/bookmark/chrome',
        icon: 'userPen',
        shortcut: ['bk', 'c']
      },
      {
        title: 'ZchFromApi',
        url: '/dashboard/bookmark/zchfromapi',
        icon: 'settings',
        shortcut: ['bk', 'a']
      }
    ]
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
