import React, { useState, useEffect } from "react";
import { authFetch } from "../util/url";

export const useEvents = (orgId) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ count: 0 });
  const [createEventLoading, setCreateEventLoading] = useState(false);

  const fetchEvents = async (shouldSetLoading = true) => {
    if (!orgId) {
      setLoading(false);
      return;
    }
    shouldSetLoading && setLoading(true);
    try {
      const response = await authFetch(`/orgs/${orgId}/events`);
      if (!response.ok) {
        setError("Failed to fetch events");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setEvents(data.data);
      setMeta(data.meta);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch events");
      setLoading(false);
    }
  };

  const createEvent = async () => {
    if (!orgId) return;
    setCreateEventLoading(true);
    try {
      const response = await authFetch(`/orgs/${orgId}/events`, {
        method: "POST",
      });
      if (!response.ok) {
        setError("Failed to create event");
        setCreateEventLoading(false);
        return;
      }
      const data = await response.json();
      setEvents((events) => [data, ...events]);
      setCreateEventLoading(false);
    } catch (error) {
      setError("Failed to create event");
      setCreateEventLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    window.EventPilot__refetchAllEvents__internal = fetchEvents;
  }, [orgId]);

  return {
    loading,
    events,
    error,
    meta,
    refetch: fetchEvents,
    createEvent,
    createEventLoading,
  };
};
