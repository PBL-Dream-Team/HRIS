'use client';

import * as React from 'react';
import {
  ClipboardList,
  Clock4,
  Headset,
  LayoutDashboardIcon,
  BookMarked,
  UsersIcon,
  UserCheck,
  LogOut
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavSecondary } from './nav-secondary';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

// This is sample data
export function AppSidebar({
  isAdmin = false,
  ...props
}: { isAdmin?: boolean } & React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const res = await api.post('/api/auth/logout', {
        withCredentials: true,
      });
      toast.success(res.data.message);
      router.push('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
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
        url: 'http://wa.me/+62895326254200',
        icon: Headset,
      },
      {
        title: 'Logout',
        url: '#logout',
        icon: LogOut,
        onClick: handleLogout,
      }
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
