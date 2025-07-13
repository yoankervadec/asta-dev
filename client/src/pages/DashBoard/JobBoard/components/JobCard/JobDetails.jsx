//
// client/src/pages/DashBoard/JobBoard/components/JobDetails.jsx

import React from "react";

const JobDetails = ({ styles, data }) => {
  const { customer, orderTotals, orderInfo } = data;
  return (
    <div className={styles.jobDetailsContainer}>
      <div className={styles.jobContact}>
        <h3
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            marginTop: "0.25em",
          }}
        >
          <span>{customer?.name || ""}</span>
          <span>{`#${orderInfo?.orderNo || ""}`}</span>
        </h3>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            fontSize: "var(--fs-base)",
            opacity: "85%",
          }}
        >
          <span>{customer?.contact?.phone || ""}</span>
        </div>
      </div>
      {/* Products Tags (type, services?) */}
      <div className={styles.jobProductTags}>
        <span>Cedre</span>
        <span>Erable</span>
        <span>Pin</span>
      </div>
    </div>
  );
};

export default JobDetails;
