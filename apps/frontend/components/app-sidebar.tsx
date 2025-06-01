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
  Mails,
  Headset,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  BookMarked,
  UsersIcon,
  UserCheck,
  User,
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

// This is sample data
export function AppSidebar({
  isAdmin = false,
  ...props
}: { isAdmin?: boolean } & React.ComponentProps<typeof Sidebar>) {
  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
    teams: [
      {
        name: 'HRIS',
        logo: '/images/vector.png',
        // plan: 'Enterprise',
      },
    ],
    navMain: [
      {
        title: 'Dashboard',
        url: 'dashboard',
        icon: LayoutDashboardIcon,
      },
      ...(isAdmin
        ? [
            {
              title: 'Employee',
              url: 'employeedatabase',
              icon: UsersIcon,
            },
          ]
        : []),
      {
        title: 'Checkclock',
        url: 'checkclock',
        icon: Clock4,
      },

      {
        title: 'Absence',
        url: 'absence',
        icon: UserCheck,
      },

      {
        title: 'Letters',
        url: 'letters',
        icon: ClipboardList,
      },
      // ...(isAdmin
      //   ? [
      //     {
      //       title: 'Letter Types',
      //       url: 'lettertypes',
      //       icon: Mails,
      //     },
      //   ]
      //   : []),
    ],
    navSecondary: [
      {
        title: 'Guidebook',
        url: 'guidebook',
        icon: BookMarked,
      },
      {
        title: 'Get Help',
        url: '#',
        icon: Headset,
      },
    ],
  };
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
