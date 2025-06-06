/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Bell, Eye } from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useState } from 'react';
import PaginationFooter from '@/components/pagination';
import SubscriptionDetails from '@/components/subscription-details';
import api from '@/lib/axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { VscSettings } from 'react-icons/vsc';
import { IoMdSearch } from 'react-icons/io';

// Types & Constants

export type Subscription = {
  id: string;
  company_id: string;
  subscription_id: string;
  price: string;
  startDate: string;
  endDate: string;
  expiresAt: string;
  merchantRef: string;
  paidAt: string;
  paymentMethod: string;
  status: string; // 'Active' | 'Expired' | 'Pending'
  tripayRef: string;
};

type SubscriptionClientProps = {
  isAdmin: boolean;
  userId: string;
  companyId: string;
};

// Map subscription_id → human‑readable plan name
const SUBSCRIPTION_TYPES: Record<string, string> = {
  'bcf1b2a6-bdc2-4b66-98b1-e8a2c0ea2e95': 'Trial',
  'd63b6982-048d-414e-92d4-50357234e010': 'Pay as You Go',
  'd92d0e25-aefc-4732-94a7-5e8068fde7d9': 'Bronze',
  '5283975f-1e97-4e99-ab39-d316dce5abf0': 'Silver',
  'edd5b74d-2329-4e22-b720-a1801ab02939': 'Gold',
};

// Component
export default function SubscriptionClient({
  isAdmin,
  userId,
  companyId,
}: SubscriptionClientProps) {
  // User (top‑right avatar)
  const [user, setUser] = useState({ name: '', first_name: '', last_name: '', position: '', avatar: '' });

  // Subscription data
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [openSheet, setOpenSheet] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedSubscriptions = useMemo(
    () =>
      subscriptions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      ),
    [subscriptions, currentPage],
  );

  // Fetch user profile
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/employee/${userId}`);
        const { first_name, last_name, position, pict_dir } = res.data.data;
        setUser({
          name: `${first_name} ${last_name}`,
          first_name,
          last_name,
          position,
          avatar: pict_dir || '/avatars/default.jpg',
        });
      } catch (err: any) {
        console.error('Error fetching user:', err.response?.data || err.message);
      }
    })();
  }, [userId]);

  // Fetch subscriptions (from /api/transaction)
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/transaction', {
          params: { company_id: companyId },
        });

        const rows: Subscription[] = res.data.data.map((item: any) => {
          const fmt: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          };

          return {
            id: item.id,
            company_id: item.company_id,
            subscription_id: item.subscription_id,
            merchantRef: item.merchantRef,
            paidAt: item.paidAt,
            paymentMethod: item.paymentMethod,
            status: item.status,
            tripayRef: item.tripayRef,

            // Derived
            startDate: new Date(item.created_at).toLocaleDateString('en-GB', fmt),
            endDate: item.expiresAt
              ? new Date(item.expiresAt).toLocaleDateString('en-GB', fmt)
              : '-',
            price: `Rp ${Number(item.total).toLocaleString('id-ID')}`,
            type: SUBSCRIPTION_TYPES[item.subscription_id] || item.subscription_id,
          };
        });

        setSubscriptions(rows);
      } catch (err: any) {
        console.error(
          'Error fetching transactions:',
          err.response?.data || err.message,
        );
      }
    })();
  }, [companyId]);

  // Helpers
  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setOpenSheet(true);
  };

  // Render
  return (
    <SidebarProvider>
      <AppSidebar isAdmin={isAdmin} />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Subscription</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-md hover:bg-muted focus:outline-none">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-56 rounded-lg"
                side="bottom"
                sideOffset={8}
                align="end"
              >
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>New user registered</DropdownMenuItem>
                <DropdownMenuItem>Monthly report is ready</DropdownMenuItem>
                <DropdownMenuItem>Server restarted</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-700">
                  View all
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Avatar */}
            <NavUser user={user} isAdmin={isAdmin} />
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 flex-col gap-4 p-10 pt-5">
          <div className="border border-gray-300 rounded-md p-4">
            {/* Heading & search */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-lg font-semibold">Subscription History</div>
              <div className="relative w-96 hidden lg:block">
                <IoMdSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
                <Input type="search" placeholder="Search" className="pl-10" />
              </div>
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                <Button className="bg-gray-100 text-black shadow-xs hover:bg-gray-200">
                  <VscSettings /> Filter
                </Button>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date Start</TableHead>
                  <TableHead>Date End</TableHead>
                  <TableHead>Price</TableHead>
                  {/* <TableHead>Type</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>{subscription.startDate}</TableCell>
                    <TableCell>{subscription.endDate}</TableCell>
                    <TableCell>{subscription.price}</TableCell>
                    {/* <TableCell>{subscription.type}</TableCell> */}
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs text-white ${subscription.status === 'Active' ? 'bg-green-600' : ''} ${subscription.status === 'Expired' ? 'bg-red-600' : ''}`}
                      >
                        {subscription.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="icon"
                        className="hover:text-white hover:bg-blue-600"
                        onClick={() => handleViewDetails(subscription)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <PaginationFooter
              totalItems={subscriptions.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </SidebarInset>

      {/* Slide‑over with details */}
      <SubscriptionDetails
        open={openSheet}
        onOpenChange={setOpenSheet}
        selectedSubscription={selectedSubscription}
      />
    </SidebarProvider>
  );
}
