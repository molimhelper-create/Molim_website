import "./loadEnv.js";
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { serve } from '@hono/node-server';

const app = new Hono();

app.post('/_api/send-order', async c => {
  try {
    const { handle } = await import("./endpoints/send-order_POST.js");
    const request = c.req.raw;
    const response = await handle(request);

    // Ensure we always return a proper Response object. If endpoint returned
    // something else, convert to JSON so client doesn't get HTML/plain text.
    if (!(response instanceof Response) && response?.constructor?.name !== "Response") {
      console.error('Endpoint returned non-Response value:', response);
      return c.json({ error: 'Invalid response format from endpoint.' }, 500);
    }

    return response;
  } catch (e) {
    console.error('Error handling /_api/send-order:', e);
    const message = e instanceof Error ? e.message : String(e);
    return c.json({ error: 'Error processing request', details: message }, 500);
  }
});
app.use('/*', serveStatic({ root: './dist' }))
app.get("*", async (c, next) => {
  const p = c.req.path;
  if (p.startsWith("/_api")) {
    return next();
  }
  return serveStatic({ path: "./dist/index.html" })(c, next);
});
serve({ fetch: app.fetch, port: 3344 });
console.log("Running at http://localhost:3344")
      