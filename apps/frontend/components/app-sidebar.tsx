'use client';

import * as React from 'react';
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardList,
  Clock4,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  GalleryVerticalEnd,
  Headset,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavSecondary } from './nav-secondary';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'HRIS',
      logo: GalleryVerticalEnd,
      // plan: 'Enterprise',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Employee',
      url: '#',
      icon: UsersIcon,
    },
    {
      title: 'Checkclock',
      url: '#',
      icon: Clock4,
    },
    {
      title: 'Letters',
      url: '#',
      icon: ClipboardList,
    },
  ],
  navSecondary: [
    {
      title: 'Get Help',
      url: '#',
      icon: Headset,
    },
    {
      title: 'Settings',
      url: '#',
      icon: SettingsIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
