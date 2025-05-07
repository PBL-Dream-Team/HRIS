import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { LuArrowLeft } from "react-icons/lu";

export function ForgotPwrdEmailForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  return (
    <form className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground text-sm">
          No Worries! Enter your email address below, and we'll send you a link to reset your password.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <Button type="submit" className="w-full">
          Reset Password
        </Button>
        <a className="flex items-center place-content-center" href=''>
            <LuArrowLeft/>
            <span className="relative z-10 px-2 flex-row col-span-2">
                Back to Log-in
            </span>
        </a>
      </div>
    </form>
  );
}
