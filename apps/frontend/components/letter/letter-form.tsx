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
import { FaFile, FaTrash, FaUpload } from 'react-icons/fa6';
import { Eye } from 'lucide-react';

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
  file_name?: string;
  file_dir?: string;
};

type LetterFormProps = {
  mode: 'create' | 'edit';
  companyId: string;
  initialData?: LetterFormData;
  onSuccess?: () => void;
  onClose?: () => void;
};

// Constants
const DATE_DISPLAY_FORMAT = 'MM/dd/yyyy';
const DATE_PARSE_FORMAT = 'MMMM dd yyyy';

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

  // State for file info visibility
  const [showFileInfo, setShowFileInfo] = useState(true);

  // Enhanced file state management
  const [existingFile, setExistingFile] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const [fileAction, setFileAction] = useState<'keep' | 'replace' | 'remove'>(
    'keep',
  );

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
        toast.warning(
          'No letter types found. Please create letter types first.',
        );
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

  // Initialize form with initialData when in 'edit' mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      console.log('Initializing form with data:', initialData);

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
            // Try parsing Indonesian formatted date like "11 Juni 2025"
            const parts = initialData.valid_until.split(' ');
            if (parts.length >= 3) {
              const day = parseInt(parts[0]);
              const monthMap: Record<string, number> = {
                January: 0,
                February: 1,
                March: 2,
                April: 3,
                May: 4,
                June: 5,
                July: 6,
                August: 7,
                September: 8,
                October: 9,
                November: 10,
                December: 11,
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

      // Enhanced file handling - Check both file_url and file_dir
      const fileUrl = initialData.file_url || initialData.file_dir;
      if (fileUrl) {
        const fileName =
          initialData.file_name || fileUrl.split('/').pop() || 'Existing File';
        console.log('Setting existing file:', { url: fileUrl, name: fileName });
        setExistingFile({
          url: fileUrl,
          name: fileName,
        });
        setFileAction('keep');
      } else {
        // Reset file state if no file URL
        console.log('No existing file found in initialData');
        setExistingFile(null);
        setFileAction('keep');
      }

      setValidUntilDate(parsedDate);
      setSelectedFile(null);
    }
  }, [mode, initialData]);

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

    // Enhanced file validation
    if (mode === 'create') {
      if (!selectedFile) {
        return 'Please select a file to upload.';
      }
    } else if (mode === 'edit') {
      // For edit mode, check if we have any file available
      if (fileAction === 'remove' && !selectedFile) {
        return 'Please provide a file for the letter.';
      }
      // If no existing file and no selected file, require file
      if (!existingFile && !selectedFile) {
        return 'Please provide a file for the letter.';
      }
    }

    if (selectedFile) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
  }, [
    employeeId,
    letterTypeId,
    letterName,
    validUntilDate,
    status,
    selectedFile,
    mode,
    existingFile,
    fileAction,
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileAction('replace');
    }
  };

  const handleRemoveFile = () => {
    console.log('Removing file, current state:', {
      selectedFile,
      existingFile,
      fileAction,
    });
    setSelectedFile(null);
    if (mode === 'edit' && existingFile) {
      setFileAction('remove');
    } else {
      setFileAction('keep');
    }
    // Reset file input
    const fileInput = document.getElementById('letterFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleViewFile = () => {
    if (existingFile?.url) {
      const fileUrl = existingFile.url.startsWith('http')
        ? existingFile.url
        : `/storage/letter/${existingFile.url}`;
      window.open(fileUrl, '_blank');
    }
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
      file_action: fileAction,
      has_existing_file: !!existingFile,
      has_selected_file: !!selectedFile,
    });

    // Handle file operations based on action
    if (selectedFile) {
      formData.append('file', selectedFile);
    } else if (mode === 'edit') {
      if (fileAction === 'remove') {
        formData.append('remove_file', 'true');
      }
      // If fileAction is 'keep', we don't need to do anything
    }

    try {
      if (mode === 'create') {
        await api.post('/api/letter', formData);
      } else if (mode === 'edit' && initialData?.id) {
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
      const errorMessage =
        error.response?.data?.message || 'Something went wrong.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setShowFileInfo(true);
    }
  };

  if (isLoadingOptions) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Loading form options...</p>
        </div>
      </div>
    );
  }

  // Helper function to get file display info
  const getFileDisplayInfo = () => {
    if (selectedFile) {
      return {
        name: selectedFile.name,
        isNew: true,
        icon: (
          <FaFile className="text-2xl text-blue-600 dark:text-blue-400 mb-1" />
        ),
      };
    } else if (existingFile && fileAction !== 'remove') {
      return {
        name: existingFile.name,
        isNew: false,
        icon: (
          <FaFile className="text-2xl text-green-600 dark:text-green-400 mb-1" />
        ),
      };
    }
    return null;
  };

  const fileDisplayInfo = getFileDisplayInfo();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employee Select */}
        <div className="space-y-1">
          <Label htmlFor="employee">
            Employee
            <span className="text-red-600"> *</span>
          </Label>
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
          <Label htmlFor="letterType">
            Letter Type
            <span className="text-red-600"> *</span>
          </Label>
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
        <Label htmlFor="letterName">
          Letter Name
          <span className="text-red-600"> *</span>
        </Label>

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
        <Label htmlFor="letterDescription">
          Letter Description
          <span className="text-muted-foreground text-sm font-medium">
            {' '}
            (optional)
          </span>
        </Label>

        <Input
          id="letterDescription"
          value={letterDesc}
          onChange={(e) => setLetterDesc(e.target.value)}
          placeholder="Enter letter description (optional)"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Enhanced File Upload Section */}
        <div className="space-y-1">
          <Label htmlFor="letterFile">
            Upload Letter File
            <span className="text-red-600"> *</span>
          </Label>
          <div className="mt-1 relative w-full aspect-[3/1] border-2 border-dashed rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer">
            {fileDisplayInfo ? (
              <div className="flex flex-col items-center justify-center text-sm w-full px-4">
                {fileDisplayInfo.icon}
                <span className="text-center font-medium w-full truncate">
                  {fileDisplayInfo.name}
                </span>
                <div className="flex gap-1 mt-1">
                  {fileDisplayInfo.isNew ? (
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      New file selected
                    </span>
                  ) : mode === 'edit' ? (
                    <span className="text-xs text-green-600 dark:text-green-400">
                      Current file
                    </span>
                  ) : null}
                </div>
              </div>
            ) : isSubmitting ? (
              <div className="flex flex-col items-center justify-center text-sm">
                <FaUpload className="text-2xl text-gray-400 dark:text-gray-500 mb-1" />
                <span>Uploading file...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-sm">
                <FaUpload className="text-2xl text-gray-400 dark:text-gray-500 mb-1" />
                <span>Click to upload file</span>
                <span className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX (Max 10MB)
                </span>
              </div>
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

          {/* File Action Buttons */}
          {fileDisplayInfo && (
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveFile}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                disabled={isSubmitting}
              >
                <FaTrash className="w-3 h-3 mr-1" />
                Remove
              </Button>

              {existingFile && !selectedFile && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleViewFile}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  disabled={isSubmitting}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View File
                </Button>
              )}
            </div>
          )}

          {/* File Status Messages */}
          {mode === 'edit' && (
            <div className="text-xs text-gray-500 mt-2">
              {fileAction === 'keep' && existingFile && (
                <p className="text-green-600 dark:text-green-400 truncate">
                  ✓ Keeping existing file: {existingFile.name}
                </p>
              )}
              {fileAction === 'replace' && selectedFile && (
                <p className="text-blue-600 dark:text-blue-400 truncate">
                  ↻ Will replace with: {selectedFile.name}
                </p>
              )}
              {fileAction === 'remove' && (
                <p className="text-red-600 dark:text-red-400">
                  ✕ File will be removed
                </p>
              )}
            </div>
          )}
        </div>

        {/* Status and Valid Until */}
        <div className="space-y-6">
          {/* Letter Status Select */}
          <div className="space-y-1">
            <Label htmlFor="letterStatus">
              Letter Status
              <span className="text-red-600"> *</span>
            </Label>
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
            <Label htmlFor="validUntil">
              Valid Until
              <span className="text-red-600"> *</span>
            </Label>
            <div className="relative">
              <Input
                id="validUntil"
                type="date"
                value={
                  validUntilDate ? format(validUntilDate, 'yyyy-MM-dd') : ''
                }
                className="pr-4 [&::-webkit-calendar-picker-indicator]:opacity-100
                                   [&::-webkit-calendar-picker-indicator]:absolute
                                   [&::-webkit-calendar-picker-indicator]:right-2
                                   [&::-webkit-calendar-picker-indicator]:w-4
                                   [&::-webkit-calendar-picker-indicator]:h-4
                                   [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                style={{ colorScheme: 'light' }}
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
            ? mode === 'create'
              ? 'Creating...'
              : 'Updating...'
            : mode === 'create'
              ? 'Submit Letter'
              : 'Update Letter'}
        </Button>
      </DialogFooter>
    </form>
  );
}
