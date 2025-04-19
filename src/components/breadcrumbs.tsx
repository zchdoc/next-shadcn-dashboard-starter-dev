'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import {
  BreadcrumbItem as BreadcrumbItemType,
  useBreadcrumbs
} from '@/hooks/use-breadcrumbs';
import { IconChevronDown, IconSlash } from '@tabler/icons-react';
import { Fragment } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface BreadcrumbWithDropdownProps {
  item: BreadcrumbItemType;
  isLast: boolean;
}

function BreadcrumbWithDropdown({ item, isLast }: BreadcrumbWithDropdownProps) {
  const hasSiblings = item.siblings && item.siblings.length > 0;
  const hasChildren = item.children && item.children.length > 0;
  const hasDropdown = hasSiblings || hasChildren;

  if (isLast) {
    return (
      <BreadcrumbPage>
        {hasDropdown ? (
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center gap-1 outline-none'>
              {item.title}
              <IconChevronDown className='h-3 w-3' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              {item.siblings?.map((sibling) => (
                <DropdownMenuItem key={sibling.title} asChild>
                  <Link href={sibling.link}>{sibling.title}</Link>
                </DropdownMenuItem>
              ))}
              {item.children?.map((child) => (
                <DropdownMenuItem key={child.title} asChild>
                  <Link href={child.link}>{child.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          item.title
        )}
      </BreadcrumbPage>
    );
  }

  return (
    <BreadcrumbItem className='hidden md:block'>
      {hasDropdown ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <BreadcrumbLink
              href={item.link}
              className='flex items-center gap-1'
            >
              {item.title}
              <IconChevronDown className='h-3 w-3' />
            </BreadcrumbLink>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            {item.siblings?.map((sibling) => (
              <DropdownMenuItem key={sibling.title} asChild>
                <Link href={sibling.link}>{sibling.title}</Link>
              </DropdownMenuItem>
            ))}
            {item.children?.map((child) => (
              <DropdownMenuItem key={child.title} asChild>
                <Link href={child.link}>{child.title}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
      )}
    </BreadcrumbItem>
  );
}

export function Breadcrumbs() {
  const items = useBreadcrumbs();
  if (items.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            <BreadcrumbWithDropdown
              item={item}
              isLast={index === items.length - 1}
            />
            {index < items.length - 1 && (
              <BreadcrumbSeparator className='hidden md:block'>
                <IconSlash />
              </BreadcrumbSeparator>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
