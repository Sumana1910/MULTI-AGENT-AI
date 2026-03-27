import { config } from 'dotenv';
config();

import '@/ai/flows/synthesize-natural-language-answer-from-sql-results.ts';
import '@/ai/flows/generate-sql-and-schema-from-natural-language.ts';