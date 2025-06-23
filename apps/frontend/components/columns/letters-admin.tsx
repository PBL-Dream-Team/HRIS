import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Download, Eye, Pencil, Trash2, MailPlus, MailMinus } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LetterForm } from '@/components/letter/letter-form';
import { parse } from 'date-fns';
import { id } from 'date-fns/locale';
import { useState } from 'react';

export type Letter = {
  id: string;
  employee_id: string;
  lettertype_id: string;
  letter_type: string;
  name: string;
  desc: string;
  file_dir: string;
  valid_until: string;
  is_active: boolean;
};

export const letterColumns = (
  handleViewDetails: (letter: Letter) => void,
  setLetterToDelete: (letter: Letter) => void,
  setDeleteDialogOpen: (open: boolean) => void,
  companyId: string,
  refreshData: () => void,
  setLetterToActivate: (letter: Letter) => void,
  setIsActivateDialogOpen: (open: boolean) => void
): ColumnDef<Letter>[] => [
  {
    accessorKey: 'name',
    header: 'Letter Name',
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'employee_name',
    header: 'Employee Name',
    enableSorting: true,
  },
  {
    accessorKey: 'letter_type',
    header: 'Letter Type',
    enableSorting: true,
  },
  {
    accessorKey: 'valid_until',
    header: 'Valid Until',
    cell: ({ getValue }) => {
      const rawDate = getValue() as string;

      let date: Date | undefined;
      try {
        date = new Date(rawDate);
        if (isNaN(date.getTime())) {
          date = parse(rawDate, 'MMMM dd yyyy', new Date(), { locale: id });
        }
      } catch {
        date = undefined;
      }

      return date && !isNaN(date.getTime())
        ? date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })
        : 'Invalid Date';
    },
    enableSorting: true,
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ getValue }) => {
      const value = getValue<boolean>();
      return (
        <span
          className={`px-2 py-1 rounded text-xs text-white ${
            value ? 'bg-green-600' : 'bg-gray-400'
          }`}
        >
          {value ? 'Active' : 'Inactive'}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const letter = row.original;
      const [editDialogOpen, setEditDialogOpen] = useState(false);

      return (
        <div className="flex gap-2">
          <Link href={`/storage/letter/${letter.file_dir}`}>
            <Button
              variant="outline"
              size="icon"
              className="hover:text-white hover:bg-green-600"
            >
              <Download />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="icon"
            className="hover:text-white hover:bg-blue-600"
            onClick={() => handleViewDetails(letter)}
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="hover:text-white hover:bg-yellow-500"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Letter</DialogTitle>
              </DialogHeader>
              <LetterForm
                mode="edit"
                companyId={companyId}
                initialData={letter}
                onSuccess={() => {
                  setEditDialogOpen(false);
                  refreshData();
                }}
              />
            </DialogContent>
          </Dialog>

          {letter.is_active ? (
            <Button
              variant="outline"
              size="icon"
              className="hover:text-white hover:bg-red-600"
              onClick={() => {
                setLetterToDelete(letter);
                setDeleteDialogOpen(true);
              }}
            >
              <MailMinus className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              className="hover:text-white hover:bg-green-600"
              onClick={() => {
                setLetterToActivate(letter);
                setIsActivateDialogOpen(true);
              }}
            >
              <MailPlus className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];