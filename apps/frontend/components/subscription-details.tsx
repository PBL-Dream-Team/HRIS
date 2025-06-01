'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CalendarIcon, CreditCardIcon } from 'lucide-react';

type Subscription = {
  id: string;
  startDate: string;
  endDate: string;
  price: string;
  type: string;
  status: 'Active' | 'Expired' | 'Trial' | 'Cancelled';
  paymentMethod: string;
  lastUpdated: string;
};

interface SubscriptionDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSubscription?: Subscription;
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
                    {selectedSubscription.startDate}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">End Date</p>
                  <p className="font-medium">{selectedSubscription.endDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Type</p>
                  <p className="font-medium">{selectedSubscription.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Price</p>
                  <p className="font-medium">{selectedSubscription.price}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-2">Status</p>
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
                <div className="flex items-center gap-2">
                  <CreditCardIcon className="w-4 h-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-xs">
                    Payment Method
                  </p>
                </div>
                <p className="font-medium">
                  {selectedSubscription.paymentMethod}
                </p>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-xs">Last Updated</p>
                </div>
                <p className="font-medium">
                  {selectedSubscription.lastUpdated}
                </p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
