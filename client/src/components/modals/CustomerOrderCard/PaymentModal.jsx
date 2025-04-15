//
// client/src/components/modals/CustomerOrderCard/PaymentModal.jsx

import InputCell from "../../Inputcell";

const PaymentModal = ({
  isRequired,
  onClose,
  paymentAmount,
  paymentMethod,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content small-modal">
        <section className="df-section-wrapper">
          <div className="df-section-title">
            <h3>
              {isRequired ? "Refund Required for Cancelation" : "Payment"}
            </h3>
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
            onClick={() => onSubmit(isRequired)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
