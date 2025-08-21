import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Phone, Mail, MapPin, Instagram, Twitter } from "lucide-react";
import { Button } from "./Button";
import { Sheet, SheetContent, SheetTrigger } from "./Sheet";
import { ScrollToTop } from "./ScrollToTop";
import { useIsMobile } from "../helpers/useIsMobile";
import styles from "./SharedLayout.module.css";

const navLinks = [
  { name: "الرئيسية", path: "/" },
  { name: "المنتج", path: "/product" },
  { name: "عن الشركة", path: "/about" },
  { name: "تواصل معنا", path: "/contact" },
];

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



const DesktopNav = () => (
  <nav className={styles.desktopNav}>
    {navLinks.map((link) => (
      <NavLink
        key={link.path}
        to={link.path}
        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}
      >
        {link.name}
      </NavLink>
    ))}
  </nav>
);

const MobileNav = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => (
  <Sheet open={open} onOpenChange={setOpen}>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className={styles.menuButton}>
        <Menu />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className={styles.mobileMenuContent}>
      <div className={styles.mobileMenuHeader}>
        <Link to="/" className={styles.logo}>
          <img 
            src="https://assets.floot.app/cd4636e6-5d90-4ae4-af73-bddab3f87ca7/d815c993-e4ef-4754-ac48-b89268d775a1.svg" 
            alt="شعار الشركة" 
            className={styles.logoImage}
          />
        </Link>
      </div>
      <nav className={styles.mobileNav}>
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ""}`}
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </SheetContent>
  </Sheet>
);

export const SharedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const headerClasses = `${styles.header} ${isScrolled ? styles.scrolled : ""}`;

  return (
    <div className={styles.layout}>
      <ScrollToTop />
      <header className={headerClasses}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            <img 
              src="https://assets.floot.app/cd4636e6-5d90-4ae4-af73-bddab3f87ca7/d815c993-e4ef-4754-ac48-b89268d775a1.svg" 
              alt="شعار الشركة" 
              className={styles.logoImage}
            />
          </Link>
          {isMobile ? <MobileNav open={isMobileMenuOpen} setOpen={setIsMobileMenuOpen} /> : <DesktopNav />}
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>ملم</h3>
            <p className={styles.footerDescription}>نبتكر اليوم، لصحةٍ أدق غداً. ملتزمون بتقديم أحدث التقنيات في مجال الرعاية الصحية</p>
          </div>
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>روابط سريعة</h3>
            <ul className={styles.footerLinks}>
              {navLinks.map(link => (
                <li key={link.path}><Link to={link.path}>{link.name}</Link></li>
              ))}
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>تواصل معنا</h3>
            <ul className={styles.contactInfo}>
              <li><MapPin size={16} /> <span>الجبيل ، المملكة العربية السعودية</span></li>
              <li><Mail size={16} /> <span>molimm.sa@gmail.com</span></li>
              <li><Phone size={16} /> <span>966582767589+</span></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>تابعنا</h3>
            <div className={styles.socialIconsGrid}>
              <a
                href="https://www.tiktok.com/@molim.ksa?_t=ZS-8vA69xuyQXi&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تابعنا على TikTok"
                className={styles.socialIconLink}
              >
                <TikTokIcon />
              </a>
              <a
                href="https://www.instagram.com/molim.ksa/?igsh=MTlqenIycG1tZmlhYg%3D%3D#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تابعنا على Instagram"
                className={styles.socialIconLink}
              >
                <Instagram />
              </a>
              <a
                href="https://x.com/molim1ksa?s=21"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تابعنا على Twitter / X"
                className={styles.socialIconLink}
              >
                <Twitter />
              </a>
              <a
                href="https://api.whatsapp.com/send/?phone=966582767589&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تواصل معنا عبر WhatsApp"
                className={styles.socialIconLink}
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} ملم. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};