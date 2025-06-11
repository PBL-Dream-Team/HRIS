'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface LetterType {
  id: string;
  name: string;
  content: string;
  company_id: string;
}

type LetterTypeFormProps = {
  companyId: string;
  mode: 'create' | 'edit';
  initialData?: LetterType | null;
  onSuccess?: () => void;
  onClose?: () => void; // Untuk menutup dialog dari parent
};

export function LetterTypeForm({
  companyId,
  mode,
  initialData,
  onSuccess,
  onClose,
}: LetterTypeFormProps) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setName(initialData.name);
      setContent(initialData.content);
    } else {
      // Reset form for create mode or if initialData is not available
      setName('');
      setContent('');
    }
  }, [mode, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !content) {
      // companyId sudah pasti ada dari props
      toast.error('Name and content fields are required.');
      setIsLoading(false);
      return;
    }

    const payload = {
      name,
      content,
      company_id: companyId,
    };

    try {
      if (mode === 'create') {
        await api.post('/api/letterType', payload);
        toast.success('Letter type created successfully!');
      } else if (mode === 'edit' && initialData?.id) {
        await api.patch(`/api/letterType/${initialData.id}`, payload);
        toast.success('Letter type updated successfully!');
      }

      if (mode === 'create') {
        setName('');
        setContent('');
      }
      onSuccess?.();
      onClose?.(); // Panggil onClose untuk menutup dialog jika disediakan
    } catch (error: any) {
      console.error('Error processing letter type:', error);
      const errorMessage =
        error.response?.data?.message ||
        (mode === 'create'
          ? 'Failed to create letter type.'
          : 'Failed to update letter type.');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="letterTypeName">
            Letter Type Name
            <span className="text-red-600"> *</span>
          </Label>
          <Input
            id="letterTypeName"
            type="text"
            placeholder="Enter letter type name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="letterTypeContent">
            Content
            <span className="text-red-600"> *</span>
          </Label>
          <Input
            id="letterTypeContent"
            placeholder="Enter content for the letter type"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>
      <DialogFooter className="gap-2 pt-6 sm:justify-end">
        {onClose && (
          <Button
            type="button"
            className="w-24"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" className="w-24" disabled={isLoading}>
          {isLoading
            ? mode === 'create'
              ? 'Creating...'
              : 'Updating...'
            : mode === 'create'
              ? 'Submit'
              : 'Update'}
        </Button>
      </DialogFooter>
    </form>
  );
}
