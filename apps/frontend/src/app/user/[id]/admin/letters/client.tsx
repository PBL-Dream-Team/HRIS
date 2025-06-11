'use client';

// React & Next.js Core
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// UI Components (Shadcn/ui & Custom)
import { AppSidebar } from '@/components/app-sidebar';
import { DataTable } from '@/components/data-table';
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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Custom Components
import { NavUser } from '@/components/nav-user';
import { LetterForm } from '@/components/letter/letter-form';
import { LetterTypeForm } from '@/components/lettertype-form';
import LetterDetails from '@/components/letter/letter-details';
import { LetterTypesOverviewContent } from '@/components/lettertype-overview';
import { letterColumns, Letter } from '@/components/columns/letters-admin';

// Libraries & Utilities
import api from '@/lib/axios';
import { toast } from 'sonner';

// Icons
import { MailPlus } from 'lucide-react';
import { IoMdAdd } from 'react-icons/io';
import { MdOutlineAttachEmail } from 'react-icons/md';

// Constants
const ITEMS_PER_PAGE = 10;

// Types
type LettersClientProps = {
  isAdmin: boolean;
  userId: string;
  companyId: string;
};

type UserState = {
  name: string;
  first_name: string;
  last_name: string;
  position: string;
  avatar: string;
  compName: string;
};

export default function LettersClient({
  isAdmin,
  userId,
  companyId,
}: LettersClientProps) {
  const router = useRouter();

  // State Hooks
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserState>({
    name: 'Loading...',
    first_name: '',
    last_name: '',
    position: '',
    avatar: '/avatars/default.jpg',
    compName: '',
  });
  const [employees, setEmployees] = useState<Record<string, any>>({});
  const [letterTypeMap, setLetterTypeMap] = useState<Record<string, any>>({});
  const [letters, setLetters] = useState<Letter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [letterToDelete, setLetterToDelete] = useState<Letter | null>(null);

  const [isLetterDetailsSheetOpen, setIsLetterDetailsSheetOpen] =
    useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLetterTypesOverviewOpen, setIsLetterTypesOverviewOpen] =
    useState(false);

  // Dialog states
  const [openAddLetterDialog, setOpenAddLetterDialog] = useState(false);
  const [openAddLetterTypeDialog, setOpenAddLetterTypeDialog] = useState(false);

  // Data Fetching
  const fetchData = useCallback(async () => {
    let mounted = true;

    if (!userId || !companyId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch user data
      const userRes = await api.get(`/api/employee/${userId}`);
      const userData = userRes.data?.data;
      const compRes = await api.get(`/api/company/${companyId}`);
      const compData = compRes.data?.data;

      if (mounted && userData) {
        const { first_name, last_name, position, pict_dir } = userData;
        const { name } = compData;

        // Ensure all values are strings and handle null/undefined
        const firstName = String(first_name || '');
        const lastName = String(last_name || '');
        const userPosition = String(position || '');
        const userAvatar = String(pict_dir || '/avatars/default.jpg');
        const compName = String(name || '')

        setUser({
          name: `${firstName} ${lastName}`.trim() || 'Unknown User',
          first_name: firstName,
          last_name: lastName,
          position: userPosition,
          avatar: userAvatar,
          compName: compName,
        });
      }

      // Fetch all other data
      const [lettersRes, employeesRes, typesRes] = await Promise.all([
        api.get(`/api/letter?company_id=${companyId}`),
        api.get(`/api/employee?company_id=${companyId}`),
        api.get(`/api/letterType?company_id=${companyId}`),
      ]);

      if (mounted) {
        // Process employee data with null safety
        const employeeMap: Record<string, any> = {};
        const employeeData = Array.isArray(employeesRes.data) ? employeesRes.data : [];
        
        employeeData.forEach((emp: any) => {
          if (emp && emp.id) {
            employeeMap[emp.id] = {
              ...emp,
              first_name: String(emp.first_name || ''),
              last_name: String(emp.last_name || ''),
              position: String(emp.position || ''),
            };
          }
        });
        setEmployees(employeeMap);

        // Process letter type data with null safety
        const typeMap: Record<string, any> = {};
        const typeData = Array.isArray(typesRes.data) ? typesRes.data : [];
        
        typeData.forEach((type: any) => {
          if (type && type.id) {
            typeMap[type.id] = {
              ...type,
              name: String(type.name || 'Unknown Type'),
            };
          }
        });
        setLetterTypeMap(typeMap);

        // Process letters data with null safety
        const lettersData = Array.isArray(lettersRes.data) ? lettersRes.data : [];
        const validLetters = lettersData.filter(letter => 
          letter && 
          typeof letter === 'object' && 
          letter.id &&
          letter.employee_id
        ).map(letter => ({
          ...letter,
          employee_id: String(letter.employee_id || ''),
          lettertype_id: String(letter.lettertype_id || ''),
          valid_until: letter.valid_until || new Date().toISOString(),
        }));
        
        setLetters(validLetters);
      }

    } catch (err: any) {
      console.error('Error fetching letters data:', err.response?.data || err.message);
      
      if (mounted) {
        setError('Failed to fetch letters data. Please try again.');
        // Set safe default values on error
        setUser({
          name: 'Unknown User',
          first_name: '',
          last_name: '',
          position: '',
          avatar: '/avatars/default.jpg',
          compName: 'Unknown Company'
        });
        setEmployees({});
        setLetterTypeMap({});
        setLetters([]);
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

  // Data Transformation with null safety
  const transformedLetters = useMemo((): Letter[] => {
    return letters.map((letter) => {
      const employee = employees[letter.employee_id];
      const letterType = letterTypeMap[letter.lettertype_id];

      return {
        ...letter,
        employee_name: employee
          ? `${String(employee.first_name || '')} ${String(employee.last_name || '')}`.trim() || 'Unknown Employee'
          : 'Unknown Employee',
        letter_type: String(letterType?.name || 'Unknown Type'),
        valid_until: letter.valid_until 
          ? new Date(letter.valid_until).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
          : 'No Date',
      };
    });
  }, [letters, employees, letterTypeMap]);

  // Event Handlers
  const handleViewDetails = useCallback((letter: Letter) => {
    setSelectedLetter(letter);
    setIsLetterDetailsSheetOpen(true);
  }, []);

  const handleDeleteConfirmed = async () => {
    if (!letterToDelete) return;

    try {
      await api.delete(`/api/letter/${letterToDelete.id}`);
      toast.success('Letter deleted successfully.');
      await fetchData();
    } catch (err: any) {
      console.error(
        'Error deleting letter:',
        err.response?.data || err.message,
      );
      toast.error('Failed to delete letter. Please try again.');
    } finally {
      setIsDeleteDialogOpen(false);
      setLetterToDelete(null);
    }
  };

  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleLetterOperationSuccess = useCallback(async () => {
    try {
      const lettersRes = await api.get(`/api/letter?company_id=${companyId}`);
      const lettersData = Array.isArray(lettersRes.data) ? lettersRes.data : [];
      setLetters(lettersData);
      setRefreshTrigger(prev => !prev);
    } catch (error) {
      console.error('Error refreshing letters:', error);
      toast.error('Failed to refresh letters data');
    }
  }, [companyId]);

  const handleLetterTypeOperationSuccess = useCallback(async () => {
    await fetchData(); // Refresh data
    setOpenAddLetterTypeDialog(false); // Close dialog
    router.refresh(); // Refresh the page
  }, [fetchData, router]);

  // Column Definition for DataTable
  const columns = useMemo(
    () =>
      letterColumns(
        handleViewDetails,
        setLetterToDelete,
        setIsDeleteDialogOpen,
        companyId,
        handleLetterOperationSuccess,
      ),
    [handleViewDetails, companyId, handleLetterOperationSuccess],
  );
  const [refreshKey, setRefreshKey] = useState(0);

  // Show loading state
  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar isAdmin={isAdmin} />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="text-lg">Loading letters data...</div>
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

  return (
    <SidebarProvider>
      <AppSidebar isAdmin={isAdmin} />
      <SidebarInset>
        {/* Header Section */}
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
                  <BreadcrumbPage>Letters</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-4">
            <NavUser user={user} isAdmin={isAdmin} />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex flex-1 flex-col gap-4 p-10 pt-5">
          <div className="border border-gray-300 rounded-md p-4">
            <DataTable
              key={refreshKey}
              columns={columns}
              data={transformedLetters}
              searchableColumn="name"
              title="Letter Overview"
              actions={
                <>
                  {/* Letter Types Overview Dialog */}
                  <Dialog
                    open={isLetterTypesOverviewOpen}
                    onOpenChange={setIsLetterTypesOverviewOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <MdOutlineAttachEmail className="mr-2 h-4 w-4" />
                        Letter Type Overview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Letter Types</DialogTitle>
                      </DialogHeader>
                      <LetterTypesOverviewContent
                        companyId={companyId}
                        isVisible={isLetterTypesOverviewOpen}
                      />
                    </DialogContent>
                  </Dialog>

                  {/* Add Letter Type Dialog */}
                  <Dialog
                    open={openAddLetterTypeDialog}
                    onOpenChange={setOpenAddLetterTypeDialog}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <MailPlus className="mr-2 h-4 w-4" /> Add Letter Type
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Letter Type</DialogTitle>
                      </DialogHeader>
                      <LetterTypeForm
                        companyId={companyId}
                        mode="create"
                        onSuccess={handleLetterTypeOperationSuccess}
                        onClose={() => setOpenAddLetterTypeDialog(false)}
                      />
                    </DialogContent>
                  </Dialog>

                  {/* Add Letter Dialog */}
                  <Dialog
                    open={openAddLetterDialog}
                    onOpenChange={setOpenAddLetterDialog}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <IoMdAdd className="mr-2 h-4 w-4" /> Add Letter
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Letter</DialogTitle>
                      </DialogHeader>
                      <LetterForm
                        mode="create"
                        companyId={companyId}
                        onSuccess={handleLetterOperationSuccess}
                        onClose={() => setOpenAddLetterDialog(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </>
              }
              pagination={{
                currentPage,
                itemsPerPage: ITEMS_PER_PAGE,
                onPageChange: setCurrentPage,
              }}
              onSearchChange={() => setCurrentPage(1)}
            />
          </div>
        </main>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Letter</DialogTitle>
            </DialogHeader>
            <div>
              Are you sure you want to delete this letter? This action cannot be
              undone.
            </div>
            <DialogFooter className="gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirmed}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>

      {/* Letter Details Sheet/Side Panel */}
      <LetterDetails
        open={isLetterDetailsSheetOpen}
        onOpenChange={setIsLetterDetailsSheetOpen}
        selectedLetter={selectedLetter}
      />
    </SidebarProvider>
  );
}