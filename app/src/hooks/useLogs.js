import React, { useState, useEffect } from "react";
import { authFetch } from "../util/url";

export const useLogs = (orgId, { limit = 1000, offset = 0 }) => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ count: 0 });

  const fetchLogs = async (shouldSetLoading = true) => {
    if (!orgId) {
      setLoading(false);
      return;
    }
    shouldSetLoading && setLoading(true);
    try {
      const response = await authFetch(
        `/orgs/${orgId}/logs?limit=${limit}&offset=${offset}`
      );
      if (!response.ok) {
        setError("Failed to fetch logs");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setLogs(data.data);
      setMeta(data.meta);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch logs");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    window.EventPilot__refetchAllLogs__internal = fetchLogs;
  }, [orgId]);

  return { loading, logs, error, meta, refetch: fetchLogs };
};
