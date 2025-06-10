'use client';

import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ComponentType<any> | string;
    // plan: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  const renderLogo = () => {
    if (typeof activeTeam.logo === 'string') {
      return (
        <img
          src={activeTeam.logo}
          alt={activeTeam.name}
          className="size-6 object-contain"
        />
      );
    } else {
      const LogoIcon = activeTeam.logo;
      return <LogoIcon className="size-6" />;
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* Remove DropdownMenu wrapper and make it non-interactive */}
        <div className="flex h-12 min-w-8 flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-left outline-none ring-sidebar-ring transition-all hover:bg-transparent focus-visible:ring-2 data-[disabled]:pointer-events-none data-[state=open]:hover:bg-transparent data-[disabled]:opacity-50 group-has-[[data-sidebar=menu-button]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active]:bg-transparent data-[state=open]:bg-transparent lg:text-sm lg:leading-6 group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 cursor-default">
          <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center">
            {renderLogo()}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{activeTeam.name}</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
