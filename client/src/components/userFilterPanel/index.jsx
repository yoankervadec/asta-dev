//
// client/src/components/userFilterPanel/index.jsx

import styles from "./styles.module.css";

const UserFilterPanel = ({ filters, setFilters }) => {
  const toggleFilter = (key) => {
    setFilters({
      [key]:
        filters[key] === "true"
          ? "false"
          : filters[key] === "false"
          ? ""
          : "true",
    });
  };

  return (
    <div className={styles.userFilterContainer}>
      <button
        className={`regular-btn ${
          filters.quote === "true"
            ? styles.active
            : filters.quote === "false"
            ? styles.innactive
            : ""
        }`}
        onClick={() => toggleFilter("quote")}
        title="Yes: filters all Quotes, canceled or not. No: removes all Quotes"
      >
        Quote
      </button>

      <button
        className={`regular-btn ${
          filters.posted === "true"
            ? styles.active
            : filters.posted === "false"
            ? styles.innactive
            : ""
        }`}
        onClick={() => toggleFilter("posted")}
        title="Yes: filters Posted orders only. No: removes Posted orders."
      >
        Posted
      </button>
    </div>
  );
};

export default UserFilterPanel;
