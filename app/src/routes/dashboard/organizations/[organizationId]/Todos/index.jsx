import React from "react";
import { Page } from "../../../../../components/page";
import { useParams } from "react-router-dom";
import { useOrg } from "../../../../../hooks/useOrg";
import { useLogs } from "../../../../../hooks/useLogs";
import { Loading } from "../../../../../components/loading";
import { sidenavItems } from "..";
import { Typography } from "tabler-react-2";
import { LogsTimeline } from "../../../../../components/logs";
import { Todos } from "../../../../../components/todo";
const { H2, Text } = Typography;

export const TodoPage = () => {
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
    <Page sidenavItems={sidenavItems(organizationId, "Todo List")}>
      <H2>Todo list</H2>
      <Todos />
    </Page>
  );
};
