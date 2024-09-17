import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loading } from "./loading";
import { Page } from "./page";
import { IconArrowLeft } from "@tabler/icons-react";
import { Typography, Util } from "tabler-react-2";
import { useUser } from "../util/UserProvider";
import Steps from "tabler-react-2/dist/steps";
const { H1, Text } = Typography;

export const NewOrganizationSkeleton = ({ children, activeStep }) => {
  const { user, loading } = useUser(true);

  const [searchParams] = useSearchParams();
  const orgId = searchParams.get("orgId");

  const orgIdUrl = orgId ? `?orgId=${orgId}` : "";

  if (loading) return <Loading />;

  return (
    <div>
      <Page>
        <Link to="/dashboard/organizations">
          <IconArrowLeft size={12} />
          Back to Organizations
        </Link>
        {orgId ? (
          <H1>Organization setup</H1>
        ) : (
          <H1>Create a new organization</H1>
        )}
        <Text>
          We just need the basics. You will be able to edit everything later.
          Creating a new organization does not publish any public content.
        </Text>
        <Steps
          steps={[
            {
              text: "Basic information",
              active: activeStep === 0,
              href:
                !orgId && activeStep === 0
                  ? null
                  : `/dashboard/organizations/new${orgIdUrl}`,
            },
            {
              text: "Legal details (optional)",
              active: activeStep === 1,
              href: !orgId ? null : `/dashboard/organizations/legal${orgIdUrl}`,
            },
            {
              text: "Marketing content",
              active: activeStep === 2,
              href: !orgId
                ? null
                : `/dashboard/organizations/marketing${orgIdUrl}`,
            },
            {
              text: "Invite your team",
              active: activeStep === 3,
              href: !orgId
                ? null
                : `/dashboard/organizations/invite${orgIdUrl}`,
            },
          ]}
          numbered
        />
        <Util.Spacer size={4} />
        {children}
      </Page>
    </div>
  );
};
