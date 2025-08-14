'use server';

/**
 * @fileOverview Mood detection AI agent.
 *
 * - summarizeMood - A function that handles the mood detection process.
 * - SummarizeMoodInput - The input type for the summarizeMood function.
 * - SummarizeMoodOutput - The return type for the summarizeMood function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMoodInputSchema = z.object({
  message: z.string().describe('The user message to analyze.'),
});
export type SummarizeMoodInput = z.infer<typeof SummarizeMoodInputSchema>;

const SummarizeMoodOutputSchema = z.object({
  mood: z
    .enum(['Happy', 'Sad', 'Angry', 'Neutral', 'Flirty'])
    .describe('The detected mood of the user message.'),
});
export type SummarizeMoodOutput = z.infer<typeof SummarizeMoodOutputSchema>;

export async function summarizeMood(input: SummarizeMoodInput): Promise<SummarizeMoodOutput> {
  return summarizeMoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMoodPrompt',
  input: {schema: SummarizeMoodInputSchema},
  output: {schema: SummarizeMoodOutputSchema},
  prompt: `You are an AI that detects the mood of a user message.

  The mood should be one of the following: Happy, Sad, Angry, Neutral, Flirty.

  Message: {{{message}}}

  What is the mood of the message?`,
});

const summarizeMoodFlow = ai.defineFlow(
  {
    name: 'summarizeMoodFlow',
    inputSchema: SummarizeMoodInputSchema,
    outputSchema: SummarizeMoodOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
