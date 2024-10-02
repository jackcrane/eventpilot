import React, { useState, useEffect } from "react";
import { Input, Util, DropdownInput } from "tabler-react-2";

const TIMEZONES = [
  { id: "America/New_York", label: "Eastern Time", offset: -4 },
  { id: "America/Chicago", label: "Central Time", offset: -5 },
  { id: "America/Denver", label: "Mountain Time", offset: -6 },
  { id: "America/Los_Angeles", label: "Pacific Time", offset: -7 },
  { id: "America/Anchorage", label: "Alaska Time", offset: -8 },
  { id: "Pacific/Honolulu", label: "Hawaii Time", offset: -10 },
];

export const DatePicker = ({
  label,
  timezoneValue,
  onChange,
  onTimezoneChange,
  value, // should be a Date object
  ...props
}) => {
  const [timezone, setTimezone] = useState(timezoneValue || TIMEZONES[0]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Sync input field when value (Date object) changes
    if (value instanceof Date) {
      const localDateString = toLocalDateString(value, timezone.offset);
      setInputValue(localDateString);
    }
  }, [value, timezone]);

  const handleTimezoneChange = (selectedTimezone) => {
    setTimezone(selectedTimezone);
    onTimezoneChange && onTimezoneChange(selectedTimezone);
  };

  const handleDateChange = (event) => {
    console.log(event);
    const inputTime = event;
    const parsedDate = parseDateFromInput(inputTime);
    const correctedDate = adjustForTimezone(parsedDate, timezone.offset);
    setInputValue(inputTime); // update input field
    onChange && onChange(correctedDate); // fire with corrected Date object
  };

  const adjustForTimezone = (date, timezoneOffset) => {
    // Convert date to UTC and then apply timezone offset
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const correctedDate = new Date(
      utcDate.getTime() + timezoneOffset * 3600000
    );
    return correctedDate;
  };

  const toLocalDateString = (date, timezoneOffset) => {
    const utcDate = new Date(date.getTime() + timezoneOffset * 3600000);
    return utcDate.toISOString().slice(0, 16); // Format as "YYYY-MM-DDTHH:mm"
  };

  const parseDateFromInput = (input) => {
    // Parse "YYYY-MM-DDTHH:mm" format into a Date object
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
