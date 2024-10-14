import React from "react";
import { usePaymentStanding } from "../hooks/usePaymentStanding";
import { Link, useParams } from "react-router-dom";
import { Alert } from "tabler-react-2/dist/alert";
import { IconCreditCardOff } from "@tabler/icons-react";
import { Button } from "tabler-react-2/dist/button";

export const PaymentStanding = () => {
  const { organizationId } = useParams();
  const { inGoodPaymentStanding, loading } = usePaymentStanding(organizationId);

  const currentUrl = window.location.pathname;

  if (loading) {
    return null;
  }

  if (inGoodPaymentStanding) return null;

  if (currentUrl.includes("billing")) return null;

  return (
    <Alert
      variant="danger"
      title="Set up payment information"
      icon={<IconCreditCardOff />}
    >
      Your organization is not in good payment standing or does not have payment
      information set up. Until you set up payment information, you will not be
      able to use many core features of the platform, including creating events,
      sending correspondence, tracking mailing lists, recruiting and managing
      volunteers, and more.
      <br />
      <br />
      We offer a 30-day free trial to help get you off the ground. After that,
      you will be billed monthly for your usage as explained in{" "}
      <Link to="/pricing">our pricing page</Link>.
      <br />
      <br />
      <Button
        outline
        variant="danger"
        href={`/dashboard/organizations/${organizationId}/billing`}
      >
        Set up billing information
      </Button>
    </Alert>
  );
};
