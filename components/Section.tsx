import React from "react";
import styles from "./Section.module.css";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant: "dark" | "light";
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  variant,
  children,
  className,
  ...props
}) => {
  const sectionClasses = `${styles.section} ${styles[variant]} ${className || ""}`;

  return (
    <section className={sectionClasses} {...props}>
      <div className={styles.contentWrapper}>{children}</div>
    </section>
  );
};