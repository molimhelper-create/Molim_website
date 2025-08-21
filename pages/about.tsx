import React from "react";
import { Helmet } from "react-helmet";
import { Section } from "../components/Section";
import { Avatar, AvatarFallback } from "../components/Avatar";
import { Building, Eye, Goal, User } from "lucide-react";
import styles from "./about.module.css";

const AboutPage: React.FC = () => {


  return (
    <>
      <Helmet>
        <title>molim company</title>
        <meta
          name="description"
          content="تعرف على قصة [ملم]، رؤيتنا، رسالتنا، وفريق العمل الذي يقف خلف ابتكاراتنا في مجال الرعاية الصحية."
        />
        <meta property="og:title" content="عن الشركة | ملم" />
        <meta property="og:description" content="نحن نجمع بين الخبرة الطويلة والشغف بالابتكار لتقديم حلول تغير مستقبل الرعاية الصحية." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?q=80&w=1200" />
        <meta property="og:url" content="https://your-domain.com/about" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className={styles.pageContainer}>
        {/* Who We Are Section */}
        <Section variant="dark" className={styles.whoWeAreSection}>
          <div className={styles.whoWeAreGrid}>
            <div className={styles.whoWeAreContent}>
              <h1 className={styles.pageTitle}>من نحن</h1>
              <p className={styles.pageDescription}>شركة ناشئة أُسست على يد مجموعة من طلاب كلية الجبيل الصناعية، تعمل في القطاع الصحي التقني لتقديم حلول مبتكرة تهدف إلى تحسين جودة الحياة للمرضى، مع الالتزام بالابتكار والتقنية الحديثة لدعم الرعاية الصحية الفعّالة والمستدامة.</p>
            </div>
            <div className={styles.whoWeAreImageContainer}>
              <img
                src="https://assets.floot.app/cd4636e6-5d90-4ae4-af73-bddab3f87ca7/b6cc34c5-a562-4292-8267-3b778a9e30d9.png"
                alt="طبيب يستخدم جهاز لوحي مع هولوجرام قلب رقمي"
                className={styles.whoWeAreImage}
              />
            </div>
          </div>
        </Section>

        {/* Vision & Mission Section */}
        <Section variant="light" className={styles.visionMissionSection}>
          <div className={styles.visionMissionGrid}>
            <div className={styles.visionMissionBox}>
              <div className={styles.boxIcon}><Eye size={32} /></div>
              <h2 className={styles.boxTitle}>رؤيتنا</h2>
              <p className={styles.boxText}>أن نكون روادًا في ابتكار الحلول الصحية , لبناء مستقبل صحي و مستدام.</p>
            </div>
            <div className={styles.visionMissionBox}>
              <div className={styles.boxIcon}><Goal size={32} /></div>
              <h2 className={styles.boxTitle}>رسالتنا</h2>
              <p className={styles.boxText}>نهدف الى حلول تعزز الصحة و الكفاءة و توفر الراحة ، مما يساعد في تحسين  جودة الحياة.</p>
            </div>
          </div>
        </Section>

        {/* CEO Message Section */}
        <Section variant="dark" className={styles.ceoSection}>
          <div className={styles.ceoGrid}>
            <div className={styles.ceoAvatarContainer}>
              <Avatar className={styles.ceoAvatar}>
                <AvatarFallback className={styles.ceoAvatarFallback}>
                  <User size={20} />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className={styles.ceoMessage}>
              <h2 className={styles.sectionTitle}>كلمة الرئيس التنفيذي</h2>
              <blockquote>
                <p className={styles.ceoQuote}>في ملم، لا نرى أنفسنا مجرد مصنعين للأجهزة، بل شركاء في رحلة الرعاية الصحية. كل منتج نبتكره يحمل في طياته أملاً بتحسين حياة إنسان. هذا هو دافعنا، وهذا هو وعدنا لكم</p>
                <cite className={styles.ceoCite}>
                  <span className={styles.ceoName}>دانه الاسلمي</span>
                  <span className={styles.ceoTitle}>الرئيس التنفيذي</span>
                </cite>
              </blockquote>
            </div>
          </div>
        </Section>

        {/* Sponsors Section */}
        <Section variant="light" className={styles.sponsorsSection}>
          <h2 className={styles.sectionTitle}>الرعاة الرسميين</h2>
          <div className={styles.sponsorsImageContainer}>
              <img 
                src="https://assets.floot.app/cd4636e6-5d90-4ae4-af73-bddab3f87ca7/003eea14-9e41-4d11-9e3c-94bc9756fe45.png" 
                alt="الرعاة الرسميون - الراعي الاستراتيجي MCT، الراعي الصحي، الراعي الإبداعي، والراعي المميز Coffee" 
                className={styles.sponsorsImage}
              />
          </div>
        </Section>

        {/* Success Partners Section */}
        <Section variant="dark" className={styles.partnersSection}>
          <h2 className={styles.sectionTitle}>شركاء النجاح</h2>
          <p className={styles.partnersSubtitle}>
            نؤمن بأن النجاح الحقيقي يُبنى بالتعاون. هؤلاء هم الخبراء الذين يشاركوننا الرؤية والمسيرة.
          </p>
          <div className={styles.partnersGrid}>
            <div className={styles.partnerCard}>
              <div className={styles.partnerInfo}>
                <span className={styles.partnerName}>د. عبدالمجيد المنتشري </span>
              </div>
              <Avatar className={styles.partnerAvatar}>
                <AvatarFallback className={styles.partnerAvatarFallback}>
                  <User size={20} />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className={styles.partnerCard}>
              <div className={styles.partnerInfo}>
                <span className={styles.partnerName}>محمد بن سعد الوهيبي</span>
              </div>
              <Avatar className={styles.partnerAvatar}>
                <AvatarFallback className={styles.partnerAvatarFallback}>
                  <User size={20} />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className={styles.partnerCard}>
              <div className={styles.partnerInfo}>
                <span className={styles.partnerName}>م. حازم بن حسين المهنا</span>
              </div>
              <Avatar className={styles.partnerAvatar}>
                <AvatarFallback className={styles.partnerAvatarFallback}>
                  <User size={20} />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className={styles.partnerCard}>
              <div className={styles.partnerInfo}>
                <span className={styles.partnerName}>د. مها بنت خالد الشمري </span>
              </div>
              <Avatar className={styles.partnerAvatar}>
                <AvatarFallback className={styles.partnerAvatarFallback}>
                  <User size={20} />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
};

export default AboutPage;