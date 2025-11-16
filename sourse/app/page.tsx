"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, BellRing, Search, Package } from 'lucide-react';
import { productsData } from '@/lib/mock-data';
import type { Product, Alert } from '@/lib/types';
import { SetAlertDialog } from '@/components/set-alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function Home() {
  const [products, setProducts] = useState<Product[]>(productsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Initialize previousRate on mount to avoid hydration mismatch
    setProducts(currentProducts => currentProducts.map(p => ({...p, previousRate: p.rate})));
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Don't run on the server or before mount

    const interval = setInterval(() => {
      setProducts(prevProducts => {
        const updatedProducts = prevProducts.map(p => {
          const change = (Math.random() - 0.5) * (p.rate * 0.01);
          const newRate = Math.max(0, p.rate + change);
          
          const triggeredAlert = alerts.find(
            a =>
              a.productId === p.id &&
              ((a.condition === 'below' && newRate < a.threshold) ||
                (a.condition === 'above' && newRate > a.threshold))
          );

          if (triggeredAlert) {
            toast({
              title: "Rate Alert Triggered!",
              description: `${p.name}'s rate has gone ${triggeredAlert.condition} $${triggeredAlert.threshold.toFixed(2)}. Current rate: $${newRate.toFixed(2)}.`,
              variant: 'default',
            });
            // Remove the triggered alert
            setAlerts(prevAlerts => prevAlerts.filter(a => a.productId !== p.id));
          }

          return {
            ...p,
            previousRate: p.rate,
            rate: newRate,
            history: [...p.history.slice(1), { date: new Date().toISOString().split('T')[0], rate: newRate }]
          };
        });
        return updatedProducts;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [alerts, toast, isMounted]);

  const handleSetAlert = (alert: Alert) => {
    setAlerts(prevAlerts => [...prevAlerts.filter(a => a.productId !== alert.productId), alert]);
    toast({
      title: "Alert Set!",
      description: `You'll be notified when ${alert.productName}'s rate goes ${alert.condition} $${alert.threshold.toFixed(2)}.`,
    });
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);
  
  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-primary font-headline">Rate Tracker</h1>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                aria-label="Search products"
                placeholder="Search products..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map(product => {
              const rateChange = product.rate - product.previousRate;
              const RateIcon = rateChange >= 0 ? ArrowUp : ArrowDown;
              const rateColor = rateChange >= 0 ? 'text-chart-2' : 'text-destructive';

              return (
                <Card key={product.id} className="flex flex-col justify-between overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <Link href={`/products/${product.id}`} className="flex-grow flex flex-col">
                    <div className="relative w-full h-40">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        data-ai-hint={product.imageHint}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                      <CardTitle className="text-base font-medium leading-tight">{product.name}</CardTitle>
                      <product.icon className="h-5 w-5 text-muted-foreground shrink-0" />
                    </CardHeader>
                    <CardContent className="flex-grow mt-auto">
                      <div className="text-2xl font-bold">
                        ${product.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={cn('flex items-center text-xs font-medium', rateColor)}>
                        <RateIcon className="h-3 w-3 mr-1" />
                        <span>{rateChange.toFixed(2)} ({((rateChange / product.previousRate) * 100).toFixed(2)}%)</span>
                      </div>
                    </CardContent>
                  </Link>
                  <CardFooter>
                    <SetAlertDialog product={product} onSetAlert={handleSetAlert}>
                      <Button variant="outline" className="w-full">
                        <BellRing className="mr-2 h-4 w-4" /> Set Alert
                      </Button>
                    </SetAlertDialog>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No Products Found</h2>
            <p className="mt-2 text-muted-foreground">
              Your search for "{searchTerm}" did not match any products.
            </p>
          </div>
        )}
      </main>
      <footer className="w-full border-t mt-auto">
        <div className="container mx-auto p-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Rate Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
