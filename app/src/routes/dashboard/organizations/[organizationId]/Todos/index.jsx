import React from "react";
import { Page } from "../../../../../components/page";
import { useParams } from "react-router-dom";
import { useOrg } from "../../../../../hooks/useOrg";
import { Loading } from "../../../../../components/loading";
import { sidenavItems } from "..";
import { Typography, Util } from "tabler-react-2";
import { Todos } from "../../../../../components/todo";
import { Button } from "tabler-react-2/dist/button";
import { useTodos } from "../../../../../hooks/useTodos";
import { IconCirclePlus } from "@tabler/icons-react";
const { H2, Text } = Typography;

export const TodoPage = () => {
  const { organizationId } = useParams();
  const { org, loading } = useOrg(organizationId);
  const { createTodo, createLoading } = useTodos(organizationId, { limit: 1 });

  if (loading && !org?.id) {
    return <Loading />;
  }

  return (
    <Page sidenavItems={sidenavItems(organizationId, "Todo List")}>
      <Util.Row style={{ justifyContent: "space-between" }}>
        <H2 style={{ margin: 0 }}>Todo list</H2>
        <Button onClick={createTodo} variant="primary" loading={createLoading}>
          <Util.Row gap={1}>
            <IconCirclePlus size={18} />
            Create Todo
          </Util.Row>
        </Button>
      </Util.Row>
      <Util.Spacer size={1} />
      <Todos />
    </Page>
  );
};
