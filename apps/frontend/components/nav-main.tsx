'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname.includes(item.url);
            console.log('Current pathname:', pathname);
            console.log(`Checking ${item.url}: isActive = ${isActive}`); // Debugging - periksa kondisi isActive
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url} className="w-full">
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
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
