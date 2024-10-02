import React, { useState, useEffect } from "react";
import { Input, Util, DropdownInput } from "tabler-react-2";

const TIMEZONES = [
  { id: "America/New_York", label: "Eastern Time" },
  { id: "America/Chicago", label: "Central Time" },
  { id: "America/Denver", label: "Mountain Time" },
  { id: "America/Los_Angeles", label: "Pacific Time" },
  { id: "America/Anchorage", label: "Alaska Time" },
  { id: "Pacific/Honolulu", label: "Hawaii Time" },
  { id: "Europe/London", label: "Greenwich Mean Time" },
  { id: "Europe/Paris", label: "Central European Time" },
  { id: "Europe/Moscow", label: "Moscow Standard Time" },
  { id: "Asia/Dubai", label: "Gulf Standard Time" },
  { id: "Asia/Karachi", label: "Pakistan Standard Time" },
  { id: "Asia/Kolkata", label: "India Standard Time" },
  { id: "Asia/Bangkok", label: "Indochina Time" },
  { id: "Asia/Shanghai", label: "China Standard Time" },
  { id: "Asia/Tokyo", label: "Japan Standard Time" },
  { id: "Australia/Sydney", label: "Australian Eastern Time" },
  { id: "Pacific/Auckland", label: "New Zealand Standard Time" },
  { id: "Africa/Johannesburg", label: "South Africa Standard Time" },
  { id: "America/Sao_Paulo", label: "Brasilia Time" },
  { id: "America/Argentina/Buenos_Aires", label: "Argentina Time" },
  { id: "Atlantic/Azores", label: "Azores Time" },
  { id: "Africa/Cairo", label: "Eastern European Time" },
  { id: "Pacific/Tahiti", label: "Tahiti Time" },
  { id: "Asia/Seoul", label: "Korea Standard Time" },
];

export const DatePicker = ({
  label,
  timezoneValue,
  onChange,
  onTimezoneChange,
  value, // should be a Date object
  ...props
}) => {
  const [timezone, setTimezone] = useState(timezoneValue || null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setTimezone(timezoneValue);
  }, [timezoneValue]);

  useEffect(() => {
    if (value instanceof Date && timezone) {
      const localDateString = toLocalDateString(value, timezone.id);
      setInputValue(localDateString);
    }
  }, [value, timezone]);

  const handleTimezoneChange = (selectedTimezone) => {
    setTimezone(selectedTimezone);
    onTimezoneChange && onTimezoneChange(selectedTimezone);
  };

  const handleDateChange = (event) => {
    const inputTime = event;
    const parsedDate = parseDateFromInput(inputTime);
    const correctedDate = adjustForTimezone(parsedDate, timezone.id);
    setInputValue(inputTime); // update input field
    onChange && onChange(correctedDate); // fire with corrected Date object
  };

  const adjustForTimezone = (date, timeZone) => {
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const timeZoneDate = new Date(
      utcDate.toLocaleString("en-US", { timeZone })
    );
    return timeZoneDate;
  };

  const toLocalDateString = (date, timeZone) => {
    const formatter = new Intl.DateTimeFormat("sv-SE", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const dateString = `${parts.find((p) => p.type === "year").value}-${
      parts.find((p) => p.type === "month").value
    }-${parts.find((p) => p.type === "day").value}T${
      parts.find((p) => p.type === "hour").value
    }:${parts.find((p) => p.type === "minute").value}`;

    return dateString;
  };

  const parseDateFromInput = (input) => {
    return new Date(`${input}:00.000Z`);
  };

  return (
    <div className="mb-3" {...props}>
      {label && <label className="form-label">{label}</label>}
      <Util.Row gap={1} style={{ alignItems: "flex-start" }}>
        <Input
          type="datetime-local"
          style={{ flex: 1 }}
          value={inputValue}
          onChange={handleDateChange}
        />
        <DropdownInput
          prompt="Timezone"
          values={TIMEZONES}
          value={timezone}
          onChange={handleTimezoneChange}
        />
      </Util.Row>
    </div>
  );
};
