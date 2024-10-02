import React, { useEffect, useState } from "react";
import { useTodos } from "../hooks/useTodos";
import { Link, useParams } from "react-router-dom";
import { Card, Typography, Util, DropdownInput } from "tabler-react-2";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from "./todo.module.css";
import classNames from "classnames";
import {
  IconPointFilled,
  IconProgress,
  IconProgressAlert,
  IconProgressBolt,
  IconProgressCheck,
  IconProgressDown,
  IconProgressHelp,
  IconProgressX,
} from "@tabler/icons-react";
import { Ribbon } from "tabler-react-2/dist/ribbon";
import { useTodo } from "../hooks/useTodo";

export const Todos = ({ isSmall = false }) => {
  const { organizationId } = useParams();
  const { todos, updateTodoStage } = useTodos(organizationId, {});

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return; // If dropped outside droppable area, ignore

    // If dropped in the same place, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Update the todo's stage based on the droppable area it was dropped in
    updateTodoStage(draggableId, destination.droppableId);
  };

  return (
    <TodoKanban
      todos={todos}
      isSmall={isSmall}
      showAllStages={!isSmall}
      onDragEnd={handleDragEnd}
    />
  );
};

const switchStageForColor = (stage) => {
  switch (stage) {
    case "OPEN":
      return {
        color: "primary",
        text: "Open",
        icon: <IconProgress />,
        class: styles.primary,
      };
    case "IN_PROGRESS":
      return {
        color: "yellow",
        text: "In Progress",
        icon: <IconProgressBolt />,
        class: styles.yellow,
      };
    case "COMPLETE":
      return {
        color: "green",
        text: "Complete",
        icon: <IconProgressCheck />,
        class: styles.green,
      };
    case "BLOCKED":
      return {
        color: "danger",
        text: "Blocked",
        icon: <IconProgressAlert />,
        class: styles.danger,
      };
    case "WAITING":
      return {
        color: "purple",
        text: "Waiting",
        icon: <IconProgressHelp />,
        class: styles.purple,
      };
    case "WONT_DO":
      return {
        color: "secondary",
        text: "Won't Do",
        icon: <IconProgressX />,
        class: styles.secondary,
      };
    default:
      return { color: "secondary" };
  }
};

export const Todo = ({
  todoItem,
  showsDescription = true,
  showsRibbon = true,
  showsTodoLink = true,
  showsDropdown = true,
  isInKanban = false,
}) => {
  const { organizationId } = useParams();
  const [stage, setStage] = useState({});

  const { todo, updateTodoStage, refetch } = useTodo(
    organizationId,
    todoItem.id,
    {
      todoItem,
      selfRefreshing: true,
    }
  );

  useEffect(() => {
    refetch();
  }, [todoItem]);

  return (
    <Card
      variant={switchStageForColor(todo.stage).color}
      style={{
        marginBottom: isInKanban ? 4 : 0,
        backgroundColor: todo.deleted ? "#f8d7da" : "",
      }}
    >
      {showsRibbon && (
        <Ribbon
          color={switchStageForColor(todo.stage).color}
          position={"bottom"}
          content={
            switchStageForColor(todo.stage).icon
              ? switchStageForColor(todo.stage).icon
              : null
          }
        />
      )}
      <Util.Row align="between">
        <Typography.H3>{todo.title}</Typography.H3>
        {showsDropdown && !todo.deleted && (
          <DropdownInput
            prompt=""
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
            value={{ id: todo.stage }}
            onChange={(val) => {
              updateTodoStage(val.id);
            }}
          />
        )}
      </Util.Row>
      {showsDescription && <Typography.Text>{todo.text}</Typography.Text>}
      <Util.Row gap={1}>
        <Link
          to={`/dashboard/organizations/${organizationId}/todos/${todo.id}`}
        >
          View Todo Details
        </Link>
        {todo.href && showsTodoLink && (
          <>
            <IconPointFilled height={16} style={{ opacity: 0.5 }} />
            <Link to={todo.href}>This task has a link. Click to follow</Link>
          </>
        )}
      </Util.Row>
    </Card>
  );
};

const TodoKanban = ({ todos, showAllStages = true, onDragEnd, isSmall }) => {
  const allStages = [
    "OPEN",
    "IN_PROGRESS",
    "BLOCKED",
    "WAITING",
    "COMPLETE",
    "WONT_DO",
  ];
  const primaryStages = ["OPEN", "IN_PROGRESS", "COMPLETE"];
  const remainingStages = allStages.filter(
    (stage) => !primaryStages.includes(stage)
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.todoKanbanContainerScroller}>
        <div className={styles.todoKanbanContainer} gap={1}>
          {[...primaryStages, ...(showAllStages ? remainingStages : [])].map(
            (stage) => {
              return (
                <Card
                  key={stage}
                  title={switchStageForColor(stage).text}
                  style={{ width: 300, height: isSmall ? "70vh" : "90vh" }}
                  className={classNames(
                    styles.stripeBg,
                    switchStageForColor(stage).class,
                    "scrollable"
                  )}
                >
                  <Droppable droppableId={stage}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{ width: "100%", height: "100%" }}
                        className={styles.droppableContainer}
                      >
                        {todos
                          .filter((todo) => todo.stage === stage)
                          .map((todo, index) => (
                            <Draggable
                              key={todo.id}
                              draggableId={todo.id.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Todo
                                    todoItem={todo}
                                    isInKanban={true}
                                    showsDescription={false}
                                    showsDropdown={false}
                                    showsTodoLink={false}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Card>
              );
            }
          )}
          {!showAllStages && (
            <Util.Col gap={1}>
              {remainingStages.map((stage) => (
                <Card
                  key={stage}
                  title={switchStageForColor(stage).text}
                  style={{
                    width: 300,
                    height: `calc(${70 / 3}vh - ${5.3}px)`,
                  }}
                  className={classNames(
                    styles.stripeBg,
                    switchStageForColor(stage).class,
                    "scrollable"
                  )}
                >
                  <Droppable droppableId={stage}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        className={styles.droppableContainer}
                      >
                        {todos
                          .filter((todo) => todo.stage === stage)
                          .map((todo, index) => (
                            <Draggable
                              key={todo.id}
                              draggableId={todo.id.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Todo
                                    todoItem={todo}
                                    isInKanban={true}
                                    showsDescription={false}
                                    showsDropdown={false}
                                    showsTodoLink={false}
                                    style={{
                                      marginBottom: 4,
                                    }}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Card>
              ))}
            </Util.Col>
          )}
        </div>
      </div>
    </DragDropContext>
  );
};
