import { useEffect, useState, useCallback } from 'react';

// UI Components (Shadcn/ui & Custom)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

import { DialogFooter } from '@/components/ui/dialog';

// Libraries & Utilities
import api from '@/lib/axios';
import { format, parse, isValid } from 'date-fns';
import { toast } from 'sonner';

// Icons
import { FaFile } from 'react-icons/fa6';

// Type Definitions
type EmployeeOption = {
  id: string;
  first_name: string;
  last_name: string;
};

type LetterTypeOption = {
  id: string;
  name: string;
};

export type LetterFormData = {
  id: string;
  employee_id: string;
  lettertype_id: string;
  name: string;
  desc: string;
  valid_until: string;
  is_active: boolean;
  file_url?: string;
};

type LetterFormProps = {
  mode: 'create' | 'edit';
  companyId: string;
  initialData?: LetterFormData;
  onSuccess?: () => void;
  onClose?: () => void;
};

// Constants
const DATE_DISPLAY_FORMAT = 'dd/MM/yyyy';
const DATE_PARSE_FORMAT = 'dd MMMM yyyy';

export function LetterForm({
  mode,
  companyId,
  initialData,
  onSuccess,
  onClose,
}: LetterFormProps) {
  // Form Field States
  const [employeeId, setEmployeeId] = useState<string>('');
  const [letterTypeId, setLetterTypeId] = useState<string>('');
  const [letterName, setLetterName] = useState<string>('');
  const [letterDesc, setLetterDesc] = useState<string>('');
  const [status, setStatus] = useState<string>('active');
  const [validUntilDate, setValidUntilDate] = useState<Date | undefined>(
    undefined,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Options for Select Inputs
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [letterTypes, setLetterTypes] = useState<LetterTypeOption[]>([]);

  // State for loading indicators or errors during option fetching
  const [isLoadingOptions, setIsLoadingOptions] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch employees and letter types for select options
  const fetchOptions = useCallback(async () => {
    if (!companyId) return;

    setIsLoadingOptions(true);
    try {
      const [empRes, typeRes] = await Promise.all([
        api.get(`/api/employee?company_id=${companyId}`),
        api.get(`/api/letterType?company_id=${companyId}`),
      ]);

      setEmployees(empRes.data ?? []);
      setLetterTypes(typeRes.data ?? []);

      if ((empRes.data ?? []).length === 0) {
        toast.warning('No employees found for this company.');
      }
      if ((typeRes.data ?? []).length === 0) {
        toast.warning('No letter types found. Please create letter types first.');
      }
    } catch (error: any) {
      console.error('Error fetching form options:', error);
      toast.error('Failed to load employees or letter types.');
      setEmployees([]);
      setLetterTypes([]);
    } finally {
      setIsLoadingOptions(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  // Initialize form with initialData when in 'edit' mode and options are loaded
  useEffect(() => {
    if (mode === 'edit' && initialData && !isLoadingOptions) {
      setEmployeeId(initialData.employee_id || '');
      setLetterTypeId(initialData.lettertype_id || '');
      setLetterName(initialData.name || '');
      setLetterDesc(initialData.desc || '');
      setStatus(initialData.is_active ? 'active' : 'notactive');

      let parsedDate: Date | undefined = undefined;
      if (initialData.valid_until) {
        try {
          // Handle both ISO string and formatted date string
          const dateValue = new Date(initialData.valid_until);
          if (isValid(dateValue)) {
            parsedDate = dateValue;
          } else {
            // Try parsing Indonesian formatted date
            const parts = initialData.valid_until.split(' ');
            if (parts.length >= 3) {
              const day = parseInt(parts[0]);
              const monthMap: Record<string, number> = {
                'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3,
                'Mei': 4, 'Juni': 5, 'Juli': 6, 'Agustus': 7,
                'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
              };
              const month = monthMap[parts[1]];
              const year = parseInt(parts[2]);
              if (!isNaN(day) && month !== undefined && !isNaN(year)) {
                parsedDate = new Date(year, month, day);
              }
            }
          }
        } catch (e) {
          console.error('Error parsing date:', e);
        }
      }
      setValidUntilDate(parsedDate);
      setSelectedFile(null);
    }
  }, [mode, initialData, isLoadingOptions, employees, letterTypes]);

  // Validate form fields - returns the first error found
  const validateForm = useCallback(() => {
    // Reset form errors
    setFormErrors({});

    // Check employee selection
    if (!employeeId.trim()) {
      return 'Please select an employee.';
    }

    // Check letter type selection
    if (!letterTypeId.trim()) {
      return 'Please select a letter type.';
    }

    // Check letter name
    if (!letterName.trim()) {
      return 'Please input name for letter.';
    }

    if (letterName.trim().length < 3) {
      return 'Letter name must be at least 3 characters long.';
    }

    // Check valid until date
    if (!validUntilDate) {
      return 'Valid until date is required.';
    }

    if (validUntilDate < new Date()) {
      return 'Valid until date cannot be in the past.';
    }

    // Check status
    if (!status) {
      return 'Please select a letter status.';
    }

    // File validation
    if (!selectedFile) {
      return 'Please select a file to upload.';
    }

    if (selectedFile) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (selectedFile.size > maxSize) {
        return 'File size must be less than 10MB.';
      }

      if (!allowedTypes.includes(selectedFile.type)) {
        return 'Invalid file type. Only PDF and Word documents are allowed.';
      }
    }

    // If all validations pass
    return null;
  }, [employeeId, letterTypeId, letterName, validUntilDate, status, selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form and show first error if any
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return; // Stop execution if validation fails
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('company_id', companyId);
    formData.append('employee_id', employeeId);
    formData.append('lettertype_id', letterTypeId);
    formData.append('name', letterName);
    formData.append('desc', letterDesc);
    if (validUntilDate) {
      formData.append('valid_until', validUntilDate.toISOString());
    }
    formData.append('is_active', status === 'active' ? 'true' : 'false');

    console.log('Submitting form data:', {
      company_id: companyId,
      employee_id: employeeId,
      lettertype_id: letterTypeId,
      name: letterName,
      desc: letterDesc,
      valid_until: validUntilDate ? validUntilDate.toISOString() : '',
      is_active: status,
    });

    if (selectedFile) {
      formData.append('file', selectedFile);
    } else if (mode === 'edit' && initialData?.file_url) {
      // If no new file is selected in edit mode, and there was an existing file,
      // you might need to tell the backend not to clear the file.
      // This depends on your backend API design.
      // For now, if no new file, no 'file' part is sent.
      // If your backend clears file if 'file' is not present, you might need a hidden input
      // like `formData.append('existing_file_url', initialData.file_url)`
      // or a specific flag like `formData.append('keep_existing_file', 'true')`.
    }

    try {
      if (mode === 'create') {
        await api.post('/api/letter', formData);
      } else if (mode === 'edit' && initialData?.id) {
        // For PATCH with FormData, some backends might prefer POST with a _method=PATCH field.
        // Check your API. Standard PATCH might not work as expected with FormData for all servers.
        // Using POST with a specific endpoint or a `_method` override is safer for file uploads.
        // Or, if your API supports `PATCH` with `multipart/form-data` that's fine.
        await api.patch(`/api/letter/${initialData.id}`, formData);
      }

      toast.success(
        `Letter ${mode === 'create' ? 'created' : 'updated'} successfully!`,
      );

      // Call success callback first to refresh data
      if (onSuccess) {
        await onSuccess();
      }

      // Close dialog after successful operation
      if (onClose) {
        onClose();
      }

    } catch (error: any) {
      console.error('Error submitting form:', error);
      // Log FormData entries for debugging if needed
      // for (const [key, value] of formData.entries()) {
      //   console.log(`FormData ${key}:`, value);
      // }
      const errorMessage =
        error.response?.data?.message || 'Something went wrong.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingOptions && mode === 'create') {
    return <div>Loading form options...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employee Select */}
        <div className="space-y-1">
          <Label htmlFor="employee">Employee *</Label>
          <Select value={employeeId} onValueChange={setEmployeeId}>
            <SelectTrigger id="employee">
              <SelectValue placeholder="- Choose Employee -" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Letter Type Select */}
        <div className="space-y-1">
          <Label htmlFor="letterType">Letter Type *</Label>
          <Select value={letterTypeId} onValueChange={setLetterTypeId}>
            <SelectTrigger id="letterType">
              <SelectValue placeholder="- Choose Letter Type -" />
            </SelectTrigger>
            <SelectContent>
              {letterTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Letter Name Input */}
      <div className="space-y-1">
        <Label htmlFor="letterName">Letter Name *</Label>
        <Input
          id="letterName"
          value={letterName}
          onChange={(e) => setLetterName(e.target.value)}
          placeholder="Enter letter name"
          disabled={isSubmitting}
        />
      </div>

      {/* Letter Description Input */}
      <div className="space-y-1">
        <Label htmlFor="letterDescription">Letter Description (optional)</Label>
        <Input
          id="letterDescription"
          value={letterDesc}
          onChange={(e) => setLetterDesc(e.target.value)}
          placeholder="Enter letter description (optional)"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Upload */}
        <div className="space-y-1">
          <Label htmlFor="letterFile">
            Upload Letter File *{' '}
            {mode === 'create' ? '' : '(Optional: Overwrites existing)'}
          </Label>
          <div className="mt-1 relative w-full aspect-[3/1] border-2 border-dashed rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer">
            {selectedFile ? (
              <div className="flex flex-col items-center justify-center text-sm">
                <FaFile className="text-2xl text-blue-600 dark:text-blue-400 mb-1" />
                <span className="text-center px-2 break-all">
                  {selectedFile.name}
                </span>
              </div>
            ) : mode === 'edit' && initialData?.file_url ? (
              <div className="text-sm text-center">
                <FaFile className="text-2xl text-blue-600 dark:text-blue-400 mb-1 mx-auto" />
                Existing: {initialData.file_url.split('/').pop()}
              </div>
            ) : (
              <span className="flex flex-col items-center justify-center text-sm">
                <FaFile className="text-2xl text-gray-400 dark:text-gray-500 mb-1" />
                Click to upload
              </span>
            )}
            <Input
              id="letterFile"
              type="file"
              accept="application/pdf,.doc,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              disabled={isSubmitting}
            />
          </div>
          {mode === 'edit' && initialData?.file_url && !selectedFile && (
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to keep the existing file.
            </p>
          )}
        </div>

        {/* Status and Valid Until */}
        <div className="space-y-6">
          {/* Letter Status Select */}
          <div className="space-y-1">
            <Label htmlFor="letterStatus">Letter Status *</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="letterStatus">
                <SelectValue placeholder="- Choose Letter Status -" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="notactive">Not Active</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Valid Until Date Picker */}
          <div className="space-y-1">
            <Label htmlFor="validUntil">Valid Until *</Label>
            <Input
              id="validUntil"
              type="date"
              value={validUntilDate ? format(validUntilDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => {
                const selected = e.target.value
                  ? new Date(e.target.value)
                  : undefined;
                setValidUntilDate(selected);
              }}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <DialogFooter className="pt-4">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? (mode === 'create' ? 'Creating...' : 'Updating...')
            : (mode === 'create' ? 'Submit Letter' : 'Update Letter')
          }
        </Button>
      </DialogFooter>
    </form>
  );
}