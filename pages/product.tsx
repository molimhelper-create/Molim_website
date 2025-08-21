import * as React from "react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Section } from "../components/Section";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Card } from "../components/Card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "../components/Accordion";
import { Download, Info, ShoppingCart, Mail, CheckCircle } from "lucide-react";
import { useCart } from "../helpers/useCart";
import { BASE_DEVICE, ADDONS, formatCurrency } from "../helpers/priceCalculations";
import { useMutation } from "@tanstack/react-query";
import { postSendOrder } from "../endpoints/send-order_POST.schema";
import styles from "./product.module.css";

const ShoppingSection: React.FC = () => {
  const { items, addItem, removeItem, isInCart, subtotal, tax, shipping, total, itemCount, clearCart } = useCart();
  const [customerEmail, setCustomerEmail] = useState("");

  const orderMutation = useMutation({
    mutationFn: postSendOrder,
    onSuccess: () => {
      alert("تم إرسال طلبك بنجاح! سنتواصل معك قريباً.");
      setCustomerEmail("");
      clearCart();
    },
    onError: (error) => {
      alert(`حدث خطأ: ${error.message}`);
    }
  });

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.trim()) {
      alert("الرجاء إدخال البريد الإلكتروني");
      return;
    }
    if (items.length === 0) {
      alert("عربة التسوق فارغة");
      return;
    }
    
    const itemIds = items.map(item => item.id);
    // Submit to Netlify Forms as a fallback (best-effort) so Netlify can
    // capture submissions and send notifications without SMTP.
    try {
      const formData = new FormData();
      formData.append('form-name', 'send-order');
      formData.append('customerEmail', customerEmail);
      // append itemIds as multiple values to match server schema
      itemIds.forEach(id => formData.append('itemIds', id));
      // Fire-and-forget; Netlify will record this POST as a form submission.
      fetch('/', { method: 'POST', body: formData }).then(res => {
        console.log('Netlify Forms fallback submission status', res.status);
      }).catch(err => {
        console.warn('Netlify Forms fallback failed', err && err.message ? err.message : err);
      });
    } catch (err) {
      console.warn('Failed to run Netlify Forms fallback', err && (err as Error).message);
    }

    orderMutation.mutate({ customerEmail, itemIds });
  };

  return (
        <Section variant="light" className={styles.shoppingSection}>
      <h2 className={styles.shoppingSectionTitle}>اطلب جهازك الآن</h2>
      <p className={styles.shoppingSectionSubtitle}>
        اختر الجهاز الأساسي والإضافات التي تحتاجها
      </p>



      {/* Base Device */}
      <div className={styles.baseDeviceContainer}>
        <h3 className={styles.baseDeviceTitle}>الجهاز الأساسي</h3>
        <div className={styles.baseDeviceCard}>
          <div className={styles.productInfo}>
            <h4 className={styles.productName}>{BASE_DEVICE.name}</h4>
            <div className={styles.productPrice}>{formatCurrency(BASE_DEVICE.price)}</div>
          </div>
          <Button 
            variant={isInCart(BASE_DEVICE.id) ? "secondary" : "primary"}
            onClick={() => {
              if (isInCart(BASE_DEVICE.id)) {
                removeItem(BASE_DEVICE.id);
              } else {
                addItem(BASE_DEVICE);
              }
            }}
            className={styles.addToCartButton}
          >
            {isInCart(BASE_DEVICE.id) ? (
              <>
                <CheckCircle size={16} />
                تمت الإضافة
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                أضف للسلة
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Add-ons */}
      <div className={styles.addonsContainer}>
        <h3 className={styles.addonsTitle}>الإضافات</h3>
        <div className={styles.addonsGrid}>
          {ADDONS.map((addon) => (
            <Card key={addon.id} className={styles.addonCard}>
              <div className={styles.addonInfo}>
                <h4 className={styles.addonName}>{addon.name}</h4>
                <div className={styles.addonPrice}>{formatCurrency(addon.price)}</div>
              </div>
              <Button 
                size="sm"
                variant={isInCart(addon.id) ? "secondary" : "primary"}
                onClick={() => {
                  if (isInCart(addon.id)) {
                    removeItem(addon.id);
                  } else {
                    addItem(addon);
                  }
                }}
                className={styles.addonAddButton}
              >
                {isInCart(addon.id) ? (
                  <>
                    <CheckCircle size={14} />
                    مضاف
                  </>
                ) : (
                  <>
                    <ShoppingCart size={14} />
                    أضف
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      {itemCount > 0 && (
        <div className={styles.cartSummaryContainer}>
          <h3 className={styles.cartTitle}>ملخص الطلب</h3>
          <div className={styles.cartContent}>
            <div className={styles.cartItems}>
              <h4 className={styles.cartItemsTitle}>العناصر المحددة ({itemCount})</h4>
              {items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.cartItemInfo}>
                    <span className={styles.cartItemName}>{item.name}</span>
                    <span className={styles.cartItemPrice}>{formatCurrency(item.price)}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => removeItem(item.id)}
                    className={styles.removeButton}
                  >
                    إزالة
                  </Button>
                </div>
              ))}
            </div>
            
            <div className={styles.cartTotals}>
              <div className={styles.totalRow}>
                <span>المجموع الفرعي:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>الشحن:</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>الضريبة (15%):</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className={styles.totalRowFinal}>
                <span>الإجمالي:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className={styles.preorderNote}>
              <Info size={16} />
              <span>هذا طلب مسبق - سنتواصل معك لتأكيد التفاصيل</span>
            </div>

            <form onSubmit={handleSubmitOrder} className={styles.orderForm}>
              <div className={styles.emailInputContainer}>
                <Mail size={16} className={styles.emailIcon} />
                <Input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  className={styles.emailInput}
                />
              </div>
              <Button 
                type="submit" 
                size="lg"
                disabled={orderMutation.isPending}
                className={styles.submitButton}
              >
                {orderMutation.isPending ? "جار الإرسال..." : "إتمام الطلب"}
              </Button>
            </form>

            {/* Hidden static form for Netlify Forms (build-time parsed). */}
            <form name="send-order" method="POST" data-netlify="true" netlify-honeypot="bot-field" hidden>
              <input type="hidden" name="form-name" value="send-order" />
              <input type="text" name="bot-field" />
              <input type="email" name="customerEmail" />
              {/* itemIds can be repeated inputs; Netlify will capture multiple values */}
              <input type="text" name="itemIds" />
            </form>
          </div>
        </div>
      )}
    </Section>
  );
};

const ProductPage: React.FC = () => {
  const specificationsData = {
    rightColumn: [
      { label: "الشاشة", value: "شاشة TFT بحجم 11.6 بوصة" },
      { label: "الدقة", value: "1080×1920 بكسل" },
      { label: "المعالج (CPU)", value: "معالج رباعي النواة" },
      { label: "الذاكرة المؤقتة (RAM)", value: "1 جيجابايت" },
      { label: "الذاكرة الداخلية (ROM)", value: "8 جيجابايت" },
      { label: "الشبكة اللاسلكية", value: "يدعم الاتصال عبر Wifi" },
      { label: "الشبكة السلكية", value: "LAN بسرعة (10M-100M) بكيف تلقائي" },
      { label: "البطارية", value: "ليثيوم بسعة 5200mAh" },
    ],
    leftColumn: [
      { label: "البلوتوث", value: "بلوتوث 4.0 و 2.0 - وضع مزدوج" },
      { label: "منفذ USB", value: "USB 2.0 ومنفذ Type-C واحد" },
      { label: "منفذ HDMI", value: "يدعم الاتصال بشاشات خارجية كبيرة" },
      { label: "الميكروفون والسماعة", value: "ميكروفون وسماعة خارجية مدمجة" },
      { label: "بطاقة التخزين", value: "يدعم بطاقة TF" },
      { label: "الكاميرا", value: "500 وحدة بكسل (5 ميجا بكسل)" },
      { label: "الشبكة الخلوية", value: "خيار اتصال بديل (Mobile Network)" },
      { label: "الصوت", value: "مدخل سماعة أذن مقياس 3.5 مليمتر" },
    ],
  };

  return (
    <>
      <Helmet>
        <title>molim company</title>
        <meta
          name="description"
          content="تعرف على جهازنا الطبي المتطور الذي يقدم قياسات دقيقة مع تجربة استخدام بديهية. اكتشف المواصفات وحمل الكتيب."
        />
        <meta property="og:title" content="المنتج | ملم" />
        <meta property="og:description" content="جهاز طبي متطور يقدم قياسات دقيقة مع تجربة استخدام بديهية." />
        <meta property="og:image" content="https://assets.floot.app/cd4636e6-5d90-4ae4-af73-bddab3f87ca7/ef43cfb5-2057-4c7e-a439-cdc96d2f58cb.svg" />
        <meta property="og:url" content="https://your-domain.com/product" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className={styles.pageContainer}>
        {/* Product Hero Section */}
        <Section variant="dark" className={styles.heroSection}>
          <div className={styles.heroGrid}>
            <div className={styles.heroImage}>
              <img
                src="https://assets.floot.app/cd4636e6-5d90-4ae4-af73-bddab3f87ca7/ef43cfb5-2057-4c7e-a439-cdc96d2f58cb.svg"
                alt="جهاز Vitalis Pro X - عرض شامل للجهاز الطبي"
                className={styles.productImage}
              />
            </div>
            <div className={styles.heroContent}>
              <h1 className={styles.productName}>جهاز ملم</h1>
              <p className={styles.productDescription}>
                جهاز طبي متطور يقدّم قياسات دقيقة مع تجربة استخدام بديهية. مصمم ليكون شريكك الموثوق في الرعاية الصحية، حيث يجمع بين التكنولوجيا المتقدمة والتصميم العملي لتوفير بيانات حيوية بالغة الأهمية بسرعة وكفاءة.
              </p>
              <div className={styles.ctaButtons}>
                <Button 
                  size="lg"
                  onClick={() => {
                    const specificationsSection = document.getElementById('specifications-section');
                    if (specificationsSection) {
                      specificationsSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }}
                >
                  <Info size={20} />
                  اكتشف الميزات
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <a 
                    href="https://drive.google.com/file/d/1OrYDdCRN3uXgzzsPmXfUahR9vGFSvnlw/view" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Download size={20} />
                    تحميل الكتيّب
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Section>

        {/* Specifications Section */}
        <Section variant="light" id="specifications-section">
          <h2 className={styles.sectionTitle}>المواصفات التقنية  والقياسات الحيوية</h2>
          <div className={styles.specificationsContainer}>
            <Accordion type="single" collapsible className={styles.accordionContainer}>
              <AccordionItem value="technical-specs" className={styles.accordionItem}>
                <AccordionTrigger className={styles.accordionTrigger}>
                  المواصفات التقنية
                </AccordionTrigger>
                <AccordionContent className={styles.accordionContent}>
                  <div className={styles.specificationsTable}>
                    <div className={styles.tableColumn}>
                      {specificationsData.rightColumn.map((spec, index) => (
                        <div key={index} className={styles.specRow}>
                          <div className={styles.specLabel}>{spec.label}</div>
                          <div className={styles.specValue}>{spec.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.tableColumn}>
                      {specificationsData.leftColumn.map((spec, index) => (
                        <div key={index} className={styles.specRow}>
                          <div className={styles.specLabel}>{spec.label}</div>
                          <div className={styles.specValue}>{spec.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="basic-measurements" className={styles.accordionItem}>
                <AccordionTrigger className={styles.accordionTrigger}>
                  القياسات الأساسية
                </AccordionTrigger>
                <AccordionContent className={styles.accordionContent}>
                  <div className={styles.measurementsList}>
                    <div className={styles.measurementItem}>
                      <div className={styles.measurementLabel}>نسبة الأكسجين في الدم (SpO2)</div>
                      <div className={styles.measurementDescription}>قياس مستوى تشبع الدم بالأكسجين بدقة عالية</div>
                    </div>
                    <div className={styles.measurementItem}>
                      <div className={styles.measurementLabel}>مستوى سكر الدم</div>
                      <div className={styles.measurementDescription}>مراقبة مستويات الجلوكوز في الدم</div>
                    </div>
                    <div className={styles.measurementItem}>
                      <div className={styles.measurementLabel}>معدل ضربات القلب (HR)</div>
                      <div className={styles.measurementDescription}>قياس نبضات القلب في الدقيقة الواحدة</div>
                    </div>
                    <div className={styles.measurementItem}>
                      <div className={styles.measurementLabel}>تخطيط القلب الكهربائي (ECG)</div>
                      <div className={styles.measurementDescription}>تسجيل النشاط الكهربائي للقلب</div>
                    </div>
                    <div className={styles.measurementItem}>
                      <div className={styles.measurementLabel}>ضغط الدم (NIBP)</div>
                      <div className={styles.measurementDescription}>قياس ضغط الدم الانقباضي والانبساطي</div>
                    </div>
                    <div className={styles.measurementItem}>
                      <div className={styles.measurementLabel}>درجة الحرارة (TEMP)</div>
                      <div className={styles.measurementDescription}>مراقبة درجة حرارة الجسم</div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="additional-measurements" className={styles.accordionItem}>
                <AccordionTrigger className={styles.accordionTrigger}>
                  القياسات الإضافية
                </AccordionTrigger>
                <AccordionContent className={styles.accordionContent}>
                  <div className={styles.measurementsList}>
                    <div className={styles.measurementItem}>
                      <div className={styles.measurementLabel}>ميزان الدهون والوزن</div>
                      <div className={styles.measurementDescription}>تحليل تركيبة الجسم ونسبة الدهون</div>
                    </div>
                    <div className={styles.measurementItem}>
                      <div className={styles.measurementLabel}>تحليل البول (11 عنصرًا + 100 شريط)</div>
                      <div className={styles.measurementDescription}>فحص شامل للبول يغطي 11 عنصرًا مختلفًا</div>
                    </div>
                    <div className={styles.measurementItem}>
                      <div className={styles.measurementLabel}>شرائط فحص حمض اليوريك في الدم (25 قطعة)</div>
                      <div className={styles.measurementDescription}>قياس مستوى حمض اليوريك للكشف عن النقرس</div>
                    </div>
                    <div className={styles.measurementItem}>
                      <div className={styles.measurementLabel}>جهاز تحليل دهون الدم</div>
                      <div className={styles.measurementDescription}>فحص الكوليسترول، HDL، LDL، والدهون الثلاثية</div>
                    </div>
                    <div className={styles.measurementItem}>
                      <div className={styles.measurementLabel}>شرائط فحص دهون الدم (20 قطعة)</div>
                      <div className={styles.measurementDescription}>شرائط فحص مخصصة لتحليل دهون الدم</div>
                    </div>
                    <div className={styles.measurementItem}>
                      <div className={styles.measurementLabel}>حساس الهيموغلوبين</div>
                      <div className={styles.measurementDescription}>قياس مستوى الهيموغلوبين في الدم</div>
                    </div>
                    <div className={styles.measurementItem}>
                      <div className={styles.measurementLabel}>شرائط فحص الهيموغلوبين</div>
                      <div className={styles.measurementDescription}>شرائط فحص مخصصة للهيموغلوبين</div>
                    </div>
                    <div className={styles.measurementItem}>
                      <div className={styles.measurementLabel}>ميزان حرارة بالأشعة تحت الحمراء</div>
                      <div className={styles.measurementDescription}>قياس درجة الحرارة بدون تلامس</div>
                    </div>
                    <div className={styles.measurementItem}>
                      <div className={styles.measurementLabel}>سماعة طبية رقمية</div>
                      <div className={styles.measurementDescription}>فحص الأصوات القلبية والرئوية بتقنية رقمية</div>
                    </div>
                    <div className={styles.measurementItem}>
                      <div className={styles.measurementLabel}>جهاز قياس التنفس (سبيرومتر)</div>
                      <div className={styles.measurementDescription}>قياس وظائف الرئة وحجم الهواء المتنفس</div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Section>

        {/* New Brochure Download Section */}
        <Section variant="dark" className={styles.newBrochureSection}>
          <h2 className={styles.newBrochureTitle}>احصل على الكتيب الشامل</h2>
          <p className={styles.newBrochureText}>تحميل مجاني للكتيب التفصيلي الذي يحتوي على كافة المواصفات جهاز ملم</p>
          <Button size="lg" variant="secondary" asChild>
            <a 
              href="https://drive.google.com/file/d/1OrYDdCRN3uXgzzsPmXfUahR9vGFSvnlw/view" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Download size={20} />
              تحميل الكتيب الان pdf
            </a>
          </Button>
        </Section>



        {/* Shopping Cart Section */}
        <ShoppingSection />
      </div>
    </>
  );
};

export default ProductPage;