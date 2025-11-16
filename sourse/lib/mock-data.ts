import type { Product } from '@/lib/types';
import { Wheat, Gem, Factory, Bitcoin, Building, Apple, Dna, Rocket, Landmark, Coins } from 'lucide-react';

// Function to generate historical data
const generateHistory = (baseRate: number) => {
  const history = [];
  let currentRate = baseRate * (Math.random() * 0.2 + 0.9); // start near base rate
  for (let i = 30; i > 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    history.push({
      date: date.toISOString().split('T')[0],
      rate: parseFloat(currentRate.toFixed(4)),
    });
    // Simulate some volatility
    currentRate *= (Math.random() * 0.04 - 0.015) + 1;
  }
  return history;
};

const icons = [Wheat, Gem, Factory, Bitcoin, Building, Apple, Dna, Rocket, Landmark, Coins];

const initialProducts: Omit<Product, 'previousRate'>[] = [
  {
    id: 'gold',
    name: 'Gold',
    category: 'Commodities',
    icon: Gem,
    rate: 2350.55,
    history: generateHistory(2350),
    imageUrl: 'https://picsum.photos/seed/gold/600/400',
    imageHint: 'gold bars',
  },
  {
    id: 'wheat',
    name: 'Wheat',
    category: 'Agriculture',
    icon: Wheat,
    rate: 6.85,
    history: generateHistory(6.85),
    imageUrl: 'https://picsum.photos/seed/wheat/600/400',
    imageHint: 'wheat field',
  },
  {
    id: 'crude-oil',
    name: 'Crude Oil',
    category: 'Energy',
    icon: Factory,
    rate: 80.25,
    history: generateHistory(80),
    imageUrl: 'https://picsum.photos/seed/oil/600/400',
    imageHint: 'oil pump',
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    category: 'Crypto',
    icon: Bitcoin,
    rate: 68000.0,
    history: generateHistory(68000),
    imageUrl: 'https://picsum.photos/seed/bitcoin/600/400',
    imageHint: 'crypto currency',
  },
  {
    id: 'real-estate-index',
    name: 'Real Estate Index',
    category: 'Indices',
    icon: Building,
    rate: 1250.75,
    history: generateHistory(1250),
    imageUrl: 'https://picsum.photos/seed/estate/600/400',
    imageHint: 'modern building',
  },
];

const productNames = [
  'Silver', 'Corn', 'Natural Gas', 'Ethereum', 'S&P 500', 'Soybeans', 'Copper', 'Ripple', 'Nasdaq 100', 'Cotton',
  'Platinum', 'Coffee', 'Heating Oil', 'Cardano', 'Dow Jones', 'Sugar', 'Aluminum', 'Litecoin', 'Russell 2000', 'Cocoa',
  'Palladium', 'Orange Juice', 'Gasoline', 'Solana', 'FTSE 100', 'Lumber', 'Nickel', 'Chainlink', 'DAX', 'Oats',
  'Zinc', 'Lean Hogs', 'Propane', 'Polkadot', 'Nikkei 225', 'Rice', 'Lead', 'Stellar', 'Hang Seng', 'Feeder Cattle',
  'Uranium', 'Soybean Oil', 'Methanol', 'Avalanche', 'Euro Stoxx 50', 'Canola', 'Tin', 'Polygon', 'IBEX 35', 'Live Cattle',
  'Apple Inc.', 'Microsoft', 'Amazon', 'Google', 'Facebook', 'Tesla', 'Nvidia', 'Netflix', 'Intel', 'AMD',
  'PayPal', 'Adobe', 'Salesforce', 'Oracle', 'Cisco', 'IBM', 'Qualcomm', 'Broadcom', 'Texas Instruments', 'Micron',
  'USD/EUR', 'USD/JPY', 'GBP/USD', 'USD/CAD', 'AUD/USD', 'USD/CHF', 'NZD/USD', 'EUR/JPY', 'EUR/GBP', 'EUR/CHF',
  'Bonds', 'Treasury Notes', 'Corporate Bonds', 'Municipal Bonds', 'Junk Bonds', 'T-Bills', 'T-Bonds', 'German Bunds', 'UK Gilts', 'Japanese Bonds'
];

const categories = [
  'Commodities', 'Agriculture', 'Energy', 'Crypto', 'Indices', 'Agriculture', 'Commodities', 'Crypto', 'Indices', 'Agriculture',
  'Commodities', 'Agriculture', 'Energy', 'Crypto', 'Indices', 'Agriculture', 'Commodities', 'Crypto', 'Indices', 'Agriculture',
  'Commodities', 'Agriculture', 'Energy', 'Crypto', 'Indices', 'Commodities', 'Commodities', 'Crypto', 'Indices', 'Agriculture',
  'Commodities', 'Agriculture', 'Energy', 'Crypto', 'Indices', 'Agriculture', 'Commodities', 'Crypto', 'Indices', 'Agriculture',
  'Commodities', 'Agriculture', 'Energy', 'Crypto', 'Indices', 'Agriculture', 'Commodities', 'Crypto', 'Indices', 'Agriculture',
  'Stocks', 'Stocks', 'Stocks', 'Stocks', 'Stocks', 'Stocks', 'Stocks', 'Stocks', 'Stocks', 'Stocks',
  'Stocks', 'Stocks', 'Stocks', 'Stocks', 'Stocks', 'Stocks', 'Stocks', 'Stocks', 'Stocks', 'Stocks',
  'Forex', 'Forex', 'Forex', 'Forex', 'Forex', 'Forex', 'Forex', 'Forex', 'Forex', 'Forex',
  'Bonds', 'Bonds', 'Bonds', 'Bonds', 'Bonds', 'Bonds', 'Bonds', 'Bonds', 'Bonds', 'Bonds'
];

for (let i = 0; i < 100; i++) {
    const rate = Math.random() * 1000 + 10;
    const name = productNames[i] || `Product ${i + 1}`;
    initialProducts.push({
        id: `product-${i + 1}`,
        name: name,
        category: categories[i] || 'General',
        icon: icons[i % icons.length],
        rate,
        history: generateHistory(rate),
        imageUrl: `https://picsum.photos/seed/${name.toLowerCase().replace(' ','-')}/${600}/${400}`,
        imageHint: name.toLowerCase(),
    });
}

export const productsData: Product[] = initialProducts.map(p => ({
    ...p,
    previousRate: p.rate,
}));
