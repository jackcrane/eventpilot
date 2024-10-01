import React from "react";
import {
  IconCopy,
  IconCopyMinus,
  IconCopyPlus,
  IconEdit,
  IconLogs,
  IconPlaylistAdd,
} from "@tabler/icons-react";
import { Typography, Util, Input } from "tabler-react-2";
import { Todo } from "../components/todo";
import ObjectDiffViewer from "../routes/dashboard/organizations/[organizationId]";
const { Text } = Typography;

export const switchLogTypes = (logType) => {
  switch (logType) {
    case "ORG_MODIFIED":
      return {
        text: "Organization Modified",
        icon: IconEdit,
        color: "blue",
      };
    case "TODO_CREATED":
      return { text: "Todo Created", icon: IconCopyPlus, color: "green" };
    case "TODO_STAGE_MODIFIED":
      return {
        text: "Todo Stage Modified",
        icon: IconCopyMinus,
        color: "blue",
      };
    case "TODO_MODIFIED":
      return { text: "Todo Modified", icon: IconCopy, color: "blue" };
    case "MORE_LOGS_AVAILABLE__UI_EXCL":
      return {
        text: "More logs available",
        icon: IconPlaylistAdd,
        color: "gray",
      };
    default:
      return { text: "Log", icon: IconLogs, color: "gray" };
  }
};

export const switchLogTypesForContent = (log) => {
  switch (log.type) {
    case "ORG_MODIFIED":
      return (
        <ObjectDiffViewer
          oldObj={log.data.diff.from}
          newObj={log.data.diff.to}
        />
      );
    case "TODO_CREATED":
      return (
        <>
          <Text>A new todo item was created.</Text>
          <Todo todoItem={log.todoItem} />
        </>
      );
    case "TODO_STAGE_MODIFIED":
      return (
        <>
          <Text>A todo was moved into a different progress stage.</Text>
          <ObjectDiffViewer oldObj={log.data.from} newObj={log.data.to} />
          <Util.Hr text="Below reflects the current state of the todo" />
          <Todo todoItem={log.todoItem} />
        </>
      );
    case "TODO_MODIFIED":
      return (
        <>
          <Text>A todo was moved into a different progress stage.</Text>
          <ObjectDiffViewer oldObj={log.data.from} newObj={log.data.to} />
          <Typography.I>asdf</Typography.I>
          <Todo todoItem={log.todoItem} />
        </>
      );
    default:
      return <>{log.type}</>;
  }
};
