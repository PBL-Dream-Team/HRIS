import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";

export function LetterForm() {
  return (
    <form>
      <div className="mb-4">
        <Label htmlFor="letterName">Letter Name</Label>
        <Input id="letterName" type="text" placeholder="Enter letter name" />
      </div>
      <div className="mb-4">
        <Label htmlFor="letterType">Letter Type</Label>
        <Input id="letterType" type="text" placeholder="Enter letter type" />
      </div>
      <div className="mb-4">
        <Label htmlFor="letterDescription">Letter Description</Label>
        <Input
          id="letterDescription"
          type="text"
          placeholder="Enter letter description"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="letterStatus">Letter Status</Label>
        <Input
          id="letterStatus"
          type="text"
          placeholder="Enter letter status"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="validUntil">Valid Until</Label>
        <Input id="validUntil" type="date" />
      </div>
      <DialogFooter className="gap-2 sm:justify-end">
        <Button type="submit" className="w-20">
          Submit
        </Button>
      </DialogFooter>
    </form>
  );
}
