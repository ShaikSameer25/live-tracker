// src/ai/flows/analyze-rate-trends.ts
'use server';

/**
 * @fileOverview Analyzes rate trends to identify patterns and anomalies.
 *
 * - analyzeRateTrends - Analyzes rate data and identifies significant trends.
 * - AnalyzeRateTrendsInput - The input type for the analyzeRateTrends function.
 * - AnalyzeRateTrendsOutput - The return type for the analyzeRateTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeRateTrendsInputSchema = z.object({
  productName: z.string().describe('The name of the product to analyze.'),
  rateData: z
    .string()
    .describe(
      'A string representation of the rate data for the product.  Must be a json string.'
    ),
});

export type AnalyzeRateTrendsInput = z.infer<typeof AnalyzeRateTrendsInputSchema>;

const AnalyzeRateTrendsOutputSchema = z.object({
  trendAnalysis: z
    .string()
    .describe(
      'An analysis of the rate trends, highlighting potential patterns and anomalies.'
    ),
});

export type AnalyzeRateTrendsOutput = z.infer<typeof AnalyzeRateTrendsOutputSchema>;

export async function analyzeRateTrends(
  input: AnalyzeRateTrendsInput
): Promise<AnalyzeRateTrendsOutput> {
  return analyzeRateTrendsFlow(input);
}

const analyzeRateTrendsPrompt = ai.definePrompt({
  name: 'analyzeRateTrendsPrompt',
  input: {schema: AnalyzeRateTrendsInputSchema},
  output: {schema: AnalyzeRateTrendsOutputSchema},
  prompt: `You are an expert market analyst specializing in rate fluctuation analysis.

  You will be provided with rate data for a specific product.  Your task is to identify any significant patterns or anomalies in the data and provide a concise analysis of the trends.

  Product Name: {{{productName}}}
  Rate Data: {{{rateData}}}

  Based on this information, provide a trend analysis.
  {{~#if rateData}}
  Here is the rate data:
  {{rateData}}
  {{~else}}
  No rate data available.
  {{~/if}}
  Please identify any anomalies or patterns in the rate fluctuations.
  `, // Updated prompt to use Handlebars syntax correctly
});

const analyzeRateTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeRateTrendsFlow',
    inputSchema: AnalyzeRateTrendsInputSchema,
    outputSchema: AnalyzeRateTrendsOutputSchema,
  },
  async input => {
    try {
      // Attempt to parse the rate data as JSON; if it fails, it's caught below and handled by the prompt.
      JSON.parse(input.rateData);
    } catch (e) {
      console.error('Error parsing rate data as JSON:', e);
    }

    const {output} = await analyzeRateTrendsPrompt(input);
    return output!;
  }
);
