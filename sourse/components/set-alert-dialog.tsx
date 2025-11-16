"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Product, Alert } from '@/lib/types';
import type { ReactNode } from 'react';

interface SetAlertDialogProps {
  product: Product;
  onSetAlert: (alert: Alert) => void;
  children: ReactNode;
}

export function SetAlertDialog({ product, onSetAlert, children }: SetAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const [threshold, setThreshold] = useState(product.rate.toFixed(2));
  const [condition, setCondition] = useState<'below' | 'above'>('below');

  const handleSubmit = () => {
    if (isNaN(parseFloat(threshold))) return;
    onSetAlert({
      productId: product.id,
      productName: product.name,
      threshold: parseFloat(threshold),
      condition,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Alert for {product.name}</DialogTitle>
          <DialogDescription>
            Current rate: ${product.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. 
            Get notified when the rate reaches your target.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="threshold" className="text-right">
              Target Rate
            </Label>
            <Input
              id="threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
             <Label className="text-right">Condition</Label>
             <RadioGroup defaultValue="below" className="col-span-3 flex items-center space-x-4" onValueChange={(value: 'below' | 'above') => setCondition(value)} value={condition}>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="below" id="r-below" />
                    <Label htmlFor="r-below">Below</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="above" id="r-above" />
                    <Label htmlFor="r-above">Above</Label>
                </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Set Alert</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
