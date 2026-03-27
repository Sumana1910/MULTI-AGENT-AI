# **App Name**: NLQuery AI

## Core Features:

- Natural Language Query Input: A user-friendly web interface for entering natural language questions to query the database.
- AI Schema Analysis Agent: An AI agent that acts as a tool to identify relevant PostgreSQL tables and fields from the database schema based on the natural language query.
- AI SQL Generator Agent: An AI agent that acts as a tool to construct valid and optimized PostgreSQL SQL queries from the natural language question and identified schema components.
- Database Retriever & Executor: Component to connect to the PostgreSQL database, execute the generated SQL query, and retrieve the result rows.
- AI Natural Language Synthesizer Agent: An AI agent that acts as a tool to synthesize a concise, human-readable natural language answer from the SQL query results.
- API Endpoint and Intermediate Steps Display: A functional POST /ask API endpoint returning a JSON response. The web interface displays the natural language answer alongside intermediate steps including relevant schema, generated SQL query, and raw result rows.
- Error Handling & Feedback: System to gracefully handle and display helpful error messages for issues like schema/table not found, SQL generation failures, or no matching records.

## Style Guidelines:

- A light color scheme to convey clarity and precision in data presentation. The primary color is a medium-dark blue (#2953A3), chosen for its association with intelligence and technology, providing a strong contrast against lighter backgrounds.
- The background color is a very light, desaturated blue-grey (#F2F4F7), visibly related to the primary color but designed for comfortable readability in a light theme.
- An accent color of bright cyan (#1AD8F3) is used for call-to-action elements and interactive components, ensuring high visibility and a modern feel while maintaining an analogous relationship to the primary hue.
- The primary typeface for both headlines and body text is 'Inter' (sans-serif), selected for its modern, objective, and highly readable characteristics, suitable for conveying technical and natural language information. SQL query snippets will be rendered using 'Source Code Pro' (monospace) for optimal code display.
- Abstract, geometric icons will be used to represent the different AI agents and data flow processes within the multi-agent system, emphasizing a structured and intelligent design.
- A clean, structured layout utilizing distinct sections for natural language input, the generated natural language answer, and intermediate steps (schema, SQL, results). A potential two-column layout can enhance separation and clarity of information.
- Subtle, non-distracting animations will provide visual feedback during processing states, such as a discrete loading indicator when the AI agents are generating queries or synthesizing answers.