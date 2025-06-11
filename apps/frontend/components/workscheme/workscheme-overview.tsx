'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

import { Pencil, Trash2, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import api from '@/lib/axios';
import { WorkshemeForm } from './workscheme-form';
import { toast } from 'sonner';

interface Workscheme {
  id: string;
  name: string;
  check_in: string;
  check_out: string;
  workspace_address: string;
  workspace_lat: number | string;
  workspace_long: number | string;
  company_id: string;
  workscheme: 'WFO' | 'WFA' | 'HYBRID'; // Add this property
}

type WorkschemeOverviewContentProps = {
  companyId: string | null | undefined;
  isVisible: boolean;
};

export function WorkschemeOverviewContent({
  companyId,
  isVisible,
}: WorkschemeOverviewContentProps) {
  const [workschemes, setWorkschemes] = useState<Workscheme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editData, setEditData] = useState<Workscheme | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  // Helper function to format timestamp to readable time
  const formatTime = (timestamp: string): string => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toTimeString().split(' ')[0]; // Returns HH:MM:SS
    } catch (error) {
      console.error('Error parsing timestamp:', error);
      return timestamp;
    }
  };

  const fetchWorkschemes = async () => {
    if (!companyId) return;
    setIsLoading(true);
    setError(null);
    setWorkschemes([]);

    try {
      const response = await api.get<Workscheme[]>('/api/attendanceType');
      if (response && Array.isArray(response.data)) {
        const filteredWorkschemes = response.data.filter(
          (ws) => ws.company_id === companyId,
        );
        setWorkschemes(filteredWorkschemes);
      } else {
        setError('Invalid response format from server.');
      }
    } catch (err: any) {
      setError(
        `Failed to fetch workschemes: ${err.message || 'Unknown error'}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && companyId) {
      fetchWorkschemes();
    } else if (!isVisible) {
      setWorkschemes([]);
      setIsLoading(false);
      setError(null);
    }
  }, [isVisible, companyId]);

  const handleEdit = (workscheme: Workscheme) => {
    setEditData(workscheme);
    setIsDialogOpen(true);
  };

  const handleRequestDelete = (id: string) => {
    setSelectedDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      const response = await api.delete(
        `/api/attendanceType/${selectedDeleteId}`,
      );

      if (response.data.statusCode === 200) {
        toast.success('Workscheme deleted successfully.');
        fetchWorkschemes();
      } else if (response.data.statusCode === 'P2003') {
        toast.error('Workscheme is still used by existing attendance records.');
      } else {
        toast.error(
          `Unexpected response: ${response.data.message || 'Unknown error'}`,
        );
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      if (error.response?.status === 409) {
        toast.error('Workscheme is still used by existing attendance records.');
      } else {
        toast.error('Failed to delete workscheme.');
      }
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedDeleteId(null);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="mt-4 max-h-[60vh] overflow-y-auto">
      {isLoading && <p>Loading workschemes...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && workschemes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No workschemes found.</p>
          <p className="text-sm">
            Create your first workscheme to get started.
          </p>
        </div>
      )}
      {!isLoading && !error && workschemes.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">Workscheme Name</TableHead>
              <TableHead className="w-[15%]">Clock In</TableHead>
              <TableHead className="w-[15%]">Clock Out</TableHead>
              <TableHead className="w-[25%]">Workscheme Address</TableHead>
              <TableHead className="w-[15%]">Location</TableHead>
              <TableHead className="w-[10%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workschemes.map((workscheme, index) => (
              <TableRow key={workscheme.id || `${workscheme.name}-${index}`}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{workscheme.name}</span>
                    <span className="text-xs text-gray-500">
                      {workscheme.workscheme.toLowerCase().includes('wfo') &&
                        '🏢 Office'}
                      {workscheme.workscheme.toLowerCase().includes('wfa') &&
                        '🌍 Anywhere'}
                      {workscheme.workscheme.toLowerCase().includes('hybrid') &&
                        '🔄 Hybrid'}
                      {!workscheme.workscheme.toLowerCase().includes('wfo') &&
                        !workscheme.workscheme.toLowerCase().includes('wfa') &&
                        !workscheme.workscheme.toLowerCase().includes('hybrid') &&
                        '📋 Custom'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-green-600" />
                    <span className="text-sm font-mono">
                      {formatTime(workscheme.check_in)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-red-600" />
                    <span className="text-sm font-mono">
                      {formatTime(workscheme.check_out)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px]">
                    {workscheme.workspace_address ? (
                      <div className="flex items-start gap-1">
                        <MapPin className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 break-words">
                          {workscheme.workspace_address}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        No address specified
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {workscheme.workspace_lat && workscheme.workspace_long ? (
                    <div className="text-xs text-gray-600 font-mono">
                      <div>
                        {parseFloat(
                          workscheme.workspace_lat.toString(),
                        ).toFixed(4)}
                      </div>
                      <div>
                        {parseFloat(
                          workscheme.workspace_long.toString(),
                        ).toFixed(4)}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic">
                      No coordinates
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 hover:text-white hover:bg-yellow-500"
                      onClick={() => handleEdit(workscheme)}
                      title="Edit workscheme"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 hover:text-white hover:bg-red-600"
                      onClick={() => handleRequestDelete(workscheme.id)}
                      title="Delete workscheme"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Workscheme</DialogTitle>
          </DialogHeader>
          {editData && companyId && (
            <WorkshemeForm
              companyId={companyId}
              mode="edit"
              initialData={{
                ...editData,
                workscheme: editData.workscheme || 'WFO' // Provide default if missing
              }}
              onSuccess={() => {
                fetchWorkschemes();
                setIsDialogOpen(false);
                setEditData(null);
              }}
              onClose={() => {
                setIsDialogOpen(false);
                setEditData(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workscheme</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this workscheme?</p>
            <p className="text-sm text-gray-600 mt-2">
              This action cannot be undone. If this workscheme is currently
              being used by employees, the deletion may fail to protect data
              integrity.
            </p>
          </div>
          <DialogFooter className="gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
