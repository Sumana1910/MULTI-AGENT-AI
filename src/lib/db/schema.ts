export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  job_title: string;
  hire_date: string; // ISO 8601 date string
}

export interface Customer {
  id: number;
  company_name: string;
  contact_name: string;
  contact_email: string;
  industry: string;
  signup_date: string; // ISO 8601 date string
}

export interface Project {
  id: number;
  project_name: string;
  start_date: string; // ISO 8601 date string
  end_date: string | null; // ISO 8601 date string or null if ongoing
  budget: number;
  lead_employee_id: number; // Foreign key to Employee
}

export interface Sale {
  id: number;
  customer_id: number; // Foreign key to Customer
  project_id: number; // Foreign key to Project
  sale_date: string; // ISO 8601 date string
  amount: number;
}

// This structure must match the Zod schema in the Genkit flow
export const getDatabaseSchema = () => [
  {
    tableName: 'Employees',
    columns: [
      { columnName: 'id', columnType: 'INT', isPrimaryKey: true },
      { columnName: 'first_name', columnType: 'TEXT' },
      { columnName: 'last_name', columnType: 'TEXT' },
      { columnName: 'email', columnType: 'TEXT' },
      { columnName: 'job_title', columnType: 'TEXT' },
      { columnName: 'hire_date', columnType: 'TIMESTAMP' },
    ],
  },
  {
    tableName: 'Customers',
    columns: [
      { columnName: 'id', columnType: 'INT', isPrimaryKey: true },
      { columnName: 'company_name', columnType: 'TEXT' },
      { columnName: 'contact_name', columnType: 'TEXT' },
      { columnName: 'contact_email', columnType: 'TEXT' },
      { columnName: 'industry', columnType: 'TEXT' },
      { columnName: 'signup_date', columnType: 'TIMESTAMP' },
    ],
  },
  {
    tableName: 'Projects',
    columns: [
      { columnName: 'id', columnType: 'INT', isPrimaryKey: true },
      { columnName: 'project_name', columnType: 'TEXT' },
      { columnName: 'start_date', columnType: 'TIMESTAMP' },
      { columnName: 'end_date', columnType: 'TIMESTAMP' },
      { columnName: 'budget', columnType: 'DECIMAL' },
      {
        columnName: 'lead_employee_id',
        columnType: 'INT',
        isForeignKey: true,
        referencesTable: 'Employees',
        referencesColumn: 'id',
      },
    ],
  },
  {
    tableName: 'Sales',
    columns: [
      { columnName: 'id', columnType: 'INT', isPrimaryKey: true },
      {
        columnName: 'customer_id',
        columnType: 'INT',
        isForeignKey: true,
        referencesTable: 'Customers',
        referencesColumn: 'id',
      },
      {
        columnName: 'project_id',
        columnType: 'INT',
        isForeignKey: true,
        referencesTable: 'Projects',
        referencesColumn: 'id',
      },
      { columnName: 'sale_date', columnType: 'TIMESTAMP' },
      { columnName: 'amount', columnType: 'DECIMAL' },
    ],
  },
];
