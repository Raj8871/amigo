// src/ai/flows/persona-chat.ts
'use server';
/**
 * @fileOverview A role-based AI persona chat agent.
 *
 * - personaChat - A function that handles the chat with a specific persona.
 * - PersonaChatInput - The input type for the personaChat function.
 * - PersonaChatOutput - The return type for the personaChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonaChatInputSchema = z.object({
  role: z
    .enum(['Brother', 'Friend', 'Girlfriend', 'Mother', 'Father'])
    .describe('The role of the AI persona.'),
  message: z.string().describe('The user message to respond to.'),
  chatHistory: z.string().optional().describe('Previous chat history if any')
});
export type PersonaChatInput = z.infer<typeof PersonaChatInputSchema>;

const PersonaChatOutputSchema = z.object({
  response: z.string().describe('The AI persona response.'),
});
export type PersonaChatOutput = z.infer<typeof PersonaChatOutputSchema>;

export async function personaChat(input: PersonaChatInput): Promise<PersonaChatOutput> {
  return personaChatFlow(input);
}

const personaChatPrompt = ai.definePrompt({
  name: 'personaChatPrompt',
  input: {schema: PersonaChatInputSchema},
  output: {schema: PersonaChatOutputSchema},
  prompt: `You are an AI persona, and your role is {{{role}}}. Please respond to the following message from the user, tailoring your tone, language, and style to match the persona of a {{{role}}}. Consider the chat history to maintain context.

Chat History: {{chatHistory}}

User Message: {{{message}}}

Response:`,
});

const personaChatFlow = ai.defineFlow(
  {
    name: 'personaChatFlow',
    inputSchema: PersonaChatInputSchema,
    outputSchema: PersonaChatOutputSchema,
  },
  async input => {
    const {output} = await personaChatPrompt(input);
    return output!;
  }
);
