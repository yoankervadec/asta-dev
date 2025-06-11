//
// client/src/components/modals/CustomerOrderCard/PaymentModal.jsx

import ASModalWrapper from "../../ASModalWrapper";

import InputCell from "../../../components/Inputcell";

const PaymentModal = ({
  isRequired,
  onClose,
  paymentAmount,
  paymentMethod,
  onChange,
  onSubmit,
}) => {
  const handleSubmit = () => {
    onSubmit(isRequired);
    onClose();
  };

  return (
    <ASModalWrapper onClose={onClose} size="extraSmall">
      <section className="df-section-wrapper">
        <div className="df-section-title">
          <h3>{isRequired ? "Refund Required for Cancelation" : "Payment"}</h3>
        </div>
        <div className="df-section-content-wrapper">
          <div className="df-section-content">
            <InputCell
              label="Payment Method&nbsp;:"
              value={paymentMethod}
              onChange={(val) => onChange("paymentMethod", val)}
              type="select"
              options={[
                { label: "Cash", value: 1 },
                { label: "Cheque", value: 2 },
                { label: "E-transfer", value: 3 },
              ]}
            />
            <InputCell
              label="Payment Amount&nbsp;:"
              value={paymentAmount}
              onChange={(val) => onChange("suggestedAmount", val)}
              readOnly={isRequired}
            />
          </div>
        </div>
      </section>
      <div className="btn-container">
        <button className="regular-btn cancel-btn" onClick={onClose}>
          Close
        </button>
        <button
          className="regular-btn confirm-btn"
          onClick={() => handleSubmit()}
        >
          Confirm
        </button>
      </div>
    </ASModalWrapper>
  );
};

export default PaymentModal;
