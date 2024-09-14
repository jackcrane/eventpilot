import React, { useState, useEffect } from "react";
import { authFetch } from "../util/url";

export const useOrg = (orgId) => {
  const [org, setOrg] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrg = async () => {
    console.log("Attempting to fetch org", orgId);
    if (!orgId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const response = await authFetch(`/orgs/${orgId}`);
    const data = await response.json();
    setOrg(data);
    setLoading(false);
  };

  const createOrg = async (orgData) => {
    if (orgId) throw new Error("Cannot create an org with an existing orgId");
    setLoading(true);
    const response = await authFetch(`/orgs`, {
      method: "POST",
      body: JSON.stringify(orgData),
    });
    if (response.ok) {
      const data = await response.json();
      setOrg(data);
      setError(null);
      setLoading(false);
      return [data, null];
    } else {
      const data = await response.json();
      setError(data.message);
      console.log(data.message);
      setLoading(false);
      return [null, data.message];
    }
    setLoading(false);
    return [response, error];
  };

  const updateOrg = async (orgData) => {
    if (!orgId) throw new Error("Cannot update an org without an orgId");
    setLoading(true);
    const response = await authFetch(`/orgs/${orgId}`, {
      method: "PUT",
      body: JSON.stringify(orgData),
    });
    if (response.ok) {
      const data = await response.json();
      setOrg(data);
      setError(null);
      setLoading(false);
      return [data, null];
    } else {
      const data = await response.json();
      setError(data.message);
      console.log(data.message);
      setLoading(false);
      return [null, data.message];
    }
    setLoading(false);
    return [response, error];
  };

  const upsert = async (orgData) => {
    if (orgId) {
      return updateOrg(orgData);
    }
    return createOrg(orgData);
  };

  useEffect(() => {
    fetchOrg();
  }, []);

  return {
    org,
    loading,
    refetch: fetchOrg,
    create: createOrg,
    error,
    update: updateOrg,
    upsert,
  };
};
