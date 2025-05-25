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

import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import api from '@/lib/axios';
import { LetterTypeForm } from './lettertype-form';
import { toast } from 'sonner';

interface LetterType {
    id: string;
    name: string;
    content: string;
    company_id: string;
}

type LetterTypesOverviewContentProps = {
    companyId: string | null | undefined;
    isVisible: boolean;
};

export function LetterTypesOverviewContent({ companyId, isVisible }: LetterTypesOverviewContentProps) {
    const [letterTypes, setLetterTypes] = useState<LetterType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editData, setEditData] = useState<LetterType | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchLetterTypes = async () => {
        if (!companyId) return;
        console.log('[Content] Fetching letter types for companyId:', companyId);
        setIsLoading(true);
        setError(null);
        setLetterTypes([]);
        try {
            const response = await api.get<LetterType[]>('/api/letterType');
            console.log('[Content] Raw API response:', response.data);
            if (response && response.data && Array.isArray(response.data)) {
                const filteredTypes = response.data.filter(
                    (lt) => lt.company_id === companyId
                );
                setLetterTypes(filteredTypes);
                if (filteredTypes.length === 0) {
                    console.warn('[Content] No letter types found for this company after filtering.');
                }
            } else {
                setError('Format data API tidak valid.');
                setLetterTypes([]);
            }
        } catch (err: any) {
            console.error('[Content] Failed to fetch letter types:', err);
            setError(`Gagal memuat tipe surat: ${err.message || 'Silakan coba lagi.'}`);
            setLetterTypes([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isVisible && companyId) {
            fetchLetterTypes();
        } else if (!isVisible) {
            setLetterTypes([]);
            setIsLoading(false);
            setError(null);
        }
    }, [isVisible, companyId]);

    const handleEdit = (letterType: LetterType) => {
        setEditData(letterType);
        setIsDialogOpen(true);
    };

const handleDelete = async (id: string) => {
    try {
        const response = await api.delete(`/api/letterType/${id}`);

        if (response.data.statusCode === 200) {
            toast.success('Letter type deleted successfully.');
            fetchLetterTypes();
        } else if (response.data.statusCode === 'P2003') {
            toast.error('Letter type is still used by existing letters.');
        } else {
            toast.error(`Unexpected response: ${response.data.message || 'Unknown error'}`);
        }
    } catch (error: any) {
        console.error('Delete error:', error);
        toast.error('Failed to delete letter type.');
    }
};


    if (!isVisible) return null;

    return (
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {isLoading && <p>Load Letter Type...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && !error && letterTypes.length === 0 && (
                <p>No results.</p>
            )}
            {!isLoading && !error && letterTypes.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[25%]">Letter Type Name</TableHead>
                            <TableHead className="w-[45%]">Content</TableHead>
                            <TableHead className="w-[30%]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {letterTypes.map((letterType, index) => (
                            <TableRow key={letterType.id || `${letterType.name}-${index}`}>
                                <TableCell className="font-medium">{letterType.name}</TableCell>
                                <TableCell>{letterType.content}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="hover:text-white hover:bg-yellow-500"
                                            onClick={() => handleEdit(letterType)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="hover:text-white hover:bg-red-600"
                                            onClick={() => handleDelete(letterType.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Dialog for Editing */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Letter Type</DialogTitle>
                    </DialogHeader>
                    {editData && companyId && (
                        <LetterTypeForm
                            companyId={companyId}
                            mode="edit"
                            initialData={editData}
                            onSuccess={() => {
                                fetchLetterTypes();
                                setIsDialogOpen(false);
                            }}
                            onClose={() => setIsDialogOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
