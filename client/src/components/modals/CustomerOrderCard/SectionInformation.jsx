//
// client/src/components/modals/CustomerOrderCard/SectionInformation.jsx

import React, { useEffect, useState } from "react";
import useFormField from "../../../hooks/useFormField";

import InputCell from "../../Inputcell";

const SectionInformation = ({ meta, data }) => {
  const { orderInfo, totals } = data || {};

  const [modifyDisable, setModifyDisable] = useState(true); // Default to true

  useEffect(() => {
    setModifyDisable(meta?.toggles?.modifyDisable ?? true);
  }, [meta?.toggles?.modifyDisable]); // Depend on actual prop

  // UseFormField
  const updateUrl = `/customer-order/card/alter/${meta?.orderNo}`;
  const refetchQueries = ["customerOrderCard", meta?.orderNo];

  const {
    value: requiredDate,
    handleChange: handleRequiredDateChange,
    handleBlur: handleRequiredDateBlur,
  } = useFormField(
    orderInfo?.requiredDate ?? "",
    orderInfo?.requiredDate,
    updateUrl,
    `requiredDate`,
    refetchQueries
  );
  const {
    value: priority,
    handleChange: handlePriorityChange,
    handleBlur: handlePriorityBlur,
  } = useFormField(
    orderInfo?.priority ?? "",
    orderInfo?.priority,
    updateUrl,
    `priority`,
    refetchQueries
  );
  const {
    value: orderExtra,
    handleChange: handleOrderExtraChange,
    handleBlur: handleOrderExtraBlur,
  } = useFormField(
    orderInfo?.extra ?? "",
    orderInfo?.extra,
    updateUrl,
    `orderExtra`,
    refetchQueries
  );

  return (
    <section className="df-section-wrapper">
      <div className="df-section-title">
        <h3>Information</h3>
      </div>
      <div
        className="df-section-content-wrapper"
        style={{ "--column-width": "22em" }}
      >
        <div className="df-section-content">
          <h4>General</h4>
          <InputCell
            label="Order No.&nbsp;:"
            value={meta?.orderNo}
            readOnly
            disabled
          />
          <InputCell
            label="Status&nbsp;:"
            value={meta?.status}
            readOnly
            disabled
          />
          <InputCell
            label="Quote&nbsp;:"
            type="toggle"
            value={!!meta?.quote}
            disabled
          />
          <InputCell
            label="Created by&nbsp;:"
            value={orderInfo?.createdBy}
            readOnly
            disabled
          />
        </div>
        <div className="df-section-content">
          <h4>Dates</h4>
          <InputCell
            label="Created at&nbsp;:"
            type="date"
            value={orderInfo?.createdAt}
            readOnly
            disabled
          />
          <InputCell
            label="Required date&nbsp;:"
            type="date"
            value={requiredDate}
            onChange={handleRequiredDateChange}
            onBlur={() => handleRequiredDateBlur()}
            readOnly={modifyDisable}
          />
        </div>
        <div className="df-section-content">
          <h4>General</h4>
          <InputCell
            label="Priority&nbsp;:"
            value={priority}
            onChange={handlePriorityChange}
            onBlur={() => handlePriorityBlur()}
            readOnly={modifyDisable}
          />
          <InputCell
            label="Consolidated&nbsp;:"
            type="toggle"
            value={meta?.consolidated}
            disabled
          />
          <InputCell
            label="General comments&nbsp;:"
            value={orderExtra}
            onChange={handleOrderExtraChange}
            onBlur={() => handleOrderExtraBlur()}
            readOnly={modifyDisable}
          />
        </div>
        <div className="df-section-content">
          <h4>Tax Region</h4>
          <InputCell
            label="Tax Region&nbsp;:"
            value={orderInfo?.taxRegion}
            readOnly
            disabled
          />
        </div>
        <div className="df-section-content">
          <h4>Totals</h4>
          <InputCell
            label="Subtotal&nbsp;:"
            value={totals?.subtotalToString}
            readOnly
            disabled
          />
          <InputCell
            label="TPS&nbsp;:"
            value={totals?.gstToString}
            readOnly
            disabled
          />
          <InputCell
            label="TVQ&nbsp;:"
            value={totals?.pstToString}
            readOnly
            disabled
          />
          <InputCell
            label="Discount&nbsp;:"
            value={totals?.discountToString}
            readOnly
            disabled
          />
          <InputCell
            label="Total&nbsp;:"
            value={totals?.totalToString}
            readOnly
            disabled
          />
        </div>
        <div className="df-section-content">
          <h4>Payment</h4>
          <InputCell
            label="Payment amount&nbsp;:"
            value={totals?.paymentAmountToString}
            readOnly
            disabled
          />
          <InputCell
            label="Balance&nbsp;:"
            value={totals?.balanceToString}
            readOnly
            disabled
          />
        </div>
      </div>
    </section>
  );
};

export default SectionInformation;
