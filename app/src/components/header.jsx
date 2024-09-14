import React from "react";
import logo from "../assets/logo-horizontal-100.png";
import styles from "./header.module.css";
import useAuth from "../hooks/useAuth";
import { Dropdown } from "tabler-react-2/dist/dropdown";
import { useUser } from "../util/UserProvider";
import { IconLogin2, IconLogout, IconUserPlus } from "@tabler/icons-react";

export const Header = () => {
  const { logout } = useAuth();
  const { user, isLoggedIn } = useUser();

  return (
    <header className={styles.header}>
      <img src={logo} alt="logo" className={styles.headerImage} />
      <Dropdown
        prompt={user?.name || "Account"}
        items={
          isLoggedIn
            ? [
                {
                  text: "Log Out",
                  onclick: logout,
                  icon: <IconLogout />,
                  type: "item",
                },
              ]
            : [
                {
                  text: "Log In",
                  href: "/auth/login",
                  type: "item",
                  icon: <IconLogin2 />,
                },
                {
                  text: "Register",
                  href: "/auth/signup",
                  type: "item",
                  icon: <IconUserPlus />,
                },
              ]
        }
      />
    </header>
  );
};
