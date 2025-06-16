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

// customer
// :
// clientId
// :
// 135
// contact
// :
// {phone: '555-555-1235', phone2: '', email: 'john@doe.ca'}
// details
// :
// {extra: 'dawg', createdAt: '2024-10-10 18:18:16', createdBy: 'dev_TEMP'}
// location
// :
// {address: '99 Doe St', city: 'Ste-Jane', postalCode: 'H0H 0H0'}
// name
// :
// "John Doe"
// name2
// :
// null
// [[Prototype]]
// :
// Object
// orderInfo
// :
// createdAt
// :
// "2024-11-24 14:20:43"
// createdBy
// :
// "dev_test"
// extra
// :
// null
// orderNo
// :
// 5
// priority
// :
// 0
// requiredDate
// :
// "2024-11-24"
// taxRegion
// :
// "QC"
// [[Prototype]]
// :
// Object
// orderTotals
// :
// balanceAsDecimal
// :
// 147.6
// balanceToString
// :
// "147.60"
// discountAsDecimal
// :
// 0
// discountToString
// :
// "0.00"
// gstAsDecimal
// :
// 7.3
// gstToString
// :
// "7.30"
// paymentAmountAsDecimal
// :
// 20
// paymentAmountToString
// :
// "20.00"
// pstAsDecimal
// :
// 14.54
// pstToString
// :
// "14.54"
// subtotalAsDecimal
// :
// 145.76
// subtotalToString
// :
// "145.76"
// totalAsDecimal
// :
// 167.6
// totalToString
// :
// "167.60"
