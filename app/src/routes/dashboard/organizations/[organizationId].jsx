import React from "react";
import { useParams } from "react-router-dom";
import { useOrg } from "../../../hooks/useOrg";
import { Loading } from "../../../components/loading";
import { Typography, Util } from "tabler-react-2";
import { Page } from "../../../components/page";
import { Timeline } from "tabler-react-2/dist/timeline";
import { useLogs } from "../../../hooks/useLogs";
const { H1, H4, Text } = Typography;
import moment from "moment";
import { switchLogTypes } from "../../../util/logTypes";
import DiffViewer from "react-diff-viewer";
import style from "./orgs.module.css";
import Badge from "tabler-react-2/dist/badge";
import {
  IconArrowRightRhombus,
  IconBracketsContain,
  IconBuilding,
  IconCategory,
  IconCategory2,
  IconDelta,
  IconEye,
  IconForms,
  IconKey,
  IconMail,
  IconMap2,
  IconMapPin,
  IconMapPins,
  IconRotateDot,
  IconTrademark,
  IconZip,
} from "@tabler/icons-react";

export const OrganizationHome = () => {
  const { organizationId } = useParams();
  const { org, loading } = useOrg(organizationId);
  const { logs, loading: logsLoading } = useLogs(organizationId);

  if (loading) {
    return <Loading />;
  }

  return (
    <Page
      sidenavItems={[
        {
          type: "item",
          href: `/${org.id}`,
          text: `Org Home`,
          active: true,
        },
        {
          type: "item",
          href: `/${org.id}/logs`,
          text: "Logs",
        },
        { type: "item", href: "/dashboard/events", text: "Events" },
        { type: "divider" },
        { type: "item", href: "/dashboard/billing", text: "Billing" },
        { type: "item", href: "/dashboard/support", text: "Support" },
      ]}
    >
      <H1>{org.name}</H1>
      {!logsLoading && (
        <Timeline
          events={
            logs.map((log) => ({
              title: switchLogTypes(log.type).text,
              time: `${moment(log.createdAt).fromNow()} (${moment(
                log.createdAt
              ).format("M/D/YY, h:mm a")}) by ${
                log.user?.name || "EventPilot"
              }`,
              icon: switchLogTypes(log.type).icon,
              iconBgColor: switchLogTypes(log.type).color,
              description: (
                <ObjectDiffViewer
                  oldObj={log.data.diff.from}
                  newObj={log.data.diff.to}
                  original={log}
                />
              ),
            })) || []
          }
        />
      )}
    </Page>
  );
};

// Helper function to check if a value is an object
const isObject = (value) => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const ObjectDiffViewer = ({ oldObj, newObj, original }) => {
  // Recursive function to generate diff data
  const generateDiff = (oldObj, newObj, parentKey = "") => {
    const diffData = [];

    // Iterate over keys in oldObj and newObj
    const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

    allKeys.forEach((key) => {
      const oldValue = oldObj[key] || "";
      const newValue = newObj[key] || "";
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

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
                    color={oldValue.toString().length === 0 ? "muted" : "red"}
                  >
                    {oldValue.toString().length === 0
                      ? "(empty)"
                      : fmt(oldValue.toString())}
                  </Badge>
                  <IconArrowRightRhombus color="#9ba9be" />
                  <Badge
                    soft
                    color={newValue.toString().length === 0 ? "muted" : "green"}
                  >
                    {newValue.toString().length === 0
                      ? "(empty)"
                      : fmt(newValue.toString())}
                  </Badge>
                </Util.Row>
              </div>
            </Util.Row>
            <Util.Spacer size={0.5} />
          </div>
        );
      }
    });

    return <span data-original={JSON.stringify(original)}>{diffData}</span>;
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
    default:
      return <IconDelta size={18} data-unhandledAttr={attr} />;
  }
};

const fmt = (str) => {
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
  return str;
};
