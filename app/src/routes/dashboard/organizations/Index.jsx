import React from "react";
import { Typography } from "tabler-react-2";
import { useUser } from "../../../util/UserProvider";
import { Spinner } from "tabler-react-2/dist/spinner";
import { Page } from "../../../components/page";
import { useOrgs } from "../../../hooks/useOrgs";
import { Loading } from "../../../components/loading";
import { Button } from "tabler-react-2/dist/button";
const { H1, H2, H3, Text } = Typography;

export const Organizations = () => {
  const { user, loading } = useUser(true);
  const { orgs, loading: orgsLoading } = useOrgs();

  if (loading) return <Loading />;

  return (
    <div>
      <Page
        sidenavItems={[
          {
            type: "item",
            href: "/dashboard",
            text: "Dashboard Home",
          },
          {
            type: "item",
            href: "/dashboard/organizations",
            text: "Organizations",
            active: true,
          },
          { type: "item", href: "/dashboard/events", text: "Events" },
          { type: "divider" },
          { type: "item", href: "/dashboard/billing", text: "Billing" },
          { type: "item", href: "/dashboard/support", text: "Support" },
        ]}
      >
        <H1>Organizations</H1>
        {orgsLoading ? (
          <Loading />
        ) : (
          <>
            {orgs.length === 0 && (
              <div>
                <Text>Looks like you don't have any organizations!</Text>
                <Button variant="primary" href="/dashboard/organizations/new">
                  Create a new Organization
                </Button>
              </div>
            )}
            {orgs.map((org) => (
              <></>
            ))}
          </>
        )}
      </Page>
    </div>
  );
};
