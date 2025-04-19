//
// client/src/components/Inputcell/index.jsx

import { useState, useEffect } from "react";
import MyDatePicker from "../MyDatePicker";
import styles from "./styles.module.css";

// Reusable input + labels
// Dont use arrow functions for toggles and selects
// Selects is affected by "disabled" only

const InputCell = ({
  label,
  value,
  onChange,
  onBlur,
  readOnly = false,
  disabled = false,
  type = "text",
  min,
  max,
  step,
  options = [], // For <select> options
  autofocus = false,
  required = false,
  onClick,
}) => {
  const [inputValue, setInputValue] = useState(value ?? "");

  useEffect(() => {
    setInputValue(type === "number" ? String(value ?? "") : value ?? "");
  }, [value, type]);

  const handleChange = (e) => {
    let newValue = e.target.value;

    if (type === "number") {
      newValue = newValue === "" ? "" : Number(newValue);
      // Block invalid entries based on min/max
      // if (min !== undefined && newValue < min) newValue = min;
      // if (max !== undefined && newValue > max) newValue = max;
    }

    setInputValue(newValue);
    if (onChange) onChange(newValue);
  };

  // Handle onBlur event (when input loses focus)
  const handleBlur = () => {
    if (onBlur) {
      onBlur(inputValue); // Call the parent component's onBlur handler
    }
  };
  const handleToggleChange = () => {
    const newValue = !inputValue;
    setInputValue(newValue);
    if (onChange) onChange(newValue);
    if (onBlur) onBlur(newValue);
  };

  return (
    <div className={styles.modalCellGroup}>
      {/* Label with cell's title */}
      <label className={styles.modalCellGroupLabel}>{label}</label>

      {type === "date" ? (
        <MyDatePicker
          required_date={inputValue}
          onChange={(newDate) => {
            setInputValue(newDate); // update internal state
            if (onChange) onChange(newDate);
          }}
          onBlur={() => {
            if (onBlur) onBlur(inputValue);
          }}
          readOnly={readOnly}
        />
      ) : type === "toggle" ? (
        <div className={`${styles.toggleButtonInputContainer}`}>
          <label className={styles.toggleButton}>
            <input
              className={styles.toggleButtonInput}
              type="checkbox"
              checked={inputValue}
              onChange={handleToggleChange}
              onBlur={handleBlur}
              readOnly={readOnly}
              disabled={disabled}
            />
            <span className={`${styles.slider} ${styles.rounded}`} />
          </label>
        </div>
      ) : type === "select" ? (
        <select
          className={styles.modalCellGroupInput}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={readOnly}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className={`${styles.modalCellGroupInput} ${
            onClick ? styles.clickable : ""
          }`}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onClick={onClick}
          readOnly={readOnly}
          disabled={disabled}
          autoFocus={autofocus}
          required={required}
          autoComplete="off"
          placeholder="--"
          {...(type === "number"
            ? { min, max, step, inputMode: "numeric" }
            : {})}
        />
      )}
    </div>
  );
};

export default InputCell;
