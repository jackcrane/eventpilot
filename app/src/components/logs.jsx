import React, { useEffect, useState } from "react";
import { Util, Button } from "tabler-react-2";
import { IconPlaylistAdd } from "@tabler/icons-react";
import { Timeline } from "tabler-react-2/dist/timeline";
import moment from "moment";
import { switchLogTypes, switchLogTypesForContent } from "../util/logTypes";
import { Typography } from "tabler-react-2";
const { Text } = Typography;

export const LogsTimeline = ({ logs, org, promptMore = false }) => {
  const [logsToRender, setLogsToRender] = useState([]);

  useEffect(() => {
    const _logsToRender = [
      ...[
        ...(logs.map((log) => ({
          title: switchLogTypes(log.type).text,
          time: `${moment(log.createdAt).fromNow()} (${moment(
            log.createdAt
          ).format("M/D/YY, h:mm a")}) by ${log.user?.name || "EventPilot"}`,
          icon: switchLogTypes(log.type).icon,
          iconBgColor: switchLogTypes(log.type).color,
          description: switchLogTypesForContent(log),
        })) || []),
      ],
    ];

    if (promptMore)
      _logsToRender.push({
        title: "More logs available",
        time: "",
        icon: IconPlaylistAdd,
        iconBgColor: "gray",
        description: (
          <>
            <Text>
              There are many more logs available on the logs page.
              <Util.Spacer size={1} />
              <Button href={`/dashboard/organizations/${org.id}/logs`}>
                View all logs
              </Button>
            </Text>
          </>
        ),
      });

    setLogsToRender(_logsToRender);
  }, [logs]);
  return <Timeline events={logsToRender} />;
};
