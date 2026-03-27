'use server';

/**
 * @fileOverview This file defines a Genkit flow for converting a natural language question into a SQL query.
 *
 * - generateSqlAndSchemaFromNaturalLanguage - A function that handles the process of identifying relevant schema and generating SQL.
 * - GenerateSqlAndSchemaFromNaturalLanguageInput - The input type for the function.
 * - GenerateSqlAndSchemaFromNaturalLanguageOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the structure of the database schema for input
const ColumnSchema = z.object({
  columnName: z.string().describe('The name of the database column.'),
  columnType: z.string().describe('The data type of the column (e.g., INT, TEXT, TIMESTAMP).'),
  isPrimaryKey: z.boolean().optional().describe('True if this column is a primary key.'),
  isForeignKey: z.boolean().optional().describe('True if this column is a foreign key.'),
  referencesTable: z.string().optional().describe('The table this foreign key references.'),
  referencesColumn: z.string().optional().describe('The column this foreign key references.'),
});

const TableSchema = z.object({
  tableName: z.string().describe('The name of the database table.'),
  columns: z.array(ColumnSchema).describe('An array of column definitions for the table.'),
});

const DatabaseSchema = z.array(TableSchema).describe('The full database schema, as an array of table definitions.');

// Input schema for the main flow
const GenerateSqlAndSchemaFromNaturalLanguageInputSchema = z.object({
  naturalLanguageQuestion: z.string().describe('The natural language question to be converted to SQL.'),
  databaseSchema: DatabaseSchema,
});
export type GenerateSqlAndSchemaFromNaturalLanguageInput = z.infer<typeof GenerateSqlAndSchemaFromNaturalLanguageInputSchema>;

// Output schema for the schema identification step (intermediate)
const IdentifiedSchemaOutputSchema = z.object({
  relevantTables: z.array(
    z.object({
      tableName: z.string(),
      columns: z.array(z.string()), // Just column names deemed relevant
    })
  ).describe('A list of tables and their relevant columns identified from the schema based on the natural language question.'),
});
export type IdentifiedSchemaOutput = z.infer<typeof IdentifiedSchemaOutputSchema>;

// Output schema for the main flow
const GenerateSqlAndSchemaFromNaturalLanguageOutputSchema = z.object({
  identifiedSchema: IdentifiedSchemaOutputSchema.describe('The tables and columns identified as relevant to the query.'),
  generatedSql: z.string().describe('The generated SQL query.'),
});
export type GenerateSqlAndSchemaFromNaturalLanguageOutput = z.infer<typeof GenerateSqlAndSchemaFromNaturalLanguageOutputSchema>;

// Helper function to format the database schema into a readable string for the prompt
function formatSchemaForPrompt(schema: z.infer<typeof DatabaseSchema>): string {
  let formatted = '';
  schema.forEach(table => {
    formatted += `Table: ${table.tableName}\n`;
    table.columns.forEach(column => {
      formatted += `- ${column.columnName} (${column.columnType})`;
      if (column.isPrimaryKey) formatted += ' PRIMARY KEY';
      if (column.isForeignKey && column.referencesTable) formatted += ` FOREIGN KEY references ${table.referencesTable}(${column.referencesColumn})`;
      formatted += '\n';
    });
    formatted += '\n';
  });
  return formatted;
}

// --- AI Agent: Schema Agent ---
// Identifies relevant tables and fields from the database schema based on the natural language query.
const identifySchemaPrompt = ai.definePrompt({
  name: 'identifySchemaPrompt',
  input: { schema: GenerateSqlAndSchemaFromNaturalLanguageInputSchema.extend({ formattedDatabaseSchema: z.string() }) },
  output: { schema: IdentifiedSchemaOutputSchema },
  prompt: `You are an expert database schema analyst. Your task is to identify the most relevant tables and their columns from a given PostgreSQL database schema based on a natural language question. Focus only on what is necessary to answer the question. The user's question may use synonyms or colloquial terms for table and column names (e.g., 'products' for 'Projects', 'people' for 'Employees'). Use your judgment to map these to the correct schema entities.

Database Schema:
{{{formattedDatabaseSchema}}}

Natural Language Question: {{{naturalLanguageQuestion}}}

Identify the relevant tables and their columns in JSON format. For each table, list only the columns that are explicitly or implicitly mentioned in the question or are crucial for understanding the data in the context of the question. Do not include irrelevant tables or columns. Ensure the output strictly adheres to the JSON schema for IdentifiedSchemaOutput.`
});

// --- AI Agent: SQL Generator Agent ---
// Constructs a valid PostgreSQL SQL query from the natural language question and identified schema components.
const generateSqlPrompt = ai.definePrompt({
  name: 'generateSqlPrompt',
  input: { schema: GenerateSqlAndSchemaFromNaturalLanguageInputSchema.extend({ identifiedSchema: IdentifiedSchemaOutputSchema, formattedDatabaseSchema: z.string() }) },
  output: { schema: z.object({ generatedSql: z.string().describe('The generated PostgreSQL SQL query.') }) }, // Output is now an object
  prompt: `You are an expert PostgreSQL database query generator. Your task is to write a correct, efficient, and valid PostgreSQL SQL query based on the user's natural language question and the provided relevant database schema.

Database Schema (relevant parts based on the question):
{{#each identifiedSchema.relevantTables}}
Table: {{this.tableName}}
Columns: {{#each this.columns}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

{{/each}}

Full Database Schema (for context and potential joins, types):
{{{formattedDatabaseSchema}}}

Natural Language Question: {{{naturalLanguageQuestion}}}

Rely on the "Full Database Schema" for generating the query, especially for joins, data types, and complex conditions. Ensure the query uses appropriate aggregate functions (SUM, AVG, COUNT), filtering (WHERE clauses), and joins where necessary. When the question includes a time frame (e.g., "last month", "in 2022"), use the date columns and appropriate SQL functions to filter by date.
Return the result as a JSON object with the key "generatedSql". Do not include any explanation or extra text.`
});

export async function generateSqlAndSchemaFromNaturalLanguage(input: GenerateSqlAndSchemaFromNaturalLanguageInput): Promise<GenerateSqlAndSchemaFromNaturalLanguageOutput> {
  return generateSqlAndSchemaFromNaturalLanguageFlow(input);
}

const generateSqlAndSchemaFromNaturalLanguageFlow = ai.defineFlow(
  {
    name: 'generateSqlAndSchemaFromNaturalLanguageFlow',
    inputSchema: GenerateSqlAndSchemaFromNaturalLanguageInputSchema,
    outputSchema: GenerateSqlAndSchemaFromNaturalLanguageOutputSchema,
  },
  async (input) => {
    const formattedSchema = formatSchemaForPrompt(input.databaseSchema);
    
    // Step 1: Identify relevant schema components
    const { output: identifiedSchemaRaw } = await identifySchemaPrompt({
      naturalLanguageQuestion: input.naturalLanguageQuestion,
      databaseSchema: input.databaseSchema,
      formattedDatabaseSchema: formattedSchema,
    });
    const identifiedSchema: IdentifiedSchemaOutput = identifiedSchemaRaw!;

    // Step 2: Generate SQL query using the identified schema and full schema for context
    const { output: generatedSqlResponse } = await generateSqlPrompt({
      naturalLanguageQuestion: input.naturalLanguageQuestion,
      databaseSchema: input.databaseSchema, // Pass original schema object for context
      identifiedSchema: identifiedSchema,
      formattedDatabaseSchema: formattedSchema,
    });

    return {
      identifiedSchema: identifiedSchema,
      generatedSql: generatedSqlResponse!.generatedSql,
    };
  }
);
