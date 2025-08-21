import { schema, InputType, OutputType } from "./send-order_POST.schema";
import superjson from 'superjson';
import { ALL_PRODUCTS, calculateSubtotal, calculateTax, SHIPPING_COST, formatCurrency } from "../helpers/priceCalculations";
import * as nodemailer from 'nodemailer';

// SMTP email sending function using environment variables
async function sendEmail({ to, from, replyTo, subject, html }: { 
  to: string; 
  from: string; 
  replyTo?: string;
  subject: string; 
  html: string; 
}) {
  // Validate required environment variables
  const requiredEnvVars = [
    'SMTP_HOST',
    'SMTP_PORT', 
    'SMTP_USERNAME',
    'SMTP_PASSWORD',
    'FROM_EMAIL_ADDRESS'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName as keyof typeof process.env]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Create transporter using SMTP configuration
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Send email
  const mailOptions = {
    from: from,
    to: to,
    replyTo: replyTo,
    subject: subject,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email notification');
  }
}

function generateOrderEmailHtml(input: InputType): string {
  // Server-side validation: Find products based on IDs from the input
  const orderedItems = input.itemIds
    .map(id => ALL_PRODUCTS.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
    .map(p => ({ ...p, quantity: 1 as const }));

  if (orderedItems.length !== input.itemIds.length) {
    // This indicates a mismatch between client-sent IDs and available products,
    // which could be a sign of tampering or stale data.
    throw new Error("Some ordered items could not be found.");
  }

  // Recalculate totals on the server to ensure data integrity
  const subtotal = calculateSubtotal(orderedItems);
  const tax = calculateTax(subtotal);
  const shipping = orderedItems.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal + tax + shipping;

  const itemsHtml = orderedItems
    .map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatCurrency(item.price)}</td>
      </tr>
    `)
    .join('');

  return `
    <html dir="rtl" lang="ar">
      <head>
        <style>
          body { font-family: 'Cairo', 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
          h1 { color: #0B1E3A; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: right; background-color: #f9f9f9; padding: 8px; }
          .summary-table td { padding: 8px; }
          .total { font-weight: bold; color: #1D4ED8; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>طلب شراء مسبق جديد</h1>
          <p>تم استلام طلب شراء مسبق جديد من العميل:</p>
          <p><strong>البريد الإلكتروني:</strong> <a href="mailto:${input.customerEmail}">${input.customerEmail}</a></p>
          
          <h2>تفاصيل الطلب:</h2>
          <table>
            <thead>
              <tr>
                <th style="text-align: right;">المنتج</th>
                <th style="text-align: right;">السعر</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />

          <h2>ملخص الطلب:</h2>
          <table class="summary-table">
            <tr>
              <td>المجموع الفرعي</td>
              <td style="text-align: right;">${formatCurrency(subtotal)}</td>
            </tr>
            <tr>
              <td>الشحن</td>
              <td style="text-align: right;">${formatCurrency(shipping)}</td>
            </tr>
            <tr>
              <td>الضريبة (15%)</td>
              <td style="text-align: right;">${formatCurrency(tax)}</td>
            </tr>
            <tr>
              <td class="total">الإجمالي النهائي</td>
              <td class="total" style="text-align: right;">${formatCurrency(total)}</td>
            </tr>
          </table>
        </div>
      </body>
    </html>
  `;
}

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const validatedInput = schema.parse(json);

    const emailHtml = generateOrderEmailHtml(validatedInput);
    const recipientEmail = "molim.helper@gmail.com";
    const senderEmail = process.env.FROM_EMAIL_ADDRESS!;

    await sendEmail({
      to: recipientEmail,
      from: senderEmail,
      replyTo: validatedInput.customerEmail,
      subject: `طلب شراء مسبق جديد من ${validatedInput.customerEmail}`,
      html: emailHtml,
    });

    const output: OutputType = { success: true, message: "تم إرسال طلبك بنجاح." };
    return new Response(superjson.stringify(output), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Failed to process order:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return new Response(superjson.stringify({ error: errorMessage }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}