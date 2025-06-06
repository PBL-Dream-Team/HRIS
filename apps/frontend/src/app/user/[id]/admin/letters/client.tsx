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
};

export default function LettersClient({
  isAdmin,
  userId,
  companyId,
}: LettersClientProps) {
  const router = useRouter();

  // State Hooks
  const [user, setUser] = useState<UserState>({
    name: '',
    first_name: '',
    last_name: '',
    position: '',
    avatar: '',
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

  // Dialog states - updated
  const [openAddLetterDialog, setOpenAddLetterDialog] = useState(false);
  const [openAddLetterTypeDialog, setOpenAddLetterTypeDialog] = useState(false);

  // Data Fetching
  const fetchData = useCallback(async () => {
    try {
      const userRes = await api.get(`/api/employee/${userId}`);
      const { first_name, last_name, position, pict_dir } = userRes.data.data;
      setUser({
        name: `${first_name} ${last_name}`,
        first_name: first_name,
        last_name: last_name,
        position: position,
        avatar: pict_dir || '/avatars/default.jpg',
      });

      const [lettersRes, employeesRes, typesRes] = await Promise.all([
        api.get(`/api/letter?company_id=${companyId}`),
        api.get(`/api/employee?company_id=${companyId}`),
        api.get(`/api/letterType?company_id=${companyId}`),
      ]);

      const employeeMap: Record<string, any> = {};
      (employeesRes.data ?? []).forEach((emp: any) => {
        employeeMap[emp.id] = emp;
      });
      setEmployees(employeeMap);

      const typeMap: Record<string, any> = {};
      (typesRes.data ?? []).forEach((type: any) => {
        typeMap[type.id] = type;
      });
      setLetterTypeMap(typeMap);

      setLetters(lettersRes.data ?? []);
    } catch (err: any) {
      console.error('Error fetching data:', err.response?.data || err.message);
      toast.error(
        'Failed to load data. Please check the console for more details.',
      );
    }
  }, [userId, companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Data Transformation
  const transformedLetters = useMemo((): Letter[] => {
    return letters.map((letter) => ({
      ...letter,
      employee_name: employees[letter.employee_id]
        ? `${employees[letter.employee_id].first_name} ${employees[letter.employee_id].last_name}`
        : 'Unknown',
      letter_type: letterTypeMap[letter.lettertype_id]?.name || 'Unknown',
      valid_until: new Date(letter.valid_until).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    }));
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

  // Updated success handlers
  const handleLetterOperationSuccess = useCallback(async () => {
    await fetchData(); // Refresh data
    setOpenAddLetterDialog(false); // Close dialog
    router.refresh(); // Refresh the page
  }, [fetchData]);

  const handleLetterTypeOperationSuccess = useCallback(async () => {
    await fetchData(); // Refresh data
    setOpenAddLetterTypeDialog(false); // Close dialog
    router.refresh(); // Refresh the page
  }, [fetchData]);

  // Column Definition for DataTable
  const columns = useMemo(
    () =>
      letterColumns(
        handleViewDetails,
        setLetterToDelete,
        setIsDeleteDialogOpen,
        companyId,
        router,
      ),
    [handleViewDetails, companyId, router],
  );
  const [refreshKey, setRefreshKey] = useState(0);

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

                  {/* Add Letter Type Dialog - Updated */}
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

                  {/* Add Letter Dialog - Updated */}
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
        avatarUrl={selectedLetter && selectedLetter.employee_id ? employees[selectedLetter.employee_id]?.pict_dir || '' : ''}
      />
    </SidebarProvider>
  );
}