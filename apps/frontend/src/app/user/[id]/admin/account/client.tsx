'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Input } from '@/components/ui/input';
import { Bell, CalendarIcon, Pencil } from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AdminEditDataForm } from '@/components/editData-Admin/adminData-form';
import { EditPassword } from '@/components/editData-Admin/editPass-form';
import { EditCompany } from '@/components/editData-Admin/compData-form';
import { useEffect, useCallback, useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns/format';
import { enUS } from 'date-fns/locale';
import MapDisplay from '@/components/readonly-map/map-display';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type AccountClientProps = {
  isAdmin: boolean;
  userId: string;
  companyId: string;
  initialData?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    pict_dir: string;
    subscription_id: string;
    subscription_type: string;
    subs_date_start: string;
    subs_date_end: string;
    company_name: string;
    company_address: string;
    loc_lat: string;
    loc_long: string;
  };
};

export default function AccountClient({
  isAdmin,
  userId,
  companyId,
  initialData,
}: AccountClientProps) {
  const [user, setUser] = useState({
    name: '',
    first_name: '',
    last_name: '',
    position: '',
    avatar: '',
  });
  const router = useRouter();

  const [adminData, setAdminData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    pict_dir: '',
  });

  const [subsData, setSubsData] = useState({
    companyId: '',
    subscription_id: '',
    subscription_type: '',
    subs_date_start: '',
    subs_date_end: '',
  });

  const [companyData, setCompanyData] = useState({
    id: '',
    name: '',
    address: '',
    loc_lat: '',
    loc_long: '',
  });

  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [isMapLoading, setIsMapLoading] = useState(true);

  const [openEditDataDialog, setOpenEditDataDialog] = useState(false);
  const [openEditPassDialog, setOpenEditPassialog] = useState(false);
  const [openEditCompDialog, setOpenEditCompDialog] = useState(false);

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setLat(lat.toFixed(6));
    setLng(lng.toFixed(6));
    setAddressDetail(address);
  };

  const handleMapLoad = () => {
    setIsMapLoading(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';

    try {
      // Konversi string ke Date object
      const date = new Date(dateString);
      return format(date, 'PPP', { locale: enUS });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Fallback ke string asli jika error
    }
  };

  // Data Fetching
  const fetchData = useCallback(async () => {
    try {
      const resUser = await api.get(`/api/employee/${userId}`);
      const resCompany = await api.get(`/api/company/${companyId}`);
      const admin = resUser.data.data;
      const company = resCompany.data.data;

      const resSubs = await api.get(
        `/api/subscription/${company.subscription_id}`,
      );
      const subscription = resSubs.data.data;

      setUser({
        name: `${admin.first_name} ${admin.last_name}`,
        first_name: admin.first_name,
        last_name: admin.last_name,
        position: admin.position,
        avatar: admin.pict_dir || '/avatars/default.jpg',
      });

      setAdminData({
        id: admin.id,
        first_name: admin.first_name,
        last_name: admin.last_name,
        email: admin.email,
        phone: admin.phone,
        pict_dir: admin.pict_dir || '',
      });

      setSubsData({
        companyId: company.id || '',
        subscription_id: company.subscription_id || '',
        subscription_type: subscription.name || '',
        subs_date_start: company.subs_date_start || '',
        subs_date_end: company.subs_date_end || '',
      });

      setCompanyData({
        id: company.id || '',
        name: company.name || '',
        address: company.address || '',
        loc_lat: company.loc_lat || '',
        loc_long: company.loc_long || '',
      });
    } catch (err: any) {
      console.error(
        'Error fetching user data:',
        err.response?.data || err.message,
      );
    }
  }, [userId, companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOperationSuccess = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const [avatar, setAvatar] = useState<File | null>(null);
  return (
    <SidebarProvider>
      <AppSidebar isAdmin={isAdmin} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Account</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-4">
            {/* Nav-user */}
            <NavUser user={user} isAdmin={isAdmin} />
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-4 p-4 relative">
          <form className="w-full h-fit md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 border-2 p-4 bg-white rounded-lg shadow">
            <h1 className="text-lg font-semibold mb-2">Account Information</h1>

            {/* Profile Data */}
            <div className="col-span-full flex items-center gap-4">
              <Avatar className="w-25 h-25">
                <AvatarImage
                  src={'/storage/employee/' + adminData.pict_dir}
                  alt={adminData.first_name || 'Avatar'}
                />
                <AvatarFallback>
                  {adminData.first_name?.[0]}
                  {adminData.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <Label>First Name</Label>
              <Input
                id="first_name"
                value={adminData.first_name || ''}
                readOnly
                placeholder="Your first name"
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                id="last_name"
                value={adminData.last_name || ''}
                readOnly
                placeholder="Your last name"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                id="email"
                value={adminData.email || ''}
                readOnly
                placeholder="Your email"
              />
            </div>
            <div>
              <Label>Mobile Number</Label>
              <Input
                id="phone"
                value={adminData.phone || ''}
                readOnly
                placeholder="Your phone number"
              />
            </div>
            <div className="col-span-full flex justify-end gap-2">
              <Dialog open={openEditDataDialog} onOpenChange={setOpenEditDataDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full md:w-auto">
                    <Pencil className="h-4 w-4 mr-1" /> Edit Profile
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <AdminEditDataForm
                    userId={adminData.id}
                    initialData={adminData}
                    onSuccess={handleOperationSuccess}
                    onClose={() => setOpenEditDataDialog(false)}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={openEditPassDialog} onOpenChange={setOpenEditPassialog}>
                <DialogTrigger asChild>
                  <Button className="w-full md:w-auto">
                    <Pencil className="h-4 w-4 mr-1" /> Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <EditPassword
                    userId={adminData.id}
                    onSuccess={handleOperationSuccess}
                    onClose={() => setOpenEditPassialog(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </form>

          {/* Subscription Data */}
          <div className="w-full h-fit md:w-1/3 gap-4 border-2 p-4 bg-white rounded-lg shadow">
            <h1 className="text-lg font-semibold mb-2">
              Subscription Information
            </h1>
            <Card>
              <CardHeader className="pb-2">
                <p className="text-sm">
                  Joined at : {formatDate(subsData.subs_date_start)}
                </p>
                <CardTitle className="text-xl">
                  {subsData.subscription_type}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-xs">
                    Next payment is on {formatDate(subsData.subs_date_end)}
                  </p>
                </div>
                <hr className="my-2" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <Button>
                    <a href="/pricing">Change Subscription</a>
                  </Button>
                  <Button>
                    <a href="subscription">Subscription History</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 p-4 relative">
          <div className="w-full h-fit gap-4 border-2 p-4 bg-white rounded-lg shadow">
            <h1 className="text-lg font-semibold mb-2">Company Information</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full space-y-2">
                {isMapLoading && (
                  <div className="text-gray-500 text-sm text-center">
                    Loading map...
                  </div>
                )}
                {companyData.loc_lat && companyData.loc_long ? (
                  <MapDisplay
                    position={{
                      lat: parseFloat(companyData.loc_lat),
                      lng: parseFloat(companyData.loc_long),
                    }}
                    onLoad={handleMapLoad}
                  />
                ) : (
                  <div className="h-64 w-full rounded-lg bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">No location set</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1">
                <div>
                  <Label>Company Name</Label>
                  <Input
                    id="first_name"
                    value={companyData.name || ''}
                    readOnly
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <Label>Company Address</Label>
                  <Input
                    id="last_name"
                    value={companyData.address || ''}
                    readOnly
                    placeholder="Address detail of your company"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Latitude</Label>
                    <Input
                      id="first_name"
                      value={companyData.loc_lat || ''}
                      readOnly
                      placeholder="Latitude of your company"
                    />
                  </div>
                  <div>
                    <Label>Longitude</Label>
                    <Input
                      id="last_name"
                      value={companyData.loc_long || ''}
                      readOnly
                      placeholder="Longitude of your company"
                    />
                  </div>
                </div>
                <div className="col-span-full flex justify-end mt-2">
                  <Dialog open={openEditCompDialog} onOpenChange={setOpenEditCompDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full md:w-auto">
                        <Pencil className="h-4 w-4 mr-1" /> Edit Data
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Data Company</DialogTitle>
                      </DialogHeader>
                      <EditCompany
                        companyId={companyData.id}
                        initialData={{
                          name: companyData.name,
                          address: companyData.address,
                          loc_lat: Number(companyData.loc_lat) || 0,
                          loc_long: Number(companyData.loc_long) || 0,
                        }}
                        onSuccess={handleOperationSuccess}
                        onClose={() => setOpenEditCompDialog(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Attendance Type */}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
