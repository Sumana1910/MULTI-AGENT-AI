import { customers, employees, projects, sales } from './data';

// A more advanced (but still simplified) mock query executor.
// It uses regex to parse different parts of the SQL query.
export async function executeQuery(sql: string): Promise<string> {
  try {
    const normalizedSql = sql.replace(/\s+/g, ' ').trim();

    // Extracts SELECT columns, FROM table, and optional JOIN, WHERE, ORDER BY clauses
    const fromMatch = /from\s+(\w+)/i.exec(normalizedSql);
    const selectMatch = /select\s+(.*?)\s+from/i.exec(normalizedSql);
    const whereMatch = /where\s+(.*)/i.exec(normalizedSql.split(' order by ')[0]);
    const orderByMatch = /order by\s+(.*?)(?:\s+(asc|desc))?/i.exec(normalizedSql);
    const limitMatch = /limit\s+(\d+)/i.exec(normalizedSql);
    const joinMatch = /join\s+(\w+)\s+\w+\s+on\s+/i.exec(normalizedSql);

    if (!fromMatch || !selectMatch) {
      throw new Error('Could not parse SELECT and FROM clauses.');
    }
    
    const fromTable = fromMatch[1].toLowerCase();
    const columns = selectMatch[1];
    
    let data: any[] = [];
    
    // --- 1. Data Retrieval (FROM & JOIN) ---
    switch (fromTable) {
      case 'sales': data = [...sales]; break;
      case 'projects': data = [...projects]; break;
      case 'customers': data = [...customers]; break;
      case 'employees': data = [...employees]; break;
      default: data = [];
    }

    // Handle a specific JOIN for demonstration
    if (normalizedSql.includes('from projects p join employees e')) {
        data = projects.map(project => {
            const lead = employees.find(e => e.id === project.lead_employee_id);
            return {
                ...project,
                lead_first_name: lead?.first_name,
                lead_last_name: lead?.last_name,
            }
        });
    } else if (normalizedSql.includes('from sales s join customers c')) {
        data = sales.map(sale => {
            const customer = customers.find(c => c.id === sale.customer_id);
            return {
                ...sale,
                customer_company_name: customer?.company_name,
                customer_contact_name: customer?.contact_name,
            }
        });
    }

    // --- 2. Filtering (WHERE) ---
    if (whereMatch) {
        const whereClause = whereMatch[1].trim();
        const conditionMatch = /(\w+)\s*=\s*(?:'([^']*)'|(\d+(?:\.\d+)?))/i.exec(whereClause);
        
        if (conditionMatch) {
            const [, field, stringValue, numericValue] = conditionMatch;
            const value = stringValue !== undefined ? stringValue : parseFloat(numericValue);
            data = data.filter(row => row[field] == value);
        }
    }

    // --- 3. Aggregation (SELECT columns) ---
    if (columns.toLowerCase().includes('count(*)')) {
        return JSON.stringify([{ count: data.length }]);
    }
    if (columns.toLowerCase().includes('sum(amount)')) {
        const total = data.reduce((acc, row) => acc + (row.amount || 0), 0);
        return JSON.stringify([{ sum: total }]);
    }
    if (columns.toLowerCase().includes('sum(budget)')) {
        const total = data.reduce((acc, row) => acc + (row.budget || 0), 0);
        return JSON.stringify([{ sum: total }]);
    }
    if (columns.toLowerCase().includes('avg(amount)')) {
        if (data.length === 0) return JSON.stringify([{ avg: 0 }]);
        const total = data.reduce((acc, row) => acc + (row.amount || 0), 0);
        return JSON.stringify([{ avg: total / data.length }]);
    }
    if (columns.toLowerCase().includes('avg(budget)')) {
        if (data.length === 0) return JSON.stringify([{ avg: 0 }]);
        const total = data.reduce((acc, row) => acc + (row.budget || 0), 0);
        return JSON.stringify([{ avg: total / data.length }]);
    }

    // --- 4. Sorting (ORDER BY) ---
    if (orderByMatch) {
        const [, field, direction] = orderByMatch;
        const sortField = field.trim();
        const sortDirection = direction?.toLowerCase() === 'desc' ? -1 : 1;
        
        data.sort((a, b) => {
            if (a[sortField] < b[sortField]) return -1 * sortDirection;
            if (a[sortField] > b[sortField]) return 1 * sortDirection;
            return 0;
        });
    }
    
    // --- 5. Limiting (LIMIT) ---
    if (limitMatch) {
        const limit = parseInt(limitMatch[1], 10);
        data = data.slice(0, limit);
    }
    
    // Fallback if no specific aggregation was matched
    return JSON.stringify(data);

  } catch (error: any) {
    console.error('Mock Executor Error:', error);
    // Return a structured error to be consistent
    return JSON.stringify({ error: `Failed to execute mock query. Details: ${error.message}` });
  }
}
