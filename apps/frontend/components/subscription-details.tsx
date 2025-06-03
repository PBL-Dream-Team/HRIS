'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  CalendarIcon,
  CreditCardIcon,
  ReceiptIcon,
  BadgeCheckIcon,
} from 'lucide-react';

type Subscription = {
  id: string;
  company_id: string;
  subscription_id: string;
  price: string;
  startDate: string;
  endDate: string;
  expiresAt: string;
  merchantRef: string;
  paidAt: string;
  paymentMethod: string;
  status: string;
  tripayRef: string;
};

interface SubscriptionDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSubscription?: Subscription | null;
}

export default function SubscriptionDetails({
  open,
  onOpenChange,
  selectedSubscription,
}: SubscriptionDetailsProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[500px] overflow-y-auto"
      >
        <SheetHeader className="px-4">
          <SheetTitle>Subscription Details</SheetTitle>
        </SheetHeader>

        {selectedSubscription && (
          <div className="space-y-4 my-4 px-4">
            {/* Subscription Info */}
            <div className="border rounded-md p-4 text-sm">
              <h4 className="font-medium mb-4">Subscription Information</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <p className="text-muted-foreground text-xs">Start Date</p>
                  <p className="font-medium">
                    {new Date(selectedSubscription.startDate).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Expires Date</p>
                  <p className="font-medium">
                    {selectedSubscription.expiresAt
                      ? new Date(selectedSubscription.expiresAt).toLocaleDateString('en-GB')
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Subscription ID</p>
                  <p className="font-medium break-all">
                    {selectedSubscription.subscription_id}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Total</p>
                  <p className="font-medium">
                    Rp {Number(selectedSubscription.price).toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      selectedSubscription.status === 'Active'
                        ? 'text-green-600 bg-green-100'
                        : 'text-red-600 bg-red-100'
                    }`}
                  >
                    {selectedSubscription.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border rounded-md p-4 text-sm">
              <h4 className="font-medium mb-4">Payment Information</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="flex items-center gap-2 col-span-2">
                  <CreditCardIcon className="w-4 h-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-xs">Payment Method</p>
                </div>
                <p className="font-medium col-span-2">
                  {selectedSubscription.paymentMethod || '-'}
                </p>

                <div className="flex items-center gap-2 col-span-2">
                  <BadgeCheckIcon className="w-4 h-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-xs">Paid At</p>
                </div>
                <p className="font-medium col-span-2">
                  {selectedSubscription.paidAt
                    ? new Date(selectedSubscription.paidAt).toLocaleDateString('en-GB')
                    : '-'}
                </p>
                <div className="flex items-center gap-2 col-span-2">
                  <ReceiptIcon className="w-4 h-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-xs">Merchant Ref</p>
                </div>
                <p className="font-medium col-span-2 break-all">
                  {selectedSubscription.merchantRef || '-'}
                </p>

                <div className="flex items-center gap-2 col-span-2">
                  <ReceiptIcon className="w-4 h-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-xs">Tripay Ref</p>
                </div>
                <p className="font-medium col-span-2 break-all">
                  {selectedSubscription.tripayRef || '-'}
                </p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
