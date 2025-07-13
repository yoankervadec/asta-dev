//
// client/src/pages/DashBoard/JobBoard/components/JobHeader.jsx

import React from "react";
import { useModalNavigation } from "../../../../../hooks/useModalNavigation";

const JobHeader = ({ styles, data }) => {
  const { orderInfo, orderStatus } = data;

  const { syncOpenModal } = useModalNavigation();

  // Function to determine the color for the status
  const getStatusColor = (orderStatus) => {
    switch (orderStatus) {
      case "Quote":
        return "var(--status-quote)";
      case "Ready":
        return "var(--status-ready)";
      case "Waiting":
        return "var(--status-waiting)";
      case "Payment pending":
        return "var(--status-payment-pending)";
      case "Shipped with balance":
        return "var(--status-ready)";
      case "Processing":
        return "var(--status-processing)";
      default:
        return "var(--status-quote)";
    }
  };

  // Function to calculate the required date color
  const getRequiredDateColor = (requiredDate) => {
    const now = new Date();
    const requiredDateObj = new Date(requiredDate);
    const differenceInDays = (requiredDateObj - now) / (1000 * 60 * 60 * 24); // Difference in days

    if (differenceInDays > 5) {
      return "var(--required-date-future)"; // More than 5 days in the future - Green
    } else if (differenceInDays > 0) {
      return "var(--required-date-soon)"; // Between 0 and 5 days - Yellow
    } else {
      return "var(--required-date-past)"; // Past due - Red
    }
  };

  const statusColor = getStatusColor(orderStatus);
  const requiredDateColor = getRequiredDateColor(orderInfo.requiredDate);

  return (
    <div
      className={styles.jobHeaderContainer}
      title="Double click to open record"
      onDoubleClick={() =>
        syncOpenModal("customerOrderCard", { orderNo: orderInfo.orderNo })
      }
    >
      <div className={styles.statusContainer}>
        <span
          style={{ backgroundColor: requiredDateColor }}
          title="Required date"
        >
          <span>{orderInfo?.requiredDate || ""}</span>
        </span>
        <span style={{ backgroundColor: statusColor }} title="Status">
          {orderStatus || ""}
        </span>
      </div>
      <div className={styles.headerButtonsContainer}>
        <button className={styles.pinButton} title="Pin">
          <i className="fas fa-thumbtack"></i>
        </button>
      </div>
    </div>
  );
};

export default JobHeader;
