import React from "react";
import { Helmet } from "react-helmet";
import { Section } from "../components/Section";
import { MapPin, Phone, Mail, Clock, Instagram, Twitter, MessageSquare } from "lucide-react";
import styles from "./contact.module.css";

// Better TikTok icon with cleaner design
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.16 20.5a6.33 6.33 0 0 0 10.14-6.85V7.56a8.38 8.38 0 0 0 4.29 1.13Z" />
  </svg>
);

// Better WhatsApp icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488" />
  </svg>
);

const ContactPage: React.FC = () => {
  const contactDetails = [
    { icon: <MapPin size={24} />, title: "موقعنا", value: "الجبيل ، المملكة العربية السعودية" },
    { icon: <Phone size={24} />, title: "الهاتف", value: "966582767589+" },
    { icon: <Mail size={24} />, title: "البريد الإلكتروني", value: "molimm.sa@gmail.com" },
    { icon: <Clock size={24} />, title: "أوقات العمل", value: "الأحد - الخميس، 9:00 صباحًا - 5:00 مساءً" },
  ];

  const socialLinks = [
    { icon: <TikTokIcon />, label: "TikTok", href: "https://www.tiktok.com/@molim.ksa?_t=ZS-8vA69xuyQXi&_r=1" },
    { icon: <Instagram />, label: "Instagram", href: "https://www.instagram.com/molim.ksa/?igsh=MTlqenIycG1tZmlhYg%3D%3D#" },
    { icon: <Twitter />, label: "Twitter / X", href: "https://x.com/molim1ksa?s=21" },
    { icon: <WhatsAppIcon />, label: "WhatsApp", href: "https://api.whatsapp.com/send/?phone=966582767589&text&type=phone_number&app_absent=0" },
  ];

  return (
    <>
      <Helmet>
        <title>تواصل معنا | ملم</title>
        <meta
          name="description"
          content="هل لديك استفسار؟ تواصل مع فريق [ملم] عبر الهاتف، البريد الإلكتروني، أو قم بزيارة مقرنا. نحن هنا لمساعدتك."
        />
        <meta property="og:title" content="تواصل معنا | ملم" />
        <meta property="og:description" content="نحن هنا للإجابة على جميع استفساراتك حول منتجاتنا وخدماتنا." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1596524430615-b46475ddff6e" />
        <meta property="og:url" content="https://your-domain.com/contact" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className={styles.pageContainer}>
        {/* Hero Section */}
        <Section variant="dark" className={styles.heroSection}>
          <h1 className={styles.pageTitle}>تواصل معنا</h1>
          <p className={styles.pageDescription}>
            نحن هنا للإجابة على جميع استفساراتك. سواء كنت مهتمًا بمنتجاتنا، أو تحتاج إلى دعم فني، أو ترغب في شراكة، فإن فريقنا جاهز لمساعدتك.
          </p>
        </Section>

        {/* Contact Info Section */}
        <Section variant="light">
          <div className={styles.contactGrid}>
            {contactDetails.map((item, index) => (
              <div key={index} className={styles.contactCard}>
                <div className={styles.contactIcon}>{item.icon}</div>
                <h2 className={styles.contactTitle}>{item.title}</h2>
                <p className={styles.contactValue}>{item.value}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Social Media Section */}
        <Section variant="dark">
          <div className={styles.socialSection}>
            <h2 className={styles.sectionTitle}>تابعنا على الشبكات الاجتماعية</h2>
            <p className={styles.socialDescription}>
              كن على اطلاع بآخر أخبارنا وابتكاراتنا من خلال متابعة حساباتنا.
            </p>
            <div className={styles.socialIconsGrid}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`تابعنا على ${social.label}`}
                  className={styles.socialIconLink}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </>
  );
};

export default ContactPage;