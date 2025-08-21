const superjson = require('superjson');

// Minimal product and price logic copied from helpers/priceCalculations
const TAX_RATE = 0.15;
const SHIPPING_COST = 33;
const ALL_PRODUCTS = [
  { id: 'base-device', name: 'جهاز ملم الأساسي', price: 2999 },
  { id: 'addon-fat-scale', name: 'ميزان الدهون والوزن', price: 65 },
  { id: 'addon-urine-analysis', name: 'تحليل البول (11 عنصرًا + 100 شريط)', price: 540 },
  { id: 'addon-uric-acid-strips', name: 'شرائط فحص حمض اليوريك في الدم (25 قطعة)', price: 151 },
  { id: 'addon-lipid-analyzer', name: 'جهاز تحليل دهون الدم (الكوليسترول/ HDL / LDL / الدهون الثلاثية)', price: 1944 },
  { id: 'addon-lipid-strips', name: 'شرائط فحص دهون الدم (20 قطعة)', price: 151 },
  { id: 'addon-hemoglobin-sensor', name: 'حساس الهيموغلوبين', price: 251 },
  { id: 'addon-hemoglobin-strips', name: 'شرائط فحص الهيموغلوبين', price: 100 },
  { id: 'addon-ir-thermometer', name: 'ميزان حرارة بالأشعة تحت الحمراء', price: 100 },
  { id: 'addon-digital-stethoscope', name: 'سماعة طبية رقمية', price: 1511 },
  { id: 'addon-spirometer', name: 'جهاز قياس التنفس (سبيرومتر)', price: 993 },
];

const calculateSubtotal = (items) => items.reduce((s, it) => s + it.price, 0);
const calculateTax = (subtotal) => subtotal * TAX_RATE;
const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR' }).format(amount);

async function sendEmail({ to, from, replyTo, subject, html }) {
  // Send via SendGrid HTTP API (Netlify blocks SMTP ports)
  const apiKey = process.env.SENDGRID_API_KEY;
  const sendgridFrom = process.env.SENDGRID_FROM_EMAIL || from;
  if (!apiKey) throw new Error('SENDGRID_API_KEY is not set. Please add it to Netlify environment variables.');
  if (!sendgridFrom) throw new Error('FROM email is not set. Please set SENDGRID_FROM_EMAIL or FROM_EMAIL_ADDRESS.');

  const payload = {
    personalizations: [{ to: [{ email: to }], subject }],
    from: { email: sendgridFrom },
    content: [{ type: 'text/html', value: html }]
  };
  if (replyTo) payload.reply_to = { email: replyTo };

  try {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('SendGrid error', res.status, text);
      throw new Error(`SendGrid error ${res.status}: ${text.slice(0, 500)}`);
    }

    console.log('SendGrid accepted message');
    return { messageId: 'sendgrid' };
  } catch (err) {
    console.error('SendGrid send failed:', err && err.message ? err.message : err);
    throw new Error('Failed to send email via SendGrid: ' + (err && err.message ? err.message : 'Unknown error'));
  }
}

function generateOrderEmailHtml(input) {
  const orderedItems = input.itemIds
    .map(id => ALL_PRODUCTS.find(p => p.id === id))
    .filter(Boolean)
    .map(p => ({ ...p, quantity: 1 }));

  if (orderedItems.length !== input.itemIds.length) throw new Error('Some ordered items could not be found.');

  const subtotal = calculateSubtotal(orderedItems);
  const tax = calculateTax(subtotal);
  const shipping = orderedItems.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal + tax + shipping;

  const itemsHtml = orderedItems.map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #ddd;">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #ddd;text-align:right;">${formatCurrency(item.price)}</td>
    </tr>
  `).join('');

  return `
    <html dir="rtl" lang="ar">
      <head><style>body{font-family:Cairo,Helvetica,Arial,sans-serif;color:#333}.container{max-width:600px;margin:20px auto;padding:20px;border:1px solid #eee;border-radius:8px}h1{color:#0B1E3A}table{width:100%;border-collapse:collapse}th{background:#f9f9f9;padding:8px}</style></head>
      <body>
        <div class="container">
          <h1>طلب شراء مسبق جديد</h1>
          <p>تم استلام طلب شراء مسبق جديد من العميل:</p>
          <p><strong>البريد الإلكتروني:</strong> <a href="mailto:${input.customerEmail}">${input.customerEmail}</a></p>
          <h2>تفاصيل الطلب:</h2>
          <table>
            <thead><tr><th style="text-align:right">المنتج</th><th style="text-align:right">السعر</th></tr></thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <hr style="margin:20px 0;border:0;border-top:1px solid #eee;" />
          <h2>ملخص الطلب:</h2>
          <table class="summary-table">
            <tr><td>المجموع الفرعي</td><td style="text-align:right">${formatCurrency(subtotal)}</td></tr>
            <tr><td>الشحن</td><td style="text-align:right">${formatCurrency(shipping)}</td></tr>
            <tr><td>الضريبة (15%)</td><td style="text-align:right">${formatCurrency(tax)}</td></tr>
            <tr><td class="total">الإجمالي النهائي</td><td class="total" style="text-align:right">${formatCurrency(total)}</td></tr>
          </table>
        </div>
      </body>
    </html>`;
}

const fs = require('fs');
const path = require('path');

function saveOrderLocally(payload) {
  try {
    const saveEnabled = process.env.SAVE_ORDERS === 'true' || process.env.NODE_ENV !== 'production';
    if (!saveEnabled) return;
    const dir = path.resolve(__dirname, '..', '..', 'orders');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, 'orders.log');
    const entry = { ts: new Date().toISOString(), payload };
    fs.appendFileSync(file, JSON.stringify(entry) + '\n');
  } catch (e) {
    console.error('Failed to save order locally:', e && e.message ? e.message : e);
  }
}

exports.handler = async function(event, context) {
  try {
    console.log('send-order function invoked');
    console.log('event.body length:', event.body ? event.body.length : 0);

    const json = superjson.parse(event.body || '{}');

    // Basic validation: ensure itemIds and customerEmail exist
    if (!json.itemIds || !Array.isArray(json.itemIds) || !json.customerEmail) {
      console.warn('Invalid input received by send-order function', { body: event.body });
      saveOrderLocally({ type: 'invalid', body: json });
      return { statusCode: 400, body: superjson.stringify({ error: 'Invalid input' }) };
    }

    // Save incoming order (dev fallback)
    saveOrderLocally({ type: 'incoming', body: json });

    const emailHtml = generateOrderEmailHtml(json);
    const recipientEmail = process.env.ORDER_RECIPIENT_EMAIL || 'molim.helper@gmail.com';
    const senderEmail = process.env.FROM_EMAIL_ADDRESS;

    try {
      await sendEmail({ to: recipientEmail, from: senderEmail, replyTo: json.customerEmail, subject: `طلب شراء مسبق جديد من ${json.customerEmail}`, html: emailHtml });
    } catch (sendErr) {
      console.error('Email send failed inside function:', sendErr && sendErr.message ? sendErr.message : sendErr);
      // Save failed email attempt
      saveOrderLocally({ type: 'email-failed', body: json, error: sendErr && sendErr.message ? sendErr.message : String(sendErr) });
      // Return a 502 to indicate upstream gateway issue while keeping JSON body
      return { statusCode: 502, body: superjson.stringify({ error: 'Failed to send email notification', details: sendErr && sendErr.message ? sendErr.message : String(sendErr) }) };
    }

    // On success, persist record too (optional)
    saveOrderLocally({ type: 'sent', body: json });

    return { statusCode: 200, body: superjson.stringify({ success: true, message: 'تم إرسال طلبك بنجاح.' }) };
  } catch (err) {
    console.error('Function error:', err && err.message ? err.message : err);
    // Save full failure for diagnosis
    try { saveOrderLocally({ type: 'exception', error: err && err.message ? err.message : String(err), rawBody: event.body }); } catch (_) {}
    return { statusCode: 500, body: superjson.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }) };
  }
};
