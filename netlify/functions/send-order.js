const superjson = require('superjson');
const nodemailer = require('nodemailer');

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
  const requiredEnvVars = ['SMTP_HOST','SMTP_PORT','SMTP_USERNAME','SMTP_PASSWORD','FROM_EMAIL_ADDRESS'];
  const missing = requiredEnvVars.filter(k => !process.env[k]);
  if (missing.length) throw new Error('Missing required environment variables: ' + missing.join(', ') + '. Please set them in Netlify site settings or env.json for local dev.');

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    // Support SMTP_SECURE values: 'true'/'false' or 'TLS'/'STARTTLS'.
    // For Gmail with port 587 use TLS/STARTTLS (secure=false, requireTLS=true).
    secure: (process.env.SMTP_SECURE === 'true'),
    requireTLS: (function() {
      const s = (process.env.SMTP_SECURE || '').toLowerCase();
      return s === 'tls' || s === 'starttls';
    })(),
    auth: { user: process.env.SMTP_USERNAME, pass: process.env.SMTP_PASSWORD }
  });

  if (!from) throw new Error('FROM_EMAIL_ADDRESS is not set.');
  const mailOptions = { from, to, replyTo, subject, html };
  const info = await transporter.sendMail(mailOptions);
  return info;
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

exports.handler = async function(event, context) {
  try {
    const json = superjson.parse(event.body || '{}');

    // Basic validation: ensure itemIds and customerEmail exist
    if (!json.itemIds || !Array.isArray(json.itemIds) || !json.customerEmail) {
      return { statusCode: 400, body: superjson.stringify({ error: 'Invalid input' }) };
    }

    const emailHtml = generateOrderEmailHtml(json);
    const recipientEmail = process.env.ORDER_RECIPIENT_EMAIL || 'molim.helper@gmail.com';
    const senderEmail = process.env.FROM_EMAIL_ADDRESS;

    await sendEmail({ to: recipientEmail, from: senderEmail, replyTo: json.customerEmail, subject: `طلب شراء مسبق جديد من ${json.customerEmail}`, html: emailHtml });

    return { statusCode: 200, body: superjson.stringify({ success: true, message: 'تم إرسال طلبك بنجاح.' }) };
  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: superjson.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }) };
  }
};
