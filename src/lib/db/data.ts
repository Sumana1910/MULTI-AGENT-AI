import type { Customer, Employee, Project, Sale } from './schema';

export const employees: Employee[] = [
  { id: 1, first_name: 'Alice', last_name: 'Johnson', email: 'alice.j@example.com', job_title: 'Project Manager', hire_date: '2021-05-15T00:00:00Z' },
  { id: 2, first_name: 'Bob', last_name: 'Smith', email: 'bob.s@example.com', job_title: 'Lead Developer', hire_date: '2020-03-10T00:00:00Z' },
  { id: 3, first_name: 'Charlie', last_name: 'Brown', email: 'charlie.b@example.com', job_title: 'UX Designer', hire_date: '2022-01-20T00:00:00Z' },
  { id: 4, first_name: 'Diana', last_name: 'Prince', email: 'diana.p@example.com', job_title: 'Data Analyst', hire_date: '2021-09-01T00:00:00Z' },
  { id: 5, first_name: 'Ethan', last_name: 'Hunt', email: 'ethan.h@example.com', job_title: 'Software Engineer', hire_date: '2023-02-18T00:00:00Z' },
  { id: 6, first_name: 'Fiona', last_name: 'Glenanne', email: 'fiona.g@example.com', job_title: 'Software Engineer', hire_date: '2023-03-12T00:00:00Z' },
  { id: 7, first_name: 'George', last_name: 'Costanza', email: 'george.c@example.com', job_title: 'QA Tester', hire_date: '2022-08-25T00:00:00Z' },
  { id: 8, first_name: 'Hannah', last_name: 'Montana', email: 'hannah.m@example.com', job_title: 'Data Analyst', hire_date: '2022-11-30T00:00:00Z' },
];

export const customers: Customer[] = [
  { id: 101, company_name: 'Innovate Corp', contact_name: 'Eve Williams', contact_email: 'eve@innovate.com', industry: 'Technology', signup_date: '2022-06-30T00:00:00Z' },
  { id: 102, company_name: 'Solutions Inc.', contact_name: 'Frank Miller', contact_email: 'frank@solutions.com', industry: 'Finance', signup_date: '2021-11-12T00:00:00Z' },
  { id: 103, company_name: 'HealthFirst', contact_name: 'Grace Lee', contact_email: 'grace@healthfirst.com', industry: 'Healthcare', signup_date: '2023-02-28T00:00:00Z' },
  { id: 104, company_name: 'QuantumLeap', contact_name: 'Harry Potter', contact_email: 'harry@quantum.com', industry: 'Technology', signup_date: '2020-01-15T00:00:00Z' },
  { id: 105, company_name: 'DataDriven Co.', contact_name: 'Ivy Green', contact_email: 'ivy@datadriven.com', industry: 'Finance', signup_date: '2022-09-10T00:00:00Z' },
];

export const projects: Project[] = [
  { id: 201, project_name: 'Phoenix Platform', start_date: '2022-07-15T00:00:00Z', end_date: '2023-06-30T00:00:00Z', budget: 250000, lead_employee_id: 1 },
  { id: 202, project_name: 'Orion Analytics', start_date: '2021-12-01T00:00:00Z', end_date: null, budget: 500000, lead_employee_id: 2 },
  { id: 203, project_name: 'Wellness App', start_date: '2023-03-01T00:00:00Z', end_date: null, budget: 150000, lead_employee_id: 1 },
  { id: 204, project_name: 'Titan OS', start_date: '2020-01-01T00:00:00Z', end_date: '2022-12-31T00:00:00Z', budget: 1200000, lead_employee_id: 2 },
  { id: 205, project_name: 'Galaxy CRM', start_date: '2023-04-01T00:00:00Z', end_date: null, budget: 350000, lead_employee_id: 5 },
  { id: 206, project_name: 'Nebula Dashboard', start_date: '2022-10-01T00:00:00Z', end_date: '2023-08-31T00:00:00Z', budget: 180000, lead_employee_id: 6 },
  { id: 207, project_name: 'Comet Messenger', start_date: '2023-01-20T00:00:00Z', end_date: null, budget: 95000, lead_employee_id: 5 },
  { id: 208, project_name: 'Stardust Search', start_date: '2021-08-15T00:00:00Z', end_date: '2023-05-20T00:00:00Z', budget: 750000, lead_employee_id: 2 },
];

export const sales: Sale[] = [
  { id: 301, customer_id: 101, project_id: 201, sale_date: '2022-07-01T00:00:00Z', amount: 250000 },
  { id: 302, customer_id: 102, project_id: 202, sale_date: '2021-11-20T00:00:00Z', amount: 480000 },
  { id: 303, customer_id: 103, project_id: 203, sale_date: '2023-03-05T00:00:00Z', amount: 150000 },
  { id: 304, customer_id: 101, project_id: 202, sale_date: '2023-01-10T00:00:00Z', amount: 20000 },
  { id: 305, customer_id: 102, project_id: 204, sale_date: '2021-02-15T00:00:00Z', amount: 1000000 },
  { id: 306, customer_id: 104, project_id: 205, sale_date: '2023-04-02T00:00:00Z', amount: 350000 },
  { id: 307, customer_id: 105, project_id: 206, sale_date: '2022-10-05T00:00:00Z', amount: 180000 },
  { id: 308, customer_id: 101, project_id: 207, sale_date: '2023-01-22T00:00:00Z', amount: 95000 },
  { id: 309, customer_id: 102, project_id: 208, sale_date: '2021-08-20T00:00:00Z', amount: 750000 },
  { id: 310, customer_id: 103, project_id: 201, sale_date: '2023-07-15T00:00:00Z', amount: 25000 },
  { id: 311, customer_id: 104, project_id: 202, sale_date: '2022-05-18T00:00:00Z', amount: 15000 },
  { id: 312, customer_id: 105, project_id: 204, sale_date: '2022-01-20T00:00:00Z', amount: 200000 },
];
