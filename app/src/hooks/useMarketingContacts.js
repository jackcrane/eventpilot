import React, { useState, useEffect } from "react";
import { authFetch } from "../util/url";

export const useContacts = (orgId) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    setLoading(true);
    const res = await authFetch(`/orgs/${orgId}/marketingContacts`);
    const { data } = await res.json();
    setContacts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return { contacts, loading, refetch: fetchContacts };
};
