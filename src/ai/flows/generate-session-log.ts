'use server';

/**
 * @fileOverview A flow to generate a session log entry with AI-provided advice for lawyers.
 *
 * - generateSessionLog - A function that generates a session log entry.
 * - GenerateSessionLogInput - The input type for the generateSessionLog function.
 * - GenerateSessionLogOutput - The return type for the generateSessionLog function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSessionLogInputSchema = z.object({
  elapsedTime: z.string().describe('The elapsed time of the session.'),
  description: z.string().describe('A brief description of the task performed during the session.'),
});
export type GenerateSessionLogInput = z.infer<typeof GenerateSessionLogInputSchema>;

const GenerateSessionLogOutputSchema = z.object({
  logEntry: z.string().describe('A log entry containing the session details and AI advice.'),
});
export type GenerateSessionLogOutput = z.infer<typeof GenerateSessionLogOutputSchema>;

export async function generateSessionLog(input: GenerateSessionLogInput): Promise<GenerateSessionLogOutput> {
  return generateSessionLogFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSessionLogPrompt',
  input: {schema: GenerateSessionLogInputSchema},
  output: {schema: GenerateSessionLogOutputSchema},
  prompt: `You are an AI assistant for legal professionals, helping them log their ad-hoc work sessions.
  Given the elapsed time and a brief description of the task, generate a concise log entry with some helpful advice.

  Elapsed Time: {{{elapsedTime}}}
  Description: {{{description}}}

  Log Entry:`,
});

const generateSessionLogFlow = ai.defineFlow(
  {
    name: 'generateSessionLogFlow',
    inputSchema: GenerateSessionLogInputSchema,
    outputSchema: GenerateSessionLogOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
