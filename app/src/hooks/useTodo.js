import React, { useState, useEffect } from "react";
import { authFetch } from "../util/url";
import toast from "react-hot-toast";

export const useTodo = (orgId, todoId, options = {}) => {
  const defaultData = options.defaultData || {};
  const [loading, setLoading] = useState(true);
  const [todo, setTodo] = useState(defaultData);
  const [error, setError] = useState(null);

  const fetchTodo = async () => {
    if (!orgId || !todoId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await authFetch(`/orgs/${orgId}/todos/${todoId}`);
      if (!response.ok) {
        setError("Failed to fetch todo");
        setLoading(false);
        return;
      }
      const { data } = await response.json();
      setTodo(data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch todo");
      setLoading(false);
    }
  };

  const updateTodoStage = async (stage) => {
    if (!orgId || !todoId) return;

    try {
      // Optimistically update the todo stage
      const originalTodo = { ...todo };
      setTodo({ ...todo, stage });

      const response = await authFetch(`/orgs/${orgId}/todos/${todoId}`, {
        method: "PATCH",
        body: JSON.stringify({ stage }),
      });

      if (!response.ok) {
        toast.error("Failed to update todo");
        setTodo(originalTodo); // Revert to the original state if update fails
        return;
      }
      await fetchTodo();
    } catch (error) {
      setError("Failed to update todo");
    }
  };

  useEffect(() => {
    fetchTodo();
  }, [orgId, todoId]);

  return { loading, todo, error, refetch: fetchTodo, updateTodoStage };
};
