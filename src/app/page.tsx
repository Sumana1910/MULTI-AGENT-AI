'use client';

import React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { askQuery, type AskQueryResult } from '@/app/actions';
import { Bot, FileCode2, DatabaseZap, Cpu, TestTube, Lightbulb } from 'lucide-react';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const initialState: AskQueryResult = {
  answer: '',
  sql: '',
  schema: null,
  results: '',
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Cpu className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Lightbulb className="mr-2 h-4 w-4" />
          Ask AI
        </>
      )}
    </Button>
  );
}

export default function Home() {
  const [state, formAction, isPending] = useActionState(askQuery, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);

  const hasResult = state && (state.answer || state.error);

  return (
    <main className="min-h-screen container mx-auto p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
          NLQuery AI
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Ask questions in plain English, get answers from your database.
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <form ref={formRef} action={formAction} className="space-y-4">
              <Textarea
                name="question"
                placeholder="e.g., What are the top 5 projects by budget?"
                className="min-h-[80px] text-base"
                required
              />
              <div className="flex justify-end">
                <SubmitButton />
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 space-y-8">
          {isPending && (
             <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bot className="mr-2 h-6 w-6 text-primary" /> AI is thinking...
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="space-y-2 pt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </CardContent>
              </Card>
          )}

          {!isPending && hasResult && (
            <>
              {state.error && (
                <Alert variant="destructive">
                  <TestTube className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}

              {state.answer && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-primary">
                      <Bot className="mr-2 h-6 w-6" /> Answer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-foreground">{state.answer}</p>
                  </CardContent>
                </Card>
              )}

              {(state.sql || state.schema || state.results) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Intermediate Steps</CardTitle>
                    <CardDescription>
                      How the AI reached its conclusion.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {state.schema && (
                        <AccordionItem value="schema">
                          <AccordionTrigger>
                            <div className="flex items-center">
                              <DatabaseZap className="mr-2 h-5 w-5 text-primary" />
                              Identified Schema
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-sm font-code text-secondary-foreground">
                              <code>{JSON.stringify(state.schema, null, 2)}</code>
                            </pre>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                      {state.sql && (
                        <AccordionItem value="sql">
                          <AccordionTrigger>
                            <div className="flex items-center">
                              <FileCode2 className="mr-2 h-5 w-5 text-primary" />
                              Generated SQL
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-sm font-code text-secondary-foreground">
                              <code>{state.sql}</code>
                            </pre>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                      {state.results && (
                        <AccordionItem value="results">
                          <AccordionTrigger>
                            <div className="flex items-center">
                               <Cpu className="mr-2 h-5 w-5 text-primary" />
                              Raw Results
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                             <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-sm font-code text-secondary-foreground">
                              <code>{JSON.stringify(JSON.parse(state.results), null, 2)}</code>
                            </pre>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </Accordion>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
