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
  const result = await fetch(`/_api/send-order`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  
  const responseText = await result.text();
  const responseObject = superjson.parse(responseText);

  if (!result.ok) {
    const errorMessage = (responseObject as { error?: string })?.error || "An unknown error occurred";
    throw new Error(errorMessage);
  }
  
  return responseObject as OutputType;
};