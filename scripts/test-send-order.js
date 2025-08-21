// Local test runner for the Netlify send-order function
// Usage: node scripts/test-send-order.js

const fs = require('fs');
const path = require('path');

// Load env.json into process.env
const envPath = path.resolve(__dirname, '..', 'env.json');
if (fs.existsSync(envPath)) {
  const env = JSON.parse(fs.readFileSync(envPath, 'utf8'));
  Object.assign(process.env, env);
  console.log('Loaded env.json into process.env');
} else {
  console.warn('env.json not found; make sure env vars are set in the environment');
}

async function run() {
  try {
    const superjson = require('superjson');
    const func = require(path.resolve(__dirname, '..', 'netlify', 'functions', 'send-order.js'));

    const body = superjson.stringify({
      customerEmail: process.env.SMTP_USERNAME || 'test@example.com',
      itemIds: ['base-device']
    });

    const event = { body };
    const result = await func.handler(event, {});

    console.log('Function result statusCode:', result.statusCode);
    console.log('Function result body:', result.body);
  } catch (err) {
    console.error('Test runner error:', err && err.stack ? err.stack : err);
  }
}

run();
