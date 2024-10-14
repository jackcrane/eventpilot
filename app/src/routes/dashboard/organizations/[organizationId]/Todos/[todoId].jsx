import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sidenavItems } from "..";
import { Page } from "../../../../../components/page";
import {
  Typography,
  Util,
  DropdownInput,
  Input,
  Form,
  Card,
  useConfirm,
} from "tabler-react-2";
const { H2, Text, H3 } = Typography;
import { Todo } from "../../../../../components/todo";
import { useTodo } from "../../../../../hooks/useTodo";
import { Loading } from "../../../../../components/loading";
import { Spinner } from "tabler-react-2/dist/spinner";
import { DatePicker } from "../../../../../components/dateTimeWithZone";
import { IconMessagesOff, IconTrash } from "@tabler/icons-react";
import { Alert } from "tabler-react-2/dist/alert";
import { Button } from "tabler-react-2/dist/button";
import { LogsTimeline } from "../../../../../components/logs";
import { Avatar } from "tabler-react-2/dist/avatar";
import moment from "moment";
import toast, { Toaster } from "react-hot-toast";
import logo from "../../../../../assets/logo-sharp.png";

window.toast = toast;

export const TodoDetails = () => {
  const { organizationId, todoId } = useParams();
  const {
    todo,
    loading,
    updateTodoStage,
    stageLoading,
    comment,
    commentLoading,
    commentError,
    update,
    updateLoading,
    del,
  } = useTodo(organizationId, todoId, {
    dontTriggerLoadingOnStageUpdate: true,
  });

  const [dueDate, setDueDate] = useState(new Date(todo?.dueDate || null));
  const [dueDateTz, setDueDateTz] = useState(todo?.dueDateTimezone || null);
  const [title, setTitle] = useState(todo?.title || "");
  const [text, setText] = useState(todo?.text || "");
  const [href, setHref] = useState(todo?.href || "");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (todo) {
      setDueDate(todo.dueDate ? new Date(todo.dueDate) : null);
      setDueDateTz(todo.dueDateTimezone);
      setTitle(todo.title);
      setText(todo.text);
      setHref(todo.href);
    }
  }, [todo]);

  const { confirm, ConfirmModal } = useConfirm({
    title: "Are you sure?",
    text: "You cannot undelete, modify, or continue to work with deleted todos. They will not be visible in the kanban board, but records and logs are retained.",
    commitText: "Yes",
    cancelText: "No",
  });

  const handleDelete = async () => {
    const res = await confirm();
    if (res) {
      del();
    }
  };

  if (loading) {
    return <Loading />;
  }

  const handleSubmit = () => {
    update({
      title,
      text,
      href,
      dueDate,
      dueDateTimezone: dueDateTz,
    });
  };

  return (
    <Page sidenavItems={sidenavItems(organizationId, "Todo List")}>
      <Toaster />
      {ConfirmModal}
      <Util.Row style={{ justifyContent: "space-between" }}>
        <H2 style={{ margin: 0 }}>Todo Details</H2>
        {!todo.deleted && (
          <Button outline variant="danger" onClick={handleDelete}>
            <Util.Row>
              <IconTrash size={18} />
              Delete Todo
            </Util.Row>
          </Button>
        )}
      </Util.Row>
      <Util.Spacer size={1} />
      <Todo todoItem={todo} showsDropdown={false} />
      <Util.Hr />
      {todo.deleted && (
        <Alert variant="danger" title="This todo has been deleted.">
          This todo has been deleted. You can no longer edit or continue to work
          on it. It will not be visible in the kanban board, but records, logs,
          and comments are retained.
        </Alert>
      )}
      <Util.Row style={{ alignItems: "flex-start" }} gap={1}>
        <Util.Col style={{ width: "50%" }} gap={1}>
          <div>
            <H2>Edit this todo</H2>
            <Text>Stage</Text>
            <Util.Row gap={1}>
              <DropdownInput
                disabled={todo.deleted}
                prompt="Select"
                values={[
                  {
                    id: "OPEN",
                    label: "Open",
                  },
                  {
                    id: "IN_PROGRESS",
                    label: "In Progress",
                  },
                  {
                    id: "COMPLETE",
                    label: "Complete",
                  },
                  {
                    id: "BLOCKED",
                    label: "Blocked",
                  },
                  {
                    id: "WAITING",
                    label: "Waiting",
                  },
                  {
                    id: "WONT_DO",
                    label: "Won't Do",
                  },
                ]}
                value={{
                  id: todo.stage,
                }}
                onChange={(val) => {
                  updateTodoStage(val.id);
                }}
              />
              {stageLoading && <Spinner color="secondary" size="sm" />}
            </Util.Row>
          </div>
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e)}
            disabled={todo.deleted}
          />
          <Form.Autosize
            title="Text"
            value={text}
            onChange={(e) => setText(e)}
            disabled={todo.deleted}
          />
          <Input
            label={
              <>
                Embedded Link (
                <Typography.Link href={todo.href}>visit</Typography.Link>)
              </>
            }
            placeholder="You can add a link here."
            value={href}
            onChange={(e) => setHref(e)}
            disabled={todo.deleted}
          />
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={setDueDate}
            timezoneValue={{ id: dueDateTz }}
            onTimezoneChange={(e) => setDueDateTz(e.id)}
            disabled={todo.deleted}
          />
          <Util.Spacer size={1} />
          <Button
            onClick={handleSubmit}
            loading={updateLoading}
            disabled={todo.deleted}
          >
            Save Changes
          </Button>
        </Util.Col>
        <Util.Col style={{ width: "50%" }}>
          <H2>Comments</H2>
          {todo.comments?.length === 0 && (
            <>
              <Alert
                icon={<IconMessagesOff />}
                type="secondary"
                title="There are no comments on this todo yet."
              ></Alert>
            </>
          )}

          <H3>Add a comment</H3>
          {commentError && <Alert variant="danger" title={commentError} />}
          <Form.Autosize
            title="Comment text"
            placeholder="Enter the content of your comment. You can add more comments, but cannot edit or delete this later."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Util.Spacer size={1} />
          <Button
            onClick={() =>
              comment(commentText).then((g) => g && setCommentText(""))
            }
            loading={commentLoading}
            disabled={todo.deleted}
          >
            Add comment
          </Button>
          <Util.Hr />
          <div style={{ maxHeight: "90vh", overflowY: "auto" }}>
            {todo.comments?.map((comment) => (
              <Comment comment={comment} />
            ))}
          </div>
        </Util.Col>
      </Util.Row>
      <Util.Hr />
      <H2>Logs</H2>

      <LogsTimeline
        logs={todo.logs}
        renderLogCard={false}
        shouldPaginate={true}
        pageSize={8}
      />
    </Page>
  );
};

export const Comment = ({ comment }) => {
  if (!comment) return null;
  return (
    <Card
      title={
        <Util.Row align="between" style={{ width: "100%" }}>
          <Util.Row gap={1}>
            {comment?.user?.id ? (
              <Avatar
                dicebear
                size="sm"
                initials={comment?.user?.id || "EventPilot"}
              />
            ) : (
              <Avatar src={logo} size="sm" initials="EP" />
            )}
            <b>{comment?.user?.name || "EventPilot"}</b>
          </Util.Row>
          <span className="text-secondary">
            {moment(comment.createdAt).fromNow()} (
            {moment(comment.createdAt).format("M/D/YY, h:mm a")})
          </span>
        </Util.Row>
      }
      style={{ marginBottom: 8 }}
    >
      {comment.text}
    </Card>
  );
};
