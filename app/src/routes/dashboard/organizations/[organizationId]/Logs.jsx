import React from "react";
import { Page } from "../../../../components/page";
import { useParams } from "react-router-dom";
import { useOrg } from "../../../../hooks/useOrg";
import { useLogs } from "../../../../hooks/useLogs";
import { Loading } from "../../../../components/loading";
import { sidenavItems } from ".";
import { Typography } from "tabler-react-2";
import { LogsTimeline } from "../../../../components/logs";
const { H2, Text } = Typography;

export const Logs = () => {
  const { organizationId } = useParams();
  const { org, loading } = useOrg(organizationId);
  const {
    logs,
    loading: logsLoading,
    meta,
  } = useLogs(organizationId, {
    limit: 50,
  });

  if (loading && !org?.id) {
    return <Loading />;
  }

  return (
    <Page sidenavItems={sidenavItems(organizationId, "Logs")}>
      <H2>Logs</H2>
      {logsLoading ? (
        <Loading />
      ) : (
        <LogsTimeline
          shouldPaginate={true}
          pageSize={10}
          logs={logs}
          org={org}
        />
      )}
    </Page>
  );
};
