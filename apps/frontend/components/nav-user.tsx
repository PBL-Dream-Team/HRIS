'use client';

import { CircleUserRound, CreditCard, LogOut } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import api from '@/lib/axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export function NavUser({
  user,
  isAdmin = false,
}: {
  user: {
    name: string;
    first_name: string;
    last_name: string;
    position: string;
    avatar: string;
  };
  isAdmin?: boolean;
}) {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg cursor-pointer focus:outline-none max-w-40">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={`/storage/employee/${user.avatar}`} alt={user.name} />
            <AvatarFallback>
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:grid text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs">{user.position}</span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-56 rounded-lg"
        side="bottom"
        sideOffset={8}
        align="end"
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={`/storage/employee/${user.avatar}`} alt={user.name} />
              <AvatarFallback>
                {user.first_name?.[0]}
                {user.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.position}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="account" className="w-full">
            <DropdownMenuItem>
              <CircleUserRound className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
          </Link>
          {isAdmin && (
            <Link href="subscription" className="w-full">
              <DropdownMenuItem asChild>
                <div className="flex items-center w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subscriptions
                </div>
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
