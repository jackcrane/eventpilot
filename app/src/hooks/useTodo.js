import React, { useState, useEffect } from "react";
import { authFetch } from "../util/url";
import toast from "react-hot-toast";

// Create a cache for storing fetched todos
const todoCache = new Map();

export const useTodo = (orgId, todoId, options = {}) => {
  const defaultData = options.defaultData || {};
  const dontTriggerLoadingOnStageUpdate =
    options.dontTriggerLoadingOnStageUpdate || false;
  const [loading, setLoading] = useState(true);
  const [stageLoading, setStageLoading] = useState(false);
  const [todo, setTodo] = useState(defaultData);
  const [error, setError] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchTodo = async (shouldTriggerLoading = true) => {
    if (!orgId || !todoId) {
      setLoading(false);
      return;
    }

    // Check if the todo is already in cache
    const cacheKey = `${orgId}-${todoId}`;
    if (todoCache.has(cacheKey)) {
      setTodo(todoCache.get(cacheKey));
      setLoading(false);
      return;
    }

    shouldTriggerLoading && setLoading(true);
    try {
      const response = await authFetch(`/orgs/${orgId}/todos/${todoId}`);
      if (!response.ok) {
        setError("Failed to fetch todo");
        setLoading(false);
        return;
      }
      const { data } = await response.json();

      // Store the data in cache
      todoCache.set(cacheKey, data);

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
      const originalTodo = { ...todo };
      setStageLoading(true);
      setTodo({ ...todo, stage });

      const response = await authFetch(`/orgs/${orgId}/todos/${todoId}`, {
        method: "PATCH",
        body: JSON.stringify({ stage }),
      });

      if (!response.ok) {
        toast.error("Failed to update todo");
        setTodo(originalTodo);
        return;
      }

      // Invalidate cache for this todo and refetch
      todoCache.delete(`${orgId}-${todoId}`);
      await fetchTodo(!dontTriggerLoadingOnStageUpdate);
      setStageLoading(false);
    } catch (error) {
      setError("Failed to update todo");
    }
  };

  const updateTodo = async (data) => {
    if (!orgId || !todoId) return;

    try {
      setUpdateLoading(true);
      const originalTodo = { ...todo };
      setTodo({ ...todo, ...data });

      const response = await authFetch(`/orgs/${orgId}/todos/${todoId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        toast.error("Failed to update todo");
        setTodo(originalTodo);
        setUpdateLoading(false);
        return;
      }

      // Invalidate cache for this todo and refetch
      todoCache.delete(`${orgId}-${todoId}`);
      await fetchTodo(false);
      setUpdateLoading(false);
    } catch (error) {
      setError("Failed to update todo");
      setUpdateLoading(false);
    }
  };

  const comment = async (comment) => {
    if (!orgId || !todoId) return;
    if (!comment) return;
    if (commentLoading) return;
    if (comment.length > 1000) {
      setCommentError(
        `Comment is too long (${comment.length}/1000 characters)`
      );
      return;
    }
    if (comment.length < 5) {
      setCommentError("Comment is too short (minimum 5 characters)");
      return;
    }

    try {
      setCommentLoading(true);
      const response = await authFetch(`/orgs/${orgId}/todos/${todoId}`, {
        method: "PUT",
        body: JSON.stringify({ text: comment }),
      });

      if (!response.ok) {
        setCommentError("Failed to comment on todo");
        return;
      }
      setCommentError(null);

      // Invalidate cache and refetch after commenting
      todoCache.delete(`${orgId}-${todoId}`);
      await fetchTodo(false);
      setCommentLoading(false);
      return true;
    } catch (error) {
      setError("Failed to comment on todo");
    }
  };

  const del = async () => {
    if (!orgId || !todoId) return;

    try {
      const response = await authFetch(`/orgs/${orgId}/todos/${todoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error("Failed to delete todo");
        return;
      }

      // Invalidate cache and refetch after deleting
      todoCache.delete(`${orgId}-${todoId}`);
      await fetchTodo(false);
    } catch (error) {
      setError("Failed to delete todo");
    }
  };

  useEffect(() => {
    fetchTodo();
  }, [orgId, todoId]);

  return {
    loading,
    stageLoading,
    todo,
    error,
    comment,
    commentLoading,
    commentError,
    update: updateTodo,
    updateLoading,
    del,
    refetch: fetchTodo,
    updateTodoStage,
  };
};
