import { IconEdit, IconLogs } from "@tabler/icons-react";

export const switchLogTypes = (logType) => {
  switch (logType) {
    case "ORG_MODIFIED":
      return { text: "Organization Modified", icon: IconEdit, color: "blue" };
    default:
      return { text: "Log", icon: IconLogs, color: "gray" };
  }
};
