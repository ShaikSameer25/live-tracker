import { productsData } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import ProductDetailClient from './product-detail-client';
import type { Metadata } from 'next';

type Props = {
  params: { id: string };
};

export function generateStaticParams() {
    return productsData.map((product) => ({
        id: product.id,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = productsData.find(p => p.id === params.id);
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }
  return {
    title: `${product.name} Rate Details | Rate Tracker`,
    description: `View live rate history and trend analysis for ${product.name}.`,
  };
}


export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you'd fetch this data. Here we find it in our mock data.
  // The state of the product (like current rate) on this page will be from the initial load
  // and won't reflect the live updates from the homepage. This is a reasonable tradeoff for this demo.
  const product = productsData.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
