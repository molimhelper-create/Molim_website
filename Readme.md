# Molim Company
        
قاعدة الألوان مهم جدًا – بدلاً من التدرّج 
أريد تصميم الموقع بحيث كل سكشن في الصفحة له خلفية مختلفة بالتناوب 
سكشن بخلفية أزرق غامق #0B1E3A مع النص بالأبيض 
السكشن التالي بخلفية أبيض #FFFFFF مع النص بالأزرق الغامق 
ثم الذي بعده أزرق غامق … وهكذا 
كل الصفحات تلتزم بهذا النمط 
كل سكشن جديد يتبدّل لونه بالتتابع أزرق غامق ↔ أبيض 
النصوص تتبع التباين غامق→نص أبيض، فاتح→نص أزرق 
الهوية والتصميم 
متغيّرات ألوان 
--blue-deep: #0B1E3A 
--white: #FFFFFF 
يمكن استخدام درجة تمييز للأزرار/الروابط مثل: --blue-accent: #1D4ED8 
الخطوط: IBM Plex Arabic أو Cairo أو Noto Arabic 
RTL بالكامل، تصميم Responsive Mobile-first 
زوايا مستديرة 16–24px، تباعد 8/12/16/24/32px 
حالات Hover/Focus/Active واضحة وتباين AA+ 
صور WebP/AVIF + Lazy Loading، وأيقونات SVG 
الهيكل العام Header / Footer / تنقّل 
Header ثابت شعار يمين، روابط: الرئيسية – المنتج – عن الشركة – تواصل 
قائمة موبايل بأيقونة همبرغر إبراز الصفحة النشطة 
Footer في كل الصفحات: نبذة/عنوان مختصر، روابط سريعة، بيانات التواصل، أيقونات السوشال، وحقوق النشر بسنة ديناميكية 
ملاحظة التناوب: ابدأ الصفحة ب‍سكشن أزرق، ثم سكشن أبيض … والتزم التسلسل 
صفحة الرئيسية 
Hero أزرق غامق: صورة كبيرة + عنوان قوي + وصف سطرين + زر CTA “تعرّف على منتجنا” 
لماذا تختارنا أبيض: عنوان “لماذا تختارنا؟” 
شبكة 6 بطاقات زرقاء داخل هذا السكشن الأبيض 
دعوة الاستكشاف أزرق غامق: نص كبير: “جاهز لتجربة المستقبل – اكتشف منتجنا” + زر يقود لصفحة المنتج 
شعارات اعتماد/شركاء أبيض اختياري 
شهادات/مراجعات أزرق غامق اختياري 
صفحة المنتج 
Hero المنتج أزرق غامق: تخطيط عمودين – يمين: سلايدر صور أوتوماتيكي/يدوي 
يسار: اسم الجهاز، وصف قصير، أزرار: “اكتشف” + “تحميل الكتيّب” 
المواصفات والقياسات أبيض: ثلاثة Accordions مغلقة افتراضيًا مع أيقونة +/– وتوافق ARIA/Keyboard 
رؤوس الـAccordion فقط تكون مستطيلات زرقاء #0B1E3A، نص أبيض داخل سكشن أبيض 
كتلة الكتيّب أزرق غامق 
صفحة عن الشركة 
من نحن أزرق غامق – فقرة + صورة 
الرؤية والرسالة أبيض – صندوقان 
كلمة الرئيس التنفيذي أزرق غامق – ايقونه دائرية لبنت بدون صوره + نص 
الرعاه الرسميين تحت صوره 
شركاء النجاح/اربع اسماء مع ايقونه بدون صوره ثلاث رجال وبنت 
صفحة تواصل معنا 
معلومات الاتصال المباشرة أزرق غامق 
نموذج التواصل أبيض: الحقول: الاسم الكامل، البريد، الجوّال، الجهة، الموضوع، الرسالة 
خريطة/صورة الموقع أزرق غامق اختياري 
الوصول وUX 
تباين AA+، أحجام خط مناسبة، عناصر تفاعلية لمسية 
تسلسل عناوين H1..H3، نص بديل للصور 
Accordion/Dialogs/Drawer تعمل بالكيبورد Tab/Enter/Escape مع أدوار ARIA 
SEO والبيانات المنظمة 
title وmeta description فريدة لكل صفحة بالعربية 
Open Graph + Twitter Cards 
Schema.org: Organization، Product 
sitemap.xml وrobots.txt + فافيكون/شعار SVG 
حالات إضافية 
صفحة شكراً لك بعد الإرسال 
صفحة 404 أنيقة بروابط رجوع 
سياسة الخصوصية والشروط بالعربية 
نصوص افتراضية 
اسم الشركة: [اسم الشركة الطبية] 
الشعار: “نبتكر اليوم، لصحةٍ أدق غدًا” 
CTA: “اكتشف منتجنا” 
وصف المنتج المختصر: “جهاز طبي متطور يقدّم قياسات دقيقة مع تجربة استخدام بديهية” 
عناوين الـAccordion: “المواصفات الأساسية” – “القياسات الأساسية” – “القياسات الإضافية”

Made with Floot.

# Instructions

For security reasons, the `env.json` file is not pre-populated — you will need to generate or retrieve the values yourself.  

For **JWT secrets**, generate a value with:  

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then paste the generated value into the appropriate field.  

For the **Floot Database**, request a `pg_dump` from support, upload it to your own PostgreSQL database, and then fill in the connection string value.  

**Note:** Floot OAuth will not work in self-hosted environments.  

For other external services, retrieve your API keys and fill in the corresponding values.  

Once everything is configured, you can build and start the service with:  

```
npm install -g pnpm
pnpm install
pnpm vite build
pnpm tsx server.ts
```
