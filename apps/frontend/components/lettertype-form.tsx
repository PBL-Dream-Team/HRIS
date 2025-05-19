import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';

export function LetterTypeForm() {
  return (
    <form>
      <div>
        <div className="mb-4">
        <Label htmlFor="letterTypeName">Letter Type Name</Label>
        <Input id="letterTypeName" type="text" placeholder="Enter letter name" />
      </div>
      <div className="mb-4">
        <Label htmlFor="letterTypeContent">Letter Type Content</Label>
        <Input
          id="letterTypeContent"
          type="text"
          placeholder="Enter letter content"
        />
      </div>
      <DialogFooter className="gap-2 sm:justify-end">
        <Button type="submit" className="w-20">
          Submit
        </Button>
      </DialogFooter>
      </div>
    </form>
  );
}
