import React from "react";
import styles from "./page.module.css";
import { Sidenav } from "./sidenav";

export const Page = ({ children, sidenavItems }) => {
  return (
    <div className={styles.page}>
      {sidenavItems && <Sidenav items={sidenavItems} />}
      <div className={styles.content}>{children}</div>
    </div>
  );
};
