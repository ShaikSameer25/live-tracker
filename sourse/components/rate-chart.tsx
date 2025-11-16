"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import type { RateHistory } from '@/lib/types';

interface RateChartProps {
  history: RateHistory[];
}

const chartConfig = {
  rate: {
    label: "Rate",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export function RateChart({ history }: RateChartProps) {
  return (
    <div className="w-full h-80">
      <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
        <LineChart
          accessibilityLayer
          data={history}
          margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={Math.floor(history.length / 6)}
          />
          <YAxis 
            dataKey="rate"
            domain={['dataMin - (dataMax-dataMin)*0.1', 'dataMax + (dataMax-dataMin)*0.1']}
            tickFormatter={(value) => `$${typeof value === 'number' ? value.toLocaleString('en-US', {maximumFractionDigits: 0}) : ''}`}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={80}
          />
          <ChartTooltip
            cursor={true}
            content={
              <ChartTooltipContent
                indicator="dot"
                labelFormatter={(value, payload) => {
                    const date = payload?.[0]?.payload.date;
                    if (date) {
                      return new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    }
                    return value;
                }}
                 formatter={(value, name) => (
                    <>
                    <span className="font-bold text-foreground">
                        ${typeof value === 'number' ? value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : ''}
                    </span>
                    </>
                 )}
              />
            }
          />
          <Line
            dataKey="rate"
            type="monotone"
            stroke="var(--color-rate)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
