import React from "react";
import styles from "./footer.module.css";
import { Typography, Util } from "tabler-react-2";

const { B, Text, Link } = Typography;

export const Footer = ({ children }) => {
  return (
    <footer className={styles.footer}>
      <Util.Row style={{ alignItems: "flex-start" }} gap={2}>
        <Util.Col style={{ maxWidth: "50%" }}>
          <Text>
            EventPilot is an event management platform that helps empower you to
            create, manage, and promote the best events in the world. It is a
            battle-tested platform that is ready to scale with you.
          </Text>
          <Text>© {new Date().getFullYear()} EventPilot</Text>
        </Util.Col>
        <Util.Col>
          <B>Company</B>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/careers">Careers</Link>
        </Util.Col>
        <Util.Col>
          <B>Compliance</B>
          <Link href="/privacy-simplified">Privacy Simplified</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms and Conditions</Link>
          <Link href="/encryption-at-rest">Encryption at Rest</Link>
        </Util.Col>
        <Util.Col>
          <B>Product</B>
          <Link href="/">Home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/features">Features</Link>
          <Link href="/dashboard">Dashboard</Link>
        </Util.Col>
      </Util.Row>
    </footer>
  );
};
