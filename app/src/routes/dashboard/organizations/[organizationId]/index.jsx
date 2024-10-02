import React from "react";
import { Link, useParams } from "react-router-dom";
import { useOrg } from "../../../../hooks/useOrg";
import { Loading } from "../../../../components/loading";
import { Card, Typography, Util } from "tabler-react-2";
import { Page } from "../../../../components/page";
import { useLogs } from "../../../../hooks/useLogs";
const { H1, H2, Text } = Typography;
import DiffViewer from "react-diff-viewer";
import style from "../orgs.module.css";
import Badge from "tabler-react-2/dist/badge";
import {
  IconArrowRightRhombus,
  IconBracketsContain,
  IconBuilding,
  IconCalendarClock,
  IconCategory,
  IconCategory2,
  IconCopy,
  IconDelta,
  IconEye,
  IconForms,
  IconHeading,
  IconKey,
  IconLetterCase,
  IconLink,
  IconMail,
  IconMap2,
  IconMapPin,
  IconMapPins,
  IconOutlet,
  IconPlaylistAdd,
  IconPlus,
  IconRotateDot,
  IconTimezone,
  IconTrademark,
  IconTrash,
  IconZip,
} from "@tabler/icons-react";
import { Button } from "tabler-react-2/dist/button";
import { Todo, Todos } from "../../../../components/todo";
import { LogsTimeline } from "../../../../components/logs";
import { MarketingContactsChart } from "../../../../components/marketingContactsChart";

export const sidenavItems = (org, activeText) => {
  return [
    {
      type: "item",
      href: "/dashboard/organizations",
      text: "All Organizations",
    },
    { type: "divider" },
    {
      type: "item",
      href: `/dashboard/organizations/${org}`,
      text: `Org Home`,
      active: activeText === "Org Home",
    },
    {
      type: "item",
      href: `/dashboard/organizations/${org}/todos`,
      text: "Todo List",
      active: activeText === "Todo List",
    },
    {
      type: "item",
      href: `/dashboard/organizations/${org}/logs`,
      text: "Logs",
      active: activeText === "Logs",
    },
    { type: "divider" },
    {
      type: "item",
      href: `/dashboard/organizations/${org}/basics`,
      text: "Basic Information",
      active: activeText === "Basic Information",
    },
    {
      type: "item",
      href: `/dashboard/organizations/${org}/legal`,
      text: "Legal Information",
      active: activeText === "Legal Information",
    },
    {
      type: "item",
      href: `/dashboard/organizations/${org}/marketing`,
      text: "Marketing Information",
      active: activeText === "Marketing Information",
    },
    { type: "divider" },
    {
      type: "item",
      href: "/dashboard/billing",
      text: "Billing",
      active: activeText === "Billing",
    },
    {
      type: "item",
      href: "/dashboard/support",
      text: "Support",
      active: activeText === "Support",
    },
  ];
};

export const OrganizationHome = () => {
  const { organizationId } = useParams();
  const { org, loading } = useOrg(organizationId);
  const {
    logs,
    loading: logsLoading,
    meta,
  } = useLogs(organizationId, {
    limit: 5,
  });

  if (loading && org?.id) {
    return <Loading />;
  }

  return (
    <Page sidenavItems={sidenavItems(org.id, "Org Home")}>
      <H1 style={{ fontSize: 32 }}>{org.name}</H1>
      <Util.Hr />
      <MarketingContactsChart />
      <Util.Hr />
      <H1>Todo List</H1>
      <Typography.I>
        This is a trimmed-down todo list experience. To use the full-featured
        tool, use the{" "}
        <Link to={`/dashboard/organizations/${org.id}/todos`}>Todo List</Link>{" "}
        page.
      </Typography.I>
      <Util.Spacer size={1} />
      <Todos isSmall={true} />
      <Util.Hr />
      <H1>Logs</H1>
      {logs.length > 4 && (
        <>
          <Typography.I>
            Showing {logs.length} most recent of {meta.count} total logs.{" "}
            <Link to={`/dashboard/organizations/${org.id}/logs`}>
              View all logs
            </Link>
            .
          </Typography.I>
        </>
      )}
      <Util.Spacer size={1} />
      {logsLoading ? (
        <Loading />
      ) : (
        <>
          <LogsTimeline logs={logs} org={org} promptMore={true} />
        </>
      )}
    </Page>
  );
};

const ObjectDiffViewer = ({ oldObj, newObj, original }) => {
  // Utility function to check if a value is an object
  const isObject = (val) =>
    val && typeof val === "object" && !Array.isArray(val);

  // Recursive function to generate diff data
  const generateDiff = (oldObj, newObj, parentKey = "") => {
    const diffData = [];

    // Get all unique keys from both oldObj and newObj
    const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

    allKeys.forEach((key) => {
      const oldValue = oldObj[key];
      const newValue = newObj[key];
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      // Skip keys related to IDs or timestamps (uncomment to activate)
      if (fullKey.toLowerCase().includes("id")) {
        return;
      }
      if (fullKey.toLowerCase().includes("updatedat")) {
        return;
      }

      // Handle nested objects by recursively calling generateDiff
      if (isObject(oldValue) && isObject(newValue)) {
        const nestedDiff = generateDiff(oldValue, newValue, fullKey);
        if (nestedDiff.length > 0) {
          diffData.push(
            <div key={fullKey}>
              <div>{nestedDiff}</div>
              <Util.Spacer size={0.5} />
            </div>
          );
        }
      } else if (oldValue !== newValue) {
        // Handle null and empty string case
        const shouldSkipDiff =
          (oldValue === null && newValue === "") ||
          (oldValue === "" && newValue === null);

        if (shouldSkipDiff) {
          return;
        }

        // Handle case where only one is an object (added or removed)
        const oldDisplay = isObject(oldValue)
          ? "(object)"
          : oldValue || "(empty)";
        const newDisplay = isObject(newValue)
          ? "(object)"
          : newValue || "(empty)";

        // Only push sections where the old and new values differ
        diffData.push(
          <div key={fullKey}>
            <Util.Row gap={1}>
              {switchAttrForIcon(fullKey)}
              <h4 style={{ marginBottom: 0 }}>
                {convertCamelToSentenceCase(fullKey)}
              </h4>
              <div className={style.diffViewerReset}>
                <Util.Row wrap gap={1}>
                  <Badge
                    soft
                    color={oldDisplay === "(empty)" ? "muted" : "red"}
                  >
                    {fmt(oldDisplay)}
                  </Badge>
                  <IconArrowRightRhombus color="#9ba9be" />
                  <Badge
                    soft
                    color={newDisplay === "(empty)" ? "muted" : "green"}
                  >
                    {fmt(newDisplay)}
                  </Badge>
                </Util.Row>
              </div>
            </Util.Row>
            <Util.Spacer size={0.5} />
          </div>
        );
      }
    });

    return diffData;
  };

  return <div>{generateDiff(oldObj, newObj)}</div>;
};

export default ObjectDiffViewer;

const convertCamelToSentenceCase = (str) => {
  return str
    .replace(/\./g, " ") // Replace periods with spaces
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, function (str) {
      return str.toUpperCase(); // Capitalize the first letter
    });
};

const switchAttrForIcon = (attr) => {
  switch (attr) {
    case "updatedAt":
      return <IconRotateDot size={18} />;
    case "marketingPrimaryBannerImage.key":
      return <IconKey size={18} />;
    case "marketingPrimaryBannerImage.url":
      return <IconForms size={18} />;
    case "marketingPrimaryBannerImage.name":
      return <IconBracketsContain size={18} />;
    case "zip":
      return <IconZip size={18} />;
    case "city":
      return <IconBuilding size={18} />;
    case "state":
      return <IconMap2 size={18} />;
    case "addressLine1":
      return <IconMapPin size={18} />;
    case "addressLine2":
      return <IconMapPins size={18} />;
    case "category":
      return <IconCategory size={18} />;
    case "type":
      return <IconCategory2 size={18} />;
    case "legalName":
      return <IconTrademark size={18} />;
    case "legalContactEmail":
      return <IconMail size={18} />;
    case "addressPublic":
      return <IconEye size={18} />;
    case "stage":
      return <IconCopy size={18} />;
    case "href":
      return <IconLink size={18} />;
    case "slug":
      return <IconOutlet size={18} />;
    case "text":
      return <IconLetterCase size={18} />;
    case "title":
      return <IconHeading size={18} />;
    case "deleted":
      return <IconTrash size={18} />;
    case "dueDate":
      return <IconCalendarClock size={18} />;
    case "createdAt":
      return <IconPlus size={18} />;
    case "dueDateTimezone":
      return <IconTimezone size={18} />;
    default:
      return <IconDelta size={18} data-unhandledAttr={attr} />;
  }
};

const fmt = (str) => {
  if (str === true || str === false) {
    return str ? "true" : "false";
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  if (dateRegex.test(str)) {
    const date = new Date(str);
    return date.toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
  return ellipsize(str, 30);
};

const ellipsize = (str, length) => {
  // Put ellipsis in the middle of the string if it's too long
  if (str.length > length) {
    const halfLength = Math.floor(length / 2);
    return `${str.slice(0, halfLength)}...${str.slice(-halfLength)}`;
  }
  return str;
};
