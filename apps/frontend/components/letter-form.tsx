import { useEffect, useState } from 'react';
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
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DialogFooter } from '@/components/ui/dialog';
import { FaFile } from 'react-icons/fa6';
import api from '@/lib/axios';
import { parse } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';

type LetterFormProps = {
  mode: 'create' | 'edit';
  companyId: string;
  initialData?: {
    id: string;
    employee_id: string;
    lettertype_id: string;
    name: string;
    desc: string;
    valid_until: string;
    is_active: boolean;
    file_url?: string;
  };
  onSuccess?: () => void;
};

export function LetterForm({
  mode,
  companyId,
  initialData,
  onSuccess,
}: LetterFormProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [letterTypeId, setLetterTypeId] = useState('');
  const [letterName, setLetterName] = useState('');
  const [letterDesc, setLetterDesc] = useState('');
  const [status, setStatus] = useState('active');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [employees, setEmployees] = useState<{ id: string; first_name: string; last_name: string }[]>([]);
  const [letterTypes, setLetterTypes] = useState<{ id: string; name: string }[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeId || !letterTypeId || !letterName || !date || !status) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('company_id', companyId);
    formData.append('employee_id', employeeId);
    formData.append('lettertype_id', letterTypeId);
    formData.append('name', letterName);
    formData.append('desc', letterDesc);
    formData.append('valid_until', date.toISOString());
    formData.append('is_active', status === 'active' ? 'true' : 'false');
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      if (mode === 'create') {
        await api.post('/api/letter', formData);
      } else if (mode === 'edit' && initialData?.id) {
        await api.put(`/api/letter/${initialData.id}`, formData);
      }

      toast.success(
        `Letter ${mode === 'create' ? 'created' : 'updated'} successfully!`,
      );
      onSuccess?.();
    } catch (error) {
      console.error(error);
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      toast.error('Something went wrong.');
    }
  };

  useEffect(() => {
    if (initialData && employees.length > 0 && letterTypes.length > 0) {
      setEmployeeId(initialData.employee_id || '');
      setLetterTypeId(initialData.lettertype_id || '');
      setLetterName(initialData.name || '');
      setLetterDesc(initialData.desc || '');
      setStatus(initialData.is_active ? 'active' : 'notactive');

      let parsedDate: Date | undefined = undefined;
      if (initialData.valid_until) {
        try {
          parsedDate = parse(initialData.valid_until, 'dd MMMM yyyy', new Date(), { locale: id });
          if (isNaN(parsedDate.getTime())) parsedDate = undefined;
        } catch {
          parsedDate = undefined;
        }
      }

      setDate(parsedDate);
      setSelectedFile(null);
    }
  }, [initialData, employees, letterTypes]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const empRes = await api.get(`/api/employee?company_id=${companyId}`);
        setEmployees(empRes.data ?? []);

        const typeRes = await api.get(
          `/api/letterType?company_id=${companyId}`,
        );
        setLetterTypes(typeRes.data ?? []);
      } catch (error) {
        console.error('Error fetching form options:', error);
        setEmployees([]);
        setLetterTypes([]);
      }
    };

    fetchOptions();
  }, [companyId]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 space-y-4">
          <div>
            <Label htmlFor="employee">Employee</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="-Choose Employee-" />
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
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <div>
            <Label htmlFor="letterType">Letter Type</Label>
            <Select value={letterTypeId} onValueChange={setLetterTypeId}>
              <SelectTrigger>
                <SelectValue placeholder="-Choose Letter-" />
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
      </div>

      <div className="mb-4">
        <Label htmlFor="letterName">Letter Name</Label>
        <Input
          id="letterName"
          value={letterName}
          onChange={(e) => setLetterName(e.target.value)}
          placeholder="Enter letter name"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="letterDescription">Letter Description</Label>
        <Input
          id="letterDescription"
          value={letterDesc}
          onChange={(e) => setLetterDesc(e.target.value)}
          placeholder="Enter letter description"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 space-y-4">
          <Label htmlFor="letterFile">Upload Letter File</Label>
          <div className="mt-2 relative w-full aspect-[3/1] border-2 border-dashed rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 transition cursor-pointer">
            {selectedFile ? (
              <div className="flex flex-col items-center justify-center text-black text-sm">
                <FaFile className="text-2xl text-[#1E3A5F] mb-1" />
                <span className="text-sm text-center px-2 break-all">
                  {selectedFile.name}
                </span>
              </div>
            ) : initialData?.file_url ? (
              <div className="text-sm text-center">
                <FaFile className="text-2xl text-[#1E3A5F] mb-1 mx-auto" />
                Existing file: {initialData.file_url.split('/').pop()}
              </div>
            ) : (
              <span className="flex flex-col items-center justify-center text-black text-sm">
                <FaFile className="text-2xl text-[#1E3A5F] mb-1" />
                Click to upload
              </span>
            )}
            <Input
              id="letterFile"
              type="file"
              accept="*/*"
              onChange={handleFileChange}
              className="absolute opacity-0 w-full h-full cursor-pointer"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <div>
            <Label htmlFor="letterStatus">Letter Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="-Choose Letter Status-" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="notactive">Not Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="validUntil">Valid Until</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'dd/MM/yyyy') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <DialogFooter className="gap-2 sm:justify-end mt-4">
        <Button type="submit" className="w-24">
          {mode === 'create' ? 'Submit' : 'Update'}
        </Button>
      </DialogFooter>
    </form>
  );
}
