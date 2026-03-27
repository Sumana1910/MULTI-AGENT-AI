'use server';

import { generateSqlAndSchemaFromNaturalLanguage, IdentifiedSchemaOutput } from '@/ai/flows/generate-sql-and-schema-from-natural-language';
import { synthesizeNaturalLanguageAnswerFromSqlResults } from '@/ai/flows/synthesize-natural-language-answer-from-sql-results';
import { getDatabaseSchema } from '@/lib/db/schema';
import { executeQuery } from '@/lib/db/mock-executor';
import { z } from 'zod';

export interface AskQueryResult {
  answer: string;
  sql: string;
  schema: IdentifiedSchemaOutput | null;
  results: string;
  error: string | null;
}

const questionSchema = z.string().min(5, "Please ask a more detailed question.").max(500);

export async function askQuery(
  prevState: AskQueryResult,
  formData: FormData
): Promise<AskQueryResult> {
  const question = formData.get('question');
  
  const validation = questionSchema.safeParse(question);

  if (!validation.success) {
    return { ...prevState, error: validation.error.errors[0].message };
  }
  
  const validatedQuestion = validation.data;

  try {
    const databaseSchema = getDatabaseSchema();
    
    // 1. Schema Agent & SQL Generator Agent
    const { generatedSql, identifiedSchema } = await generateSqlAndSchemaFromNaturalLanguage({
      naturalLanguageQuestion: validatedQuestion,
      databaseSchema,
    });

    if (!generatedSql) {
      throw new Error('SQL Generation Failed: The AI could not generate a valid SQL query for your question.');
    }

    // 2. Retriever Agent (Mock)
    const queryResults = await executeQuery(generatedSql);
    const resultsData = JSON.parse(queryResults);
    
    if (resultsData.length === 0) {
      return {
        answer: "I couldn't find any data matching your question.",
        sql: generatedSql,
        schema: identifiedSchema,
        results: queryResults,
        error: null,
      };
    }

    // 3. Synthesizer Agent
    const { naturalLanguageAnswer } = await synthesizeNaturalLanguageAnswerFromSqlResults({
      naturalLanguageQuestion: validatedQuestion,
      sqlQuery: generatedSql,
      queryResults,
    });

    return {
      answer: naturalLanguageAnswer,
      sql: generatedSql,
      schema: identifiedSchema,
      results: queryResults,
      error: null,
    };

  } catch (e: any) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { ...prevState, error: errorMessage };
  }
}
