import React from "react";
import { Card, Typography, Util } from "tabler-react-2";
import { useUser } from "../../../util/UserProvider";
import { Spinner } from "tabler-react-2/dist/spinner";
import { Page } from "../../../components/page";
import { useOrgs } from "../../../hooks/useOrgs";
import { Loading } from "../../../components/loading";
import { Button } from "tabler-react-2/dist/button";
const { H1, H2, H3, Text } = Typography;
import styles from "./orgs.module.css";
import { Link } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";

export const Events = () => {
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
          },
          {
            type: "item",
            href: "/dashboard/events",
            text: "Events",
            active: true,
          },
          { type: "divider" },
          { type: "item", href: "/dashboard/billing", text: "Billing" },
          { type: "item", href: "/dashboard/support", text: "Support" },
        ]}
      >
        <Util.Row align="between">
          <H1>Events</H1>
        </Util.Row>
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
              <>
                <H2>{org.name}</H2>
                <Util.Row wrap gap={1}>
                  {orgs.events?.map((event) => (
                    <>
                      <Link
                        to={`/dashboard/organizations/${org.id}/events/${event.id}`}
                        className={styles.orgcardlink}
                      >
                        <Card
                          style={{
                            backgroundImage: `radial-gradient(at left top, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.3)), url(${event.marketingPrimaryBannerImage?.url})`,
                          }}
                          className={styles.orgcard}
                        >
                          <H3>{event.name || "New Event"}</H3>
                        </Card>
                      </Link>
                    </>
                  ))}
                  <Link
                    to={`/dashboard/organizations/${org.id}/events?new`}
                    className={styles.orgcardlink}
                  >
                    <Card className={styles.orgcard}>
                      <H2>Create a new event</H2>
                      <IconPlus size={48} />
                    </Card>
                  </Link>
                </Util.Row>
                {/* If not the last org, add an hr */}
                {orgs[orgs.length - 1] !== org && <Util.Hr />}
              </>
            ))}
            {/* <Util.Row wrap gap={1}>
            </Util.Row> */}
          </>
        )}
      </Page>
    </div>
  );
};
