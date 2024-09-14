import React, { useState, useEffect } from "react";
import { authFetch } from "../util/url";

export const useOrgs = () => {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrgs = async () => {
    setLoading(true);
    const res = await authFetch("/orgs");
    const data = await res.json();
    setOrgs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  return { orgs, loading, refetch: fetchOrgs };
};
