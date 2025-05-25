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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DialogFooter } from '@/components/ui/dialog';

// Libraries & Utilities
import api from '@/lib/axios';
import { format, parse, isValid } from 'date-fns';
import { id as dateFnsLocaleId } from 'date-fns/locale'; // Renamed to avoid conflict
import { toast } from 'sonner';

// Icons
import { CalendarIcon } from 'lucide-react';
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
  const [validUntilDate, setValidUntilDate] = useState<Date | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Options for Select Inputs
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [letterTypes, setLetterTypes] = useState<LetterTypeOption[]>([]);

  // State for loading indicators or errors during option fetching
  const [isLoadingOptions, setIsLoadingOptions] = useState<boolean>(true);

  // Fetch employees and letter types for select options
  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const [empRes, typeRes] = await Promise.all([
          api.get(`/api/employee?company_id=${companyId}`),
          api.get(`/api/letterType?company_id=${companyId}`),
        ]);
        setEmployees(empRes.data ?? []);
        setLetterTypes(typeRes.data ?? []);
      } catch (error) {
        console.error('Error fetching form options:', error);
        toast.error('Failed to load employees or letter types.');
        setEmployees([]);
        setLetterTypes([]);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    if (companyId) {
      fetchOptions();
    }
  }, [companyId]);

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
          // Ensure the parsing format matches the incoming string format
          const dateValue = parse(
            initialData.valid_until,
            DATE_PARSE_FORMAT,
            new Date(),
            { locale: dateFnsLocaleId },
          );
          if (isValid(dateValue)) {
            parsedDate = dateValue;
          } else {
            console.warn(`Invalid date string received: ${initialData.valid_until}`);
          }
        } catch (e) {
          console.error('Error parsing date:', e);
        }
      }
      setValidUntilDate(parsedDate);
      setSelectedFile(null);
    }
  }, [mode, initialData, isLoadingOptions, employees, letterTypes]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeId || !letterTypeId || !letterName || !validUntilDate || !status) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('company_id', companyId);
    formData.append('employee_id', employeeId);
    formData.append('lettertype_id', letterTypeId);
    formData.append('name', letterName);
    formData.append('desc', letterDesc);
    formData.append('valid_until', validUntilDate.toISOString());
    formData.append('is_active', status === 'active' ? 'true' : 'false');

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
      onSuccess?.();
      onClose?.();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      // Log FormData entries for debugging if needed
      // for (const [key, value] of formData.entries()) {
      //   console.log(`FormData ${key}:`, value);
      // }
      const errorMessage = error.response?.data?.message || 'Something went wrong.';
      toast.error(errorMessage);
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
          <Select value={employeeId} onValueChange={setEmployeeId} required>
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
          <Select value={letterTypeId} onValueChange={setLetterTypeId} required>
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
          required
        />
      </div>

      {/* Letter Description Input */}
      <div className="space-y-1">
        <Label htmlFor="letterDescription">Letter Description</Label>
        <Input
          id="letterDescription"
          value={letterDesc}
          onChange={(e) => setLetterDesc(e.target.value)}
          placeholder="Enter letter description (optional)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Upload */}
        <div className="space-y-1">
          <Label htmlFor="letterFile">
            Upload Letter File {mode === 'create' ? '' : '(Optional: Overwrites existing)'}
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
            />
          </div>
            {mode === 'edit' && initialData?.file_url && !selectedFile && (
                <p className="text-xs text-gray-500 mt-1">Leave empty to keep the existing file.</p>
            )}
        </div>

        {/* Status and Valid Until */}
        <div className="space-y-6">
          {/* Letter Status Select */}
          <div className="space-y-1">
            <Label htmlFor="letterStatus">Letter Status *</Label>
            <Select value={status} onValueChange={setStatus} required>
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="validUntil"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {validUntilDate ? format(validUntilDate, DATE_DISPLAY_FORMAT) : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={validUntilDate}
                  onSelect={setValidUntilDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <DialogFooter className="pt-4">
        {onClose && ( 
             <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                 Cancel
             </Button>
        )}
        <Button type="submit" className="w-full sm:w-auto">
          {mode === 'create' ? 'Submit Letter' : 'Update Letter'}
        </Button>
      </DialogFooter>
    </form>
  );
}