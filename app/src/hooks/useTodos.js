import React, { useState, useEffect } from "react";
import { authFetch } from "../util/url";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useTodos = (orgId, { limit = 1000, offset = 0 }) => {
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ count: 0 });
  const navigate = useNavigate();

  const fetchTodos = async () => {
    if (!orgId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await authFetch(
        `/orgs/${orgId}/todos?limit=${limit}&offset=${offset}`
      );
      if (!response.ok) {
        setError("Failed to fetch todos");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setTodos(data.data);
      setMeta(data.meta);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch todos");
      setLoading(false);
    }
  };

  const updateTodoStage = async (todoId, stage) => {
    try {
      // Optimistically update the todo stage
      const originalTodos = [...todos];
      const updatedTodos = todos.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, stage };
        }
        return todo;
      });
      setTodos(updatedTodos);

      const response = await authFetch(`/orgs/${orgId}/todos/${todoId}`, {
        method: "PATCH",
        body: JSON.stringify({ stage }),
      });
      if (!response.ok) {
        toast.error("Failed to update todo");
        setTodos(originalTodos);
        return;
      }

      await fetchTodos();
    } catch (error) {
      setError("Failed to update todo");
    }
  };

  const createTodo = async () => {
    try {
      setCreateLoading(true);
      const response = await authFetch(`/orgs/${orgId}/todos`, {
        method: "POST",
      });
      if (!response.ok) {
        toast.error("Failed to create todo");
        setCreateLoading(false);
        return;
      }
      const data = await response.json();
      setCreateLoading(false);
      navigate(`/dashboard/organizations/${orgId}/todos/${data.id}`);
    } catch (error) {
      setError("Failed to create todo");
      setCreateLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [orgId]);

  return {
    loading,
    todos,
    error,
    meta,
    createTodo,
    createLoading,
    refetch: fetchTodos,
    updateTodoStage,
  };
};
