import React, { useState, useEffect } from "react";
import { authFetch } from "../util/url";

export const usePayment = (orgId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayment = async () => {
    setLoading(true);
    const res = await authFetch(`/orgs/${orgId}/payment`);
    const data = await res.json();
    setData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPayment();
  }, []);

  return { data, loading, refetch: fetchPayment };
};
