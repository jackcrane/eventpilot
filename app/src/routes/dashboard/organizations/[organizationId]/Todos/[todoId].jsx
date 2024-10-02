import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { sidenavItems } from "..";
import { Page } from "../../../../../components/page";
import { Typography, Util, DropdownInput, Input, Form } from "tabler-react-2";
const { H2, Text, H4 } = Typography;
import { Todo } from "../../../../../components/todo";
import { useTodo } from "../../../../../hooks/useTodo";
import { Loading } from "../../../../../components/loading";
import { Spinner } from "tabler-react-2/dist/spinner";
import { DatePicker } from "../../../../../components/dateTimeWithZone";

export const TodoDetails = () => {
  const { organizationId, todoId } = useParams();
  const { todo, loading, updateTodoStage, stageLoading } = useTodo(
    organizationId,
    todoId,
    {
      dontTriggerLoadingOnStageUpdate: true,
    }
  );

  const [dueDate, setDueDate] = useState(new Date());

  if (loading) {
    return <Loading />;
  }

  return (
    <Page sidenavItems={sidenavItems(organizationId, "Todo List")}>
      <H2>Todo Details</H2>
      <Todo todoItem={todo} showsDropdown={false} />
      <Util.Hr />
      <Util.Row style={{ alignItems: "flex-start" }}>
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
          <Input label="Title" value={todo.title} />
          <Form.Autosize title="Text" value={todo.text} />
          <Input
            label={
              <>
                Embedded Link (
                <Typography.Link href={todo.href}>visit</Typography.Link>)
              </>
            }
            placeholder="You can add a link here."
          />
          <DatePicker label="Due Date" value={dueDate} onChange={setDueDate} />
          {JSON.stringify(dueDate)}
        </Util.Col>
        <Util.Col>
          <H2>Comments</H2>
        </Util.Col>
      </Util.Row>
    </Page>
  );
};
