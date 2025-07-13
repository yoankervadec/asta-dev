//
// client/src/pages/DashBoard/JobBoard/components/JobBoardFilterPannel/FilterComponents.jsx

// true, false or null buttons
export const TrueFalseNullFilterButton = ({
  filterLabel,
  value,
  onChange,
  styles,
}) => {
  return (
    <div className={styles.filterButtonContainer} title={filterLabel}>
      <label>{filterLabel}&nbsp;: </label>
      <div className={styles.filterValue}>
        <button
          onClick={() => onChange(true)}
          className={`${styles.buttonValue} ${
            value === true ? styles.activeButtonValue : ""
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => onChange(false)}
          className={`${styles.buttonValue} ${
            value === false ? styles.activeButtonValue : ""
          }`}
        >
          No
        </button>
        <button
          onClick={() => onChange(null)}
          className={`${styles.buttonValue} ${
            value === null ? styles.activeButtonValue : ""
          }`}
        >
          Default
        </button>
      </div>
    </div>
  );
};

// Drop-down with true, false or null
export const TrueFalseNullFilterSelect = ({
  filterLabel,
  value,
  onChange,
  styles,
}) => {
  return (
    <div className={styles.filterButtonContainer} title={filterLabel}>
      <label>{filterLabel}: </label>
      <div className={styles.filterValue}>
        <select
          value={value === true ? "true" : value === false ? "false" : ""}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") onChange(null);
            else onChange(val === "true");
          }}
          className={styles.buttonValue}
        >
          <option value="">Default</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <button className={styles.buttonValue} onClick={() => onChange(null)}>
          Clear
        </button>
      </div>
    </div>
  );
};

// Drop-down with pre-defined values
export const DropDownFilter = ({
  filterLabel,
  value,
  options,
  onChange,
  styles,
}) => {
  return (
    <div className={styles.filterButtonContainer} title={filterLabel}>
      <label>{filterLabel}: </label>
      <div className={styles.filterValue}>
        <select
          value={value ?? ""}
          onChange={(e) =>
            onChange(e.target.value === "" ? null : Number(e.target.value))
          }
          className={styles.buttonValue}
        >
          <option value="">All</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
