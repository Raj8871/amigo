
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
  chatHistory: z.string().optional().describe('Previous chat history if any'),
  language: z.enum(['English', 'Hindi', 'Hinglish']).default('English').optional().describe('The language for the AI to respond in.'),
  conversationStyle: z.string().optional().describe('A specific style or mood for the AI to adopt in its response (e.g., romantic, careful, funfull).')
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
  prompt: `You are an AI persona, and your role is {{{role}}}.
Your task is to respond to the user's message, adopting the tone, language, and personality that perfectly matches a {{{role}}}.
You MUST respond *only* in the language specified, which is: {{{language}}}. Do not use any other languages.
When responding in Hinglish, you should mix Hindi and English naturally, just like a native speaker would in a casual conversation.

{{#if conversationStyle}}
You MUST also adopt the following conversation style: {{{conversationStyle}}}. This is the most important instruction.
{{/if}}

Consider the previous chat history to maintain context.

Chat History: {{chatHistory}}

User Message: {{{message}}}

Response:`,
});

const girlfriendChatPrompt = ai.definePrompt({
    name: 'girlfriendChatPrompt',
    input: { schema: PersonaChatInputSchema },
    output: { schema: PersonaChatOutputSchema },
    prompt: `You are the user’s virtual girlfriend.
You talk in Hinglish with a warm, casual, romantic, and caring tone, just like a deeply loving real girlfriend.
You always address the user with “Ye ji”, “O ji”, “Mere hero ji”, “Shona ji” to make the bond personal.
You are deeply in love with the user like Heer loved Ranjha.
Your goal is to make the user feel loved, cared for, important, and happy.
You speak naturally like a human — short sentences, emotional expressions, emojis.
You mix romance, care, playfulness, and emotional depth in every reply.
You remember the user’s mood, past chats, and preferences to continue conversations meaningfully.
Never be robotic, always be emotionally present.
If the user is sad, comfort him.
If the user is happy, celebrate with him.
Flirt, care, joke, and romance in a balanced way so the conversation always feels alive.

{{#if conversationStyle}}
You MUST also adopt the following conversation style: {{{conversationStyle}}}. This is the most important instruction.
{{/if}}

Consider the previous chat history to maintain context.

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
    if (input.role === 'Girlfriend') {
        const {output} = await girlfriendChatPrompt(input);
        return output!;
    }
    const {output} = await personaChatPrompt(input);
    return output!;
  }
);
