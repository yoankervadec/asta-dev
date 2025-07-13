//
// client/src/pages/DashBoard/JobBoard/components/JobBoardFilterPannel/index.jsx

import {
  TrueFalseNullFilterButton,
  TrueFalseNullFilterSelect,
  DropDownFilter,
} from "./FilterComponents";

import styles from "../../../styles.module.css";

const JobBoardFilterPannel = ({ filters, setFilters }) => {
  return (
    <div
      className="border-shadow"
      style={{
        marginInline: "0.5em",
        padding: "0.5em",
        position: "sticky",
        top: "0",
        zIndex: "2",
      }}
    >
      <div className={styles.filterPannelContainer}>
        <TrueFalseNullFilterSelect
          filterLabel="Show canceled lines"
          value={filters.hasCanceledLines}
          onChange={(val) => setFilters({ hasCanceledLines: val })}
          styles={styles}
        />
        <TrueFalseNullFilterButton
          filterLabel="Show fulfilled lines"
          value={filters.hasFulfilledLines}
          onChange={(val) => setFilters({ hasFulfilledLines: val })}
          styles={styles}
        />
        <TrueFalseNullFilterButton
          filterLabel="Show quotes"
          value={filters.showQuotes}
          onChange={(val) => setFilters({ showQuotes: val })}
          styles={styles}
        />
        <TrueFalseNullFilterButton
          filterLabel="Show posted orders"
          value={filters.showPostedOrders}
          onChange={(val) => setFilters({ showPostedOrders: val })}
          styles={styles}
        />
        <DropDownFilter
          filterLabel="Wood type"
          value={filters.woodType}
          options={[
            { value: 1, label: "Pin" },
            { value: 2, label: "Pruche" },
            { value: 3, label: "Erable" },
            { value: 4, label: "Cedre" },
          ]}
          onChange={(val) => setFilters({ woodType: val })}
          styles={styles}
        />
      </div>
    </div>
  );
};

export default JobBoardFilterPannel;
