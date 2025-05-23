'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import api from '@/lib/axios';

type LetterTypeFormProps = {
  companyId: string;
  onSuccess?: () => void;
};

export function LetterTypeForm({ companyId, onSuccess }: LetterTypeFormProps) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !content || !companyId) {
      alert('Please fill in all fields.');
      return;
    }

    const payload = {
      name,
      content,
      company_id: companyId,
    };

    try {
      await api.post('/api/letterType', payload);
      alert('Letter type created successfully!');
      setName('');
      setContent('');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to submit letter type:', error);
      alert('Failed to create letter type.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="letterTypeName">Letter Type Name</Label>
        <Input
          id="letterTypeName"
          type="text"
          placeholder="Enter letter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="letterTypeContent">Letter Type Content</Label>
        <Input
          id="letterTypeContent"
          type="text"
          placeholder="Enter letter content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <DialogFooter className="gap-2 sm:justify-end">
        <Button type="submit" className="w-20">
          Submit
        </Button>
      </DialogFooter>
    </form>
  );
}
