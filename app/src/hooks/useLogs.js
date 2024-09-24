import React, { useState, useEffect } from "react";
import { authFetch } from "../util/url";

export const useLogs = (orgId) => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    if (!orgId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await authFetch(`/orgs/${orgId}/logs`);
      if (!response.ok) {
        setError("Failed to fetch logs");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setLogs(data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch logs");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [orgId]);

  return { loading, logs, error, refetch: fetchLogs };
};
