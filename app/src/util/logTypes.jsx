import React from "react";
import {
  IconCopy,
  IconCopyMinus,
  IconCopyOff,
  IconCopyPlus,
  IconCopyX,
  IconCrop11,
  IconCrop11Filled,
  IconEdit,
  IconLockAccessOff,
  IconLogs,
  IconMessagePlus,
  IconPlaylistAdd,
} from "@tabler/icons-react";
import { Typography, Util, Input } from "tabler-react-2";
import { Todo } from "../components/todo";
import ObjectDiffViewer from "../routes/dashboard/organizations/[organizationId]";
import { Comment } from "../routes/dashboard/organizations/[organizationId]/Todos/[todoId]";
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
    case "TODO_COMMENT_CREATED":
      return {
        text: "Todo Comment Posted",
        icon: IconMessagePlus,
        color: "green",
      };
    case "TODO_DELETED":
      return { text: "Todo Deleted", icon: IconCopyX, color: "red" };
    case "TODO_MODIFIED_BLOCKED":
      return {
        text: "Todo Modified Blocked",
        icon: IconLockAccessOff,
        color: "red",
      };
    case "TODO_AUTO_UPDATE_FAILED":
      return {
        text: "Todo Auto Update Failed",
        icon: IconCopyOff,
        color: "red",
      };
    case "TODO_AUTO_UPDATE":
      return {
        text: "Todo Auto Update",
        icon: IconCrop11,
        color: "green",
      };
    default:
      return { text: "Log", icon: IconLogs, color: "gray" };
  }
};

export const switchLogTypesForContent = (log, renderLogCard = true) => {
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
          {renderLogCard && (
            <Util.Hr text="Below reflects the current state of the todo" />
          )}
          {renderLogCard && <Todo todoItem={log.todoItem} />}
        </>
      );
    case "TODO_STAGE_MODIFIED":
      return (
        <>
          <Text>A todo was moved into a different progress stage.</Text>
          <ObjectDiffViewer oldObj={log.data.from} newObj={log.data.to} />
          {renderLogCard && (
            <Util.Hr text="Below reflects the current state of the todo" />
          )}
          {renderLogCard && <Todo todoItem={log.todoItem} />}
        </>
      );
    case "TODO_MODIFIED":
      return (
        <>
          <Text>A todo was modified.</Text>
          <ObjectDiffViewer oldObj={log.data.from} newObj={log.data.to} />
          {renderLogCard && (
            <Util.Hr text="Below reflects the current state of the todo" />
          )}
          {renderLogCard && <Todo todoItem={log.todoItem} />}
        </>
      );
    case "TODO_COMMENT_CREATED":
      return (
        <>
          <Text>A comment was added to a todo.</Text>
          {renderLogCard && (
            <Util.Hr text="Below reflects the current state of the todo and comment" />
          )}
          {renderLogCard && <Todo todoItem={log.todoItem} />}
          {renderLogCard && <Util.Spacer size={1} />}
          <Comment comment={log.todoItemComment} />
        </>
      );
    case "TODO_DELETED":
      return (
        <>
          <Text>A todo was deleted.</Text>
          {renderLogCard && (
            <Util.Hr text="Below reflects the current state of the todo" />
          )}
          {renderLogCard && <Todo todoItem={log.todoItem} />}
        </>
      );
    case "TODO_MODIFIED_BLOCKED":
      return (
        <>
          <Text>
            A user attempted to modify a deleted todo and was blocked from doing
            so.
          </Text>
          <ObjectDiffViewer oldObj={log.data.from} newObj={log.data.to} />
          {renderLogCard && (
            <Util.Hr text="Below reflects the current state of the todo" />
          )}
          {renderLogCard && <Todo todoItem={log.todoItem} />}
        </>
      );
    case "TODO_AUTO_UPDATE_FAILED":
      return (
        <>
          <Text>
            EventPilot attempted to automatically update a todo but was unable
            to. More details are posted in the todo's comments.
          </Text>
          {renderLogCard && (
            <Util.Hr text="Below reflects the current state of the todo" />
          )}
          {renderLogCard && <Todo todoItem={log.todoItem} />}
        </>
      );
    case "TODO_AUTO_UPDATE":
      return (
        <>
          <Text>
            EventPilot successfully automatically updated a todo because the
            requisite changes were made in your org. More details are posted in
            the todo's comments.
          </Text>
          {renderLogCard && (
            <Util.Hr text="Below reflects the current state of the todo" />
          )}
          {renderLogCard && <Todo todoItem={log.todoItem} />}
        </>
      );
    default:
      return <>{log.type}</>;
  }
};
