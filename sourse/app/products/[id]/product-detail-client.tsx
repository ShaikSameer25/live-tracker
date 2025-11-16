"use client";

import { useState } from 'react';
import Image from 'next/image';
import { RateChart } from '@/components/rate-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BrainCircuit, Loader } from 'lucide-react';
import { analyzeRateTrends } from '@/ai/flows/analyze-rate-trends';
import type { AnalyzeRateTrendsOutput } from '@/ai/flows/analyze-rate-trends';
import type { Product } from '@/lib/types';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetailClient({ product: initialProduct }: { product: Product }) {
  const [product, setProduct] = useState(initialProduct);
  const [analysis, setAnalysis] = useState<AnalyzeRateTrendsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysis(null);

    try {
      const rateDataString = JSON.stringify(product.history.map(h => ({ date: h.date, rate: h.rate })));
      const result = await analyzeRateTrends({
        productName: product.name,
        rateData: rateDataString,
      });
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      toast({
        title: "Analysis Failed",
        description: "Could not retrieve trend analysis. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
       <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
       </Link>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden">
                 <div className="relative w-full h-48 sm:h-64 bg-muted">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      data-ai-hint={product.imageHint}
                      priority
                      sizes="(max-width: 768px) 100vw, 66vw"
                    />
                  </div>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl sm:text-3xl font-bold font-headline">{product.name}</CardTitle>
                            <CardDescription>{product.category}</CardDescription>
                        </div>
                        <product.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl sm:text-4xl font-bold">${product.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Rate History (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    <RateChart history={product.history} />
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-1 space-y-6">
            <Card className="sticky top-20">
                <CardHeader>
                    <CardTitle>AI Trend Analysis</CardTitle>
                    <CardDescription>Use AI to identify patterns and anomalies in the rate data.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
                        {isLoading ? (
                            <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <BrainCircuit className="mr-2 h-4 w-4" />
                                Analyze Trends
                            </>
                        )}
                    </Button>
                    
                    {analysis && (
                        <div className="mt-6 space-y-4">
                            <h3 className="font-semibold text-foreground">Analysis Result:</h3>
                            <blockquote className="border-l-2 border-accent pl-4 text-sm italic text-muted-foreground bg-secondary/20 p-3 rounded-r-md">
                                {analysis.trendAnalysis}
                            </blockquote>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
