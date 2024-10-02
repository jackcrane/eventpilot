import React, { useEffect, useState } from "react";
import { Util, Button } from "tabler-react-2";
import { IconPlaylistAdd } from "@tabler/icons-react";
import { Timeline } from "tabler-react-2/dist/timeline";
import moment from "moment";
import { switchLogTypes, switchLogTypesForContent } from "../util/logTypes";
import { Typography } from "tabler-react-2";
const { Text } = Typography;

export const LogsTimeline = ({
  logs,
  org,
  promptMore = false,
  renderLogCard = true,
  shouldPaginate = false,
  pageSize = 15,
}) => {
  const [logsToRender, setLogsToRender] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let _logsToRender = logs.map((log) => ({
      title: switchLogTypes(log.type).text,
      time: `${moment(log.createdAt).fromNow()} (${moment(log.createdAt).format(
        "M/D/YY, h:mm a"
      )}) by ${log.user?.name || "EventPilot"}`,
      icon: switchLogTypes(log.type).icon,
      iconBgColor: switchLogTypes(log.type).color,
      description: switchLogTypesForContent(log, renderLogCard),
    }));

    if (shouldPaginate) {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      _logsToRender = _logsToRender.slice(startIndex, endIndex);
    }

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
  }, [logs, currentPage, shouldPaginate, pageSize]);

  const PaginationButtons = () => {
    return (
      <>
        {shouldPaginate && logs.length > pageSize && (
          <Util.Row gap={1} style={{ marginTop: "1rem" }}>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev * pageSize < logs.length ? prev + 1 : prev
                )
              }
              disabled={currentPage * pageSize >= logs.length}
            >
              Next
            </Button>
            <span>
              On page {currentPage} of {Math.ceil(logs.length / pageSize)},
              showing logs{" "}
              {Math.min((currentPage - 1) * pageSize + 1, logs.length)} to{" "}
              {Math.min(currentPage * pageSize, logs.length)} of {logs.length}.
            </span>
          </Util.Row>
        )}
      </>
    );
  };

  return (
    <>
      <PaginationButtons />
      <Util.Spacer size={2} />
      <Timeline events={logsToRender} />
      <PaginationButtons />
    </>
  );
};
