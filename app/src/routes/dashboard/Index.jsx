import React from "react";
import { Card, Typography, Util } from "tabler-react-2";
import { useUser } from "../../util/UserProvider";
import { Spinner } from "tabler-react-2/dist/spinner";
import { Sidenav } from "../../components/sidenav";
import { Page } from "../../components/page";
import { Link } from "react-router-dom";
import { IconOlympics, IconUsersGroup } from "@tabler/icons-react";
const { H1, H2, H3, Text } = Typography;

export const Dashboard = () => {
  const { user, loading } = useUser(true);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <H3>Loading...</H3>
        <Spinner />
      </div>
    );

  return (
    <div>
      <Page
        sidenavItems={[
          {
            type: "item",
            href: "/dashboard",
            text: "Dashboard Home",
            active: true,
          },
          {
            type: "item",
            href: "/dashboard/organizations",
            text: "Organizations",
          },
          { type: "item", href: "/dashboard/events", text: "Events" },
          { type: "divider" },
          { type: "item", href: "/dashboard/billing", text: "Billing" },
          { type: "item", href: "/dashboard/support", text: "Support" },
        ]}
      >
        <H1>Dashboard</H1>
      </Page>
    </div>
  );
};
