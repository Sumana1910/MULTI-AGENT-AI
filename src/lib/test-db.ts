import { runQuery } from './db';

async function test() {
  const result = await runQuery('SELECT * FROM customers;');
  console.log(result);
}

test();