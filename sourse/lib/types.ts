import type { LucideIcon } from 'lucide-react';

export type RateHistory = {
  date: string;
  rate: number;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  icon: LucideIcon;
  rate: number;
  previousRate: number;
  history: RateHistory[];
  imageUrl: string;
  imageHint: string;
};

export type Alert = {
  productId: string;
  productName: string;
  threshold: number;
  condition: 'above' | 'below';
};
