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
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  type: string; // Add this field for subscription type
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
  // State Hooks
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // User (top‑right avatar)
  const [user, setUser] = useState({
    name: 'Loading...',
    first_name: '',
    last_name: '',
    position: '',
    avatar: '/avatars/default.jpg',
    compName: '',
  });

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

  // Data Fetching
  const fetchData = useCallback(async () => {
    let mounted = true;

    if (!userId || !companyId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch user data and company data
      const [userRes, compRes] = await Promise.all([
        api.get(`/api/employee/${userId}`),
        api.get(`/api/company/${companyId}`)
      ]);
      
      const userData = userRes.data?.data;
      const companyData = compRes.data?.data;

      if (mounted && userData && companyData) {
        const { first_name, last_name, position, pict_dir } = userData;
        const { name: companyName } = companyData;

        // Ensure all values are strings and handle null/undefined
        const firstName = String(first_name || '');
        const lastName = String(last_name || '');
        const userPosition = String(position || '');
        const userAvatar = String(pict_dir || '/avatars/default.jpg');
        const compName = String(companyName || 'Unknown Company');

        setUser({
          name: `${firstName} ${lastName}`.trim() || 'Unknown User',
          first_name: firstName,
          last_name: lastName,
          position: userPosition,
          avatar: userAvatar,
          compName: compName, // Add company name
        });
      }

      // Fetch subscriptions (from /api/transaction)
      const transactionRes = await api.get('/api/transaction', {
        params: { company_id: companyId },
      });

      if (mounted) {
        const transactionData = transactionRes.data;
        
        // Check if data is directly an array (not nested in .data property)
        const transactions = Array.isArray(transactionData) ? transactionData : transactionData?.data;
        
        if (Array.isArray(transactions)) {
          const fmt: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          };

          const rows: Subscription[] = transactions
            .filter(item => item && typeof item === 'object' && item.id)
            .map((item: any) => {
              // Get subscription type from SUBSCRIPTION_TYPES mapping
              const subscriptionId = String(item.subscription_id || '');
              const subscriptionType = SUBSCRIPTION_TYPES[subscriptionId] || 'Unknown Plan';

              return {
                id: String(item.id || ''),
                company_id: String(item.company_id || ''),
                subscription_id: subscriptionId,
                merchantRef: String(item.merchantRef || ''),
                paidAt: String(item.paidAt || ''),
                paymentMethod: String(item.paymentMethod || ''),
                status: String(item.status || 'Unknown'),
                tripayRef: String(item.tripayRef || ''),
                expiresAt: String(item.expiresAt || ''),
                type: subscriptionType, // Add subscription type

                // Derived fields with null safety
                startDate: item.created_at 
                  ? new Date(item.created_at).toLocaleDateString('en-GB', fmt)
                  : 'No date',
                endDate: item.expiresAt
                  ? new Date(item.expiresAt).toLocaleDateString('en-GB', fmt)
                  : 'No expiry date',
                price: item.total 
                  ? `Rp ${Number(item.total).toLocaleString('id-ID')}`
                  : 'Rp 0',
              };
            });

          console.log('Processed subscriptions:', rows); // Debug log
          setSubscriptions(rows);
        } else {
          console.warn('Transaction data is not an array:', transactions);
          setSubscriptions([]);
        }
      }

    } catch (err: any) {
      console.error('Error fetching subscription data:', err.response?.data || err.message);
      
      if (mounted) {
        setError('Failed to fetch subscription data. Please try again.');
        // Set safe default values on error
        setUser({
          name: 'Unknown User',
          first_name: '',
          last_name: '',
          position: '',
          avatar: '/avatars/default.jpg',
          compName: 'Unknown Company',
        });
        setSubscriptions([]);
      }
    } finally {
      if (mounted) {
        setIsLoading(false);
      }
    }

    return () => {
      mounted = false;
    };
  }, [userId, companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helpers
  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setOpenSheet(true);
  };

  // Show loading state
  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar isAdmin={isAdmin} />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="text-lg">Loading subscription data...</div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Show error state
  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar isAdmin={isAdmin} />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="text-lg text-red-500 mb-4">{error}</div>
              <Button onClick={() => fetchData()}>Try Again</Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Render main content
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
            {subscriptions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No subscription history found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Date Start</TableHead>
                    <TableHead>Date End</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSubscriptions.map((subscription) => {
                    // Safe status rendering with null checks
                    const status = String(subscription.status || 'Unknown');
                    let statusClass = 'bg-gray-600'; // default
                    
                    if (status === 'Active' || status === 'ACTIVE') {
                      statusClass = 'bg-green-600';
                    } else if (status === 'Expired' || status === 'EXPIRED') {
                      statusClass = 'bg-red-600';
                    } else if (status === 'Pending' || status === 'PENDING') {
                      statusClass = 'bg-yellow-600';
                    }

                    // Style subscription type with different colors
                    let typeClass = 'bg-blue-100 text-blue-800'; // default
                    const type = subscription.type;
                    
                    if (type === 'Trial') {
                      typeClass = 'bg-gray-100 text-gray-800';
                    } else if (type === 'Pay as You Go') {
                      typeClass = 'bg-green-100 text-green-800';
                    } else if (type === 'Bronze') {
                      typeClass = 'bg-orange-100 text-orange-800';
                    } else if (type === 'Silver') {
                      typeClass = 'bg-gray-100 text-gray-600';
                    } else if (type === 'Gold') {
                      typeClass = 'bg-yellow-100 text-yellow-800';
                    }

                    return (
                      <TableRow key={subscription.id}>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${typeClass}`}
                          >
                            {subscription.type}
                          </span>
                        </TableCell>
                        <TableCell>{subscription.startDate}</TableCell>
                        <TableCell>{subscription.endDate}</TableCell>
                        <TableCell>{subscription.price}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs text-white ${statusClass}`}
                          >
                            {status}
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
                    );
                  })}
                </TableBody>
              </Table>
            )}

            {/* Pagination */}
            {subscriptions.length > 0 && (
              <PaginationFooter
                totalItems={subscriptions.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}
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
