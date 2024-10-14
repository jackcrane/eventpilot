import React from "react";
import { useOrg } from "../../../../../hooks/useOrg";
import { Link, useParams } from "react-router-dom";
import { Loading } from "../../../../../components/loading";
import { Page } from "../../../../../components/page";
import { sidenavItems } from "..";
import { Card, Typography, Util } from "tabler-react-2";
import { useEvents } from "../../../../../hooks/useEvents";
const { H2, H3, Text } = Typography;
import styles from "../../../events/orgs.module.css";
import { IconCirclePlus, IconPlus } from "@tabler/icons-react";
import { Spinner } from "tabler-react-2/dist/spinner";
import { Button } from "tabler-react-2/dist/button";

export const Events = () => {
  const { organizationId } = useParams();
  const { loading, org } = useOrg(organizationId);
  const {
    events,
    loading: eventsLoading,
    createEvent,
    createEventLoading,
  } = useEvents(organizationId);

  if (loading)
    return (
      <Page sidenavItems={sidenavItems(organizationId, "Events")}>
        <Loading />
      </Page>
    );

  return (
    <Page sidenavItems={sidenavItems(organizationId, "Events")}>
      <Util.Row align="between">
        <H2>Events</H2>
        <Button
          onClick={createEvent}
          variant="primary"
          loading={createEventLoading}
        >
          <Util.Row gap={1}>
            <IconCirclePlus size={18} />
            Create Event
          </Util.Row>
        </Button>
      </Util.Row>
      <Util.Spacer size={1} />
      {eventsLoading ? (
        <Loading />
      ) : (
        <Util.Row gap={1} wrap>
          {events.map((event) => (
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
          <Link onClick={createEvent} className={styles.orgcardlink}>
            <Card className={styles.orgcard}>
              <H2>Create a new event</H2>
              {!createEventLoading ? (
                <IconPlus size={48} />
              ) : (
                <Spinner size="lg" />
              )}
            </Card>
          </Link>
        </Util.Row>
      )}
    </Page>
  );
};
