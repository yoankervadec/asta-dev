//
// client/src/components/MyDatePicker/index.jsx

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../Inputcell/styles.module.css";

const MyDatePicker = ({ required_date, onChange, onBlur, readOnly }) => {
  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    const parsedDate = new Date(dateStr);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const [date, setDate] = useState(normalizeDate(required_date));

  useEffect(() => {
    setDate(normalizeDate(required_date)); // Update when required_date changes
  }, [required_date]);

  const weekend = (selectedDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  const formatDate = (date) => date.toISOString().split("T")[0];

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    if (onChange) onChange(formatDate(selectedDate));
  };

  return (
    <div className={styles.datePicker}>
      <DatePicker
        selected={date}
        onChange={handleDateChange}
        onCalendarClose={() => onBlur && onBlur(date)}
        filterDate={weekend}
        dateFormat="yyyy-MM-dd"
        disabled={readOnly}
      />
    </div>
  );
};

export default MyDatePicker;
