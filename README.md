# NLQuery AI: Multi-Agent RAG System

This project is a multi-agent Retrieval-Augmented Generation (RAG) system that interprets natural language queries, performs structured retrieval from a simulated PostgreSQL database, and synthesizes human-readable answers.

## System Architecture

The system follows a modular, multi-agent workflow orchestrated by a Next.js Server Action. When a user submits a natural language question, the following process is initiated:

1.  **UI Interaction**: The user enters a question into the web interface.
2.  **Server Action Trigger**: A server action is called, which manages the entire end-to-end workflow on the server.
3.  **Schema Agent**: The system first passes the user's question and a predefined database schema to the **Schema Agent**. This agent's role is to identify the most relevant tables and columns needed to answer the query.
4.  **SQL Generator Agent**: The output from the Schema Agent, along with the original question and full schema context, is fed into the **SQL Generator Agent**. This agent constructs a valid PostgreSQL query.
5.  **Retriever Agent (Simulated)**: The generated SQL query is passed to the **Retriever Agent**. In this implementation, this agent is a mock executor that simulates running the query against a static, in-memory dataset, returning the results as a JSON string.
6.  **Synthesizer Agent**: The raw query results, the original question, and the generated SQL are given to the **Synthesizer Agent**. This agent's purpose is to interpret the data and formulate a concise, human-readable answer.
7.  **Response and UI Update**: The server action returns a complete payload to the client, including the final natural language answer, and all intermediate steps (identified schema, generated SQL, and raw results). The UI then updates to display this information in a structured format.

## Agent Descriptions

-   **Schema Agent**: Analyzes the natural language query against the full database schema to determine which tables and fields are relevant. This helps to reduce the context for the next agent, improving efficiency and accuracy.
-   **SQL Generator Agent**: An expert in PostgreSQL, this agent takes the user's question and the relevant schema context to write a valid and optimized SQL query. It's capable of handling joins, aggregations, filtering, and other complex SQL operations.
-   **Retriever Agent**: Connects to the database, executes the SQL query, and fetches the resulting rows. This project uses a simulated version that works with mock data.
-   **Synthesizer Agent**: Transforms the structured, raw data from the Retriever Agent into a fluid, natural language response that directly answers the user's original question.

## Setup & Running the Project

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

## API Flow Example

The application uses a Next.js Server Action, which acts as the primary API endpoint.

**Request**: The user submits a form with a natural language question (e.g., `"What is the total sales amount?"`).

**Process**:

1.  The `askQuery` server action receives the question.
2.  It invokes the `generateSqlAndSchemaFromNaturalLanguage` AI flow, which internally uses the **Schema Agent** and **SQL Generator Agent**.
    -   *Output*: `{ identifiedSchema: {...}, generatedSql: "SELECT SUM(amount) FROM Sales;" }`
3.  It invokes the simulated **Retriever Agent**.
    -   *Output*: `'[{"total_sales": 550000}]'`
4.  It invokes the `synthesizeNaturalLanguageAnswerFromSqlResults` AI flow (the **Synthesizer Agent**).
    -   *Output*: `{ naturalLanguageAnswer: "The total sales amount is $550,000." }`

**Response to Client**: The action returns a structured object that the UI uses to render the results.

```json
{
  "answer": "The total sales amount is $550,000.",
  "sql": "SELECT SUM(amount) FROM Sales;",
  "schema": {
    "relevantTables": [
      {
        "tableName": "Sales",
        "columns": ["amount"]
      }
    ]
  },
  "results": "[{\"total_sales\": 550000}]",
  "error": null
}
```
