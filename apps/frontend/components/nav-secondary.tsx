'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavSecondary({
  items,
  ...props
}: {
  items: Array<{
    title: string;
    url?: string;
    icon: LucideIcon;
    onClick?: () => void;
  }>;
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = item.url ? pathname.includes(item.url) : false;
            return (
              <SidebarMenuItem key={item.title}>
                {item.onClick ? (
                  <button
                    type="button"
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 transition-colors hover:font-semibold text-left',
                      isActive
                        ? 'bg-primary text-white font-semibold bg-[#1E3A5F] hover:bg-[#1E3A5F]/80 hover:text-white'
                        : 'hover:bg-[#1E3A5F]/80 hover:text-white',
                    )}
                    onClick={item.onClick}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span>{item.title}</span>
                  </button>
                ) : (
                  <Link href={item.url || '#'} className="w-full">
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 transition-colors hover:font-semibold',
                        isActive
                          ? 'bg-primary text-white font-semibold bg-[#1E3A5F] hover:bg-[#1E3A5F]/80 hover:text-white'
                          : 'hover:bg-[#1E3A5F]/80 hover:text-white',
                      )}
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
