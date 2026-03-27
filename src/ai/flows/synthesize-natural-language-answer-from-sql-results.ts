'use server';
/**
 * @fileOverview A Genkit flow for synthesizing a natural language answer from SQL query results.
 *
 * - synthesizeNaturalLanguageAnswerFromSqlResults - A function that handles the synthesis process.
 * - SynthesizeNaturalLanguageAnswerFromSqlResultsInput - The input type for the synthesizeNaturalLanguageAnswerFromSqlResults function.
 * - SynthesizeNaturalLanguageAnswerFromSqlResultsOutput - The return type for the synthesizeNaturalLanguageAnswerFromSqlResults function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SynthesizeNaturalLanguageAnswerFromSqlResultsInputSchema = z.object({
  naturalLanguageQuestion: z.string().describe('The original natural language question asked by the user.'),
  sqlQuery: z.string().describe('The SQL query that was executed against the database.'),
  queryResults: z.string().describe('The raw results obtained from executing the SQL query, typically as a stringified JSON or CSV.'),
  schemaMetadata: z.string().describe('Metadata about the database schema (tables, columns) relevant to the query.').optional(),
});
export type SynthesizeNaturalLanguageAnswerFromSqlResultsInput = z.infer<typeof SynthesizeNaturalLanguageAnswerFromSqlResultsInputSchema>;

const SynthesizeNaturalLanguageAnswerFromSqlResultsOutputSchema = z.object({
  naturalLanguageAnswer: z.string().describe('The concise, human-readable natural language answer synthesized from the SQL query results.'),
});
export type SynthesizeNaturalLanguageAnswerFromSqlResultsOutput = z.infer<typeof SynthesizeNaturalLanguageAnswerFromSqlResultsOutputSchema>;

export async function synthesizeNaturalLanguageAnswerFromSqlResults(input: SynthesizeNaturalLanguageAnswerFromSqlResultsInput): Promise<SynthesizeNaturalLanguageAnswerFromSqlResultsOutput> {
  return synthesizeNaturalLanguageAnswerFromSqlResultsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'synthesizeNaturalLanguageAnswerFromSqlResultsPrompt',
  input: { schema: SynthesizeNaturalLanguageAnswerFromSqlResultsInputSchema },
  output: { schema: SynthesizeNaturalLanguageAnswerFromSqlResultsOutputSchema },
  prompt: `You are a helpful assistant that converts raw SQL query results into clear, concise, and human-readable natural language answers.

Use the following information to formulate your answer:

Original Question: {{{naturalLanguageQuestion}}}

SQL Query Executed: 
\`\`\`sql
{{{sqlQuery}}}
\`\`\`

Database Schema Metadata (if available):
{{{schemaMetadata}}}

Raw Query Results:
\`\`\`json
{{{queryResults}}}
\`\`\`

Based on the original question and the provided SQL query results, generate a clear and concise natural language answer. Focus on directly answering the question using the data. If the results are empty, state that no records were found. Your response should be solely the natural language answer.`,
});

const synthesizeNaturalLanguageAnswerFromSqlResultsFlow = ai.defineFlow(
  {
    name: 'synthesizeNaturalLanguageAnswerFromSqlResultsFlow',
    inputSchema: SynthesizeNaturalLanguageAnswerFromSqlResultsInputSchema,
    outputSchema: SynthesizeNaturalLanguageAnswerFromSqlResultsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
