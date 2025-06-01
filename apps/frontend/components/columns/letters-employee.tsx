import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Download, Eye, Pencil, Trash2 } from 'lucide-react';
import { parse } from 'date-fns';
import { id } from 'date-fns/locale';

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
          date = parse(rawDate, 'dd MMMM yyyy', new Date(), { locale: id });
        }
      } catch {
        date = undefined;
      }

      return date && !isNaN(date.getTime())
        ? date.toLocaleDateString('id-ID', {
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
        </div>
      );
    },
  },
];
