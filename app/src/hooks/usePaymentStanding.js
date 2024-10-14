import React, { useState, useEffect } from "react";
import { authFetch } from "../util/url";

export const usePaymentStanding = (orgId) => {
  const [inGoodPaymentStanding, setPaymentStanding] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPaymentStanding = async () => {
    setLoading(true);
    const res = await authFetch(`/orgs/${orgId}/payment/standing`);
    const data = await res.json();
    setPaymentStanding(data.isInGoodPaymentStanding);
    setLoading(false);
  };

  useEffect(() => {
    fetchPaymentStanding();
  }, []);

  return { inGoodPaymentStanding, loading, refetch: fetchPaymentStanding };
};
