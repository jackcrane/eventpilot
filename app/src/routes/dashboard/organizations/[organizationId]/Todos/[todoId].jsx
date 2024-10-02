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
} from "tabler-react-2";
const { H2, Text, H3 } = Typography;
import { Todo } from "../../../../../components/todo";
import { useTodo } from "../../../../../hooks/useTodo";
import { Loading } from "../../../../../components/loading";
import { Spinner } from "tabler-react-2/dist/spinner";
import { DatePicker } from "../../../../../components/dateTimeWithZone";
import { IconMessagesOff } from "@tabler/icons-react";
import { Alert } from "tabler-react-2/dist/alert";
import { Button } from "tabler-react-2/dist/button";
import { LogsTimeline } from "../../../../../components/logs";
import { Avatar } from "tabler-react-2/dist/avatar";
import moment from "moment";
import toast, { Toaster } from "react-hot-toast";

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
      <H2>Todo Details</H2>
      <Todo todoItem={todo} showsDropdown={false} />
      <Util.Hr />
      <Util.Row style={{ alignItems: "flex-start" }} gap={1}>
        <Util.Col style={{ width: "50%" }} gap={1}>
          <div>
            <H2>Edit this todo</H2>
            <Text>Stage</Text>
            <Util.Row gap={1}>
              <DropdownInput
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
          <Input label="Title" value={title} onChange={(e) => setTitle(e)} />
          <Form.Autosize
            title="Text"
            value={text}
            onChange={(e) => setText(e)}
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
          />
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={setDueDate}
            timezoneValue={{ id: dueDateTz }}
            onTimezoneChange={(e) => setDueDateTz(e.id)}
          />
          <Util.Spacer size={1} />
          <Button onClick={handleSubmit} loading={updateLoading}>
            Save Changes
          </Button>
        </Util.Col>
        <Util.Col style={{ width: "50%" }}>
          <H2>Comments</H2>
          {todo.comments.length === 0 && (
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
          >
            Add comment
          </Button>
          <Util.Hr />
          <div style={{ maxHeight: "90vh", overflowY: "auto" }}>
            {todo.comments.map((comment) => (
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
            <Avatar
              dicebear
              size="sm"
              initials={comment?.user?.id || "EventPilot"}
            />
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
