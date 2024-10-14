import React, { useEffect } from "react";
import { useContacts } from "../hooks/useMarketingContacts";
import { Loading } from "./loading";
import { useParams } from "react-router-dom";
import ReactApexChart from "react-apexcharts";

export const MarketingContactsChart = () => {
  const { organizationId } = useParams();
  const { contacts, loading } = useContacts(organizationId);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <MarketingContactsOverTimeLineChart contacts={contacts} />
      <MarketingContactsHeatmap contacts={contacts} />
    </>
  );
};

const MarketingContactsOverTimeLineChart = ({ contacts }) => {
  // Group contacts by date, createdAt
  const groupedContacts = contacts.reduce((acc, contact) => {
    const date = new Date(contact.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += 1;
    return acc;
  }, {});

  const dates = Object.keys(groupedContacts);

  const series = [
    {
      name: "Marketing Contacts",
      data: dates.map((date) => [
        new Date(date).getTime(),
        groupedContacts[date],
      ]),
    },
  ];

  // Get current date and subtract 3 months
  const currentDate = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

  const options = {
    chart: {
      type: "area",
      fontFamily: "inherit",
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: true,
      },
      animations: {
        enabled: false,
      },
      colors: ["#206bc4"],
    },
    xaxis: {
      type: "datetime",
      tickAmount: 6,
      labels: {
        format: "MMM d 'yy",
      },
      min: threeMonthsAgo.getTime(), // Default zoom start: 3 months ago
      max: currentDate.getTime(), // Default zoom end: current date
    },
    yaxis: {
      title: {
        text: "Number of Contacts",
      },
    },
    stroke: {
      curve: "straight",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0,
        opacityFrom: 0.3,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      x: {
        format: "MMM dd, yyyy",
      },
    },
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={350}
    />
  );
};

export const MarketingContactsHeatmap = ({ contacts }) => {
  // Define age buckets
  const ageBuckets = [
    { label: "1940-1960", start: 1940, end: 1960 },
    { label: "1960-1980", start: 1960, end: 1980 },
    { label: "1980-2000", start: 1980, end: 2000 },
    { label: "2000-2020", start: 2000, end: 2020 },
  ];

  // Dynamically extract unique sources from contacts
  const sources = [...new Set(contacts.map((contact) => contact.source))];

  // Group contacts into the heatmap data
  const heatmapData = ageBuckets.map((bucket) => {
    const data = sources.map((source) => {
      const count = contacts.filter((contact) => {
        const birthYear = contact.birthyear;
        return (
          birthYear >= bucket.start &&
          birthYear < bucket.end &&
          contact.source === source
        );
      }).length;
      return count;
    });

    return {
      name: bucket.label,
      data,
    };
  });

  const highestValue = Math.max(
    ...heatmapData.map((bucket) => Math.max(...bucket.data))
  );

  const options = {
    chart: {
      type: "heatmap",
      fontFamily: "inherit",
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: highestValue, // Set a wide range to cover all values
              color: "#206bc4", // Single color for all values
            },
          ],
        },
      },
    },
    xaxis: {
      categories: sources, // Dynamically set x-axis categories as the sources
    },
    yaxis: {
      title: {
        text: "Age Buckets",
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `${val} contacts`,
      },
    },
    grid: {
      padding: {
        top: -20,
        right: 0,
        left: -4,
        bottom: -4,
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={heatmapData}
      type="heatmap"
      height={250}
    />
  );
};
