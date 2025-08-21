import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Section } from "../components/Section";
import { Card } from "../components/Card";
import { Award, Target, Zap, ShieldCheck, HeartPulse, Users } from "lucide-react";
import styles from "./_index.module.css";

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Zap size={32} />,
      title: "دقة فائقة",
      description: "تقنيات استشعار متقدمة تضمن قياسات موثوقة في كل مرة.",
    },
    {
      icon: <Target size={32} />,
      title: "تصميم مبتكر",
      description: "هندسة تركز على المستخدم لتجربة سلسة وبديهية.",
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "موثوقية معتمدة",
      description: "حاصل على شهادات الجودة العالمية لضمان الأمان والفعالية.",
    },
    {
      icon: <HeartPulse size={32} />,
      title: "مراقبة مستمرة",
      description: "بيانات حيوية لحظية تساعد على اتخاذ قرارات طبية أفضل.",
    },
    {
      icon: <Users size={32} />,
      title: "دعم فني متميز",
      description: "فريق من الخبراء جاهز لمساعدتك على مدار الساعة.",
    },
    {
      icon: <Award size={32} />,
      title: "جودة التصنيع",
      description: "مصنوع من مواد عالية الجودة ليدوم طويلاً ويتحمل الاستخدام المكثف.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>molim company</title>
        <meta
          name="description"
          content="نبتكر اليوم، لصحةٍ أدق غدًا. تعرف على أجهزتنا الطبية المتطورة التي تقدم قياسات دقيقة مع تجربة استخدام بديهية."
        />
        <meta property="og:title" content="الرئيسية | ملم" />
        <meta property="og:description" content="نبتكر اليوم، لصحةٍ أدق غدًا." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200" />
        <meta property="og:url" content="https://your-domain.com/" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className={styles.pageContainer}>
        {/* Hero Section */}
        <Section variant="dark" className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>نبتكر اليوم، لصحةٍ أدق غدًا</h1>
            <p className={styles.heroDescription}>جهاز طبي متطور يقدّم قياسات دقيقة مع تجربة استخدام سهله، مصمم لتمكين الأطباء والمرضى على حد سواء.</p>
            <Button asChild size="lg" className={styles.heroCta}>
              <Link to="#product-intro">تعرّف على منتجنا</Link>
            </Button>
          </div>
        </Section>

        {/* Product Introduction Section */}
        <Section variant="light" id="product-intro">
          <div className={styles.productIntroSection}>
            <div className={styles.productIntroContent}>
              <h2 className={styles.productTitle}>جهاز ملم</h2>
              <p className={styles.productDescription}>جهاز ملم مصمم لتقديم قياسات دقيقة وسريعة، يدعم الربط السلس مع الأنظمة الطبية ويعزز تجربة المستخدم. يجمع بين التكنولوجيا المتطورة والتصميم العملي ليوفر حلولاً طبية شاملة تلبي احتياجات الافراد و المؤسسات الصحية المختلفة. مع واجهة سهلة الاستخدام ونظام ربط متكامل، يضمن جهاز ملم تحسين سير العمل وزيادة الكفاءة في البيئات الطبية.</p>
            </div>
            <div className={styles.productImageContainer}>
              <img
                src="https://assets.floot.app/cd4636e6-5d90-4ae4-af73-bddab3f87ca7/c1cb4cc2-2e87-47d0-bffb-c6283ef110a3.svg"
                alt="جهاز ملم الطبي المتطور"
                className={styles.productImage}
              />
            </div>
          </div>
        </Section>

        {/* Integration Section */}
        <Section variant="dark">
          <div className={styles.integrationSection}>
            <h2 className={styles.sectionTitle}>ترابط متكامل</h2>
            <p className={styles.integrationDescription}>
              يتميز جهاز ملم بقدرته على الاتصال والتكامل السلس مع جميع الأنظمة الطبية الموجودة في المؤسسة. يدعم بروتوكولات الاتصال المختلفة ويوفر واجهات برمجية متطورة تسمح بنقل البيانات الآمن والفوري، مما يحسن من كفاءة سير العمل ويقلل من أخطاء إدخال البيانات اليدوية.
            </p>
            
            <div className={styles.integrationImageContainer}>
              <img
                src="https://assets.floot.app/cd4636e6-5d90-4ae4-af73-bddab3f87ca7/75309f90-f06b-4312-bf58-6c00ab20b63b.svg"
                alt="ترابط الأنظمة الطبية"
                className={styles.integrationImage}
              />
            </div>

            <h3 className={styles.designTitle}>تصميم فريد</h3>
            <ul className={styles.featuresList}>
              <li>يأتي جهاز ملم بشاشة لمس IPS عالية الدقة قياس 11.6 بوصة توفر وضوحاً استثنائياً وتفاعلاً سلساً.</li>
              <li>منفذ Type-C يضمن نقل البيانات بسرعة عالية وشحن الجهاز بكفاءة.</li>
              <li>حامل مرن بآلية متطورة يتيح تثبيت الجهاز في زوايا متعددة ليمنحك أفضل زاوية عرض تناسبك.</li>
            </ul>

            <div className={styles.designImageContainer}>
              <img
                src="https://assets.floot.app/cd4636e6-5d90-4ae4-af73-bddab3f87ca7/a34ee277-1f9a-489a-91f5-2c9fa67b4b4f.svg"
                alt="تصميم جهاز ملم الفريد مع الميزات المميزة"
                className={styles.designImage}
              />
            </div>
          </div>
        </Section>

        {/* Why Choose Us Section */}
        <Section variant="light">
          <div className={styles.whyChooseHeader}>
            <div className={styles.whyChooseTitleWrap}>
              <h2 className={styles.sectionTitle}>لماذا تختارنا؟</h2>
            </div>
            <div className={styles.orderCtaWrap}>
              <Link to="/product" className={styles.orderCta} aria-label="اطلب الآن">
                <span className={styles.orderCtaIcon} aria-hidden>+</span>
                <span className={styles.orderCtaText}>اطلب الآن</span>
              </Link>
            </div>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <Card key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </Card>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
};

export default HomePage;