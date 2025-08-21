import { z } from "zod";
import superjson from 'superjson';

export const schema = z.object({
  customerEmail: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صحيح." }),
  itemIds: z.array(z.string()).min(1, { message: "عربة التسوق فارغة." }),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  success: boolean;
  message: string;
};

export const postSendOrder = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const makeRequest = async (url: string) => {
    return await fetch(url, {
      method: "POST",
      body: superjson.stringify(validatedInput),
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  };

  // Try the proxied API first (Netlify redirect: /_api/* -> /.netlify/functions/*)
  let result = await makeRequest('/_api/send-order');
  let responseText = await result.text();
  let responseObject: any;
  // Detect if server returned an HTML page (often indicates the dev server
  // served index.html or an HTML error page). If so, retry the direct
  // Netlify function endpoint which bypasses redirects.
  if (responseText && responseText.trim().startsWith('<')) {
    // Retry using the direct function path
    try {
      result = await makeRequest('/.netlify/functions/send-order');
      responseText = await result.text();
    } catch (retryErr) {
      const snippet = responseText.slice(0, 500);
      throw new Error(`Server returned HTML and retry failed. Initial response snippet: ${snippet}`);
    }
  }

  try {
    // Try parsing as plain JSON first, then fall back to superjson.
    try {
      responseObject = JSON.parse(responseText);
    } catch (e) {
      responseObject = superjson.parse(responseText);
    }
  } catch (err) {
    const snippet = responseText ? responseText.slice(0, 500) : '';
    throw new Error(`Invalid JSON response from server (status ${result.status}). Response starts with: ${snippet}`);
  }

  if (!result.ok) {
    const errorMessage = (responseObject as { error?: string })?.error || `HTTP ${result.status}: ${result.statusText}`;
    throw new Error(errorMessage);
  }

  return responseObject as OutputType;
};