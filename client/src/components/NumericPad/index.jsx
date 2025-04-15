//
// client/src/components/NumericPad/index.jsx

import { useState } from "react";
import styles from "./styles.module.css";

const NumericPad = ({ onConfirm, onCancel }) => {
  const [quantity, setQuantity] = useState("");

  const handleDigit = (digit) => {
    setQuantity((prev) => prev + digit);
  };

  const handleClear = () => setQuantity("");

  const handleConfirm = () => {
    const qty = parseInt(quantity, 10);
    if (qty > 0) onConfirm(qty);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content small-modal">
        <div className="modal-content-wrapper">
          <div className={styles.container}>
            <h4>Enter Quantity</h4>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Pick quantity..."
              className={styles.quantityDisplay}
              value={quantity}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) setQuantity(val); // Allow only digits
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirm();
              }}
              autoFocus
            />
            <div className={styles.numericPadContainer}>
              {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
                <button key={num} onClick={() => handleDigit(num.toString())}>
                  {num}
                </button>
              ))}
            </div>
            <div className="btn-container">
              <button
                className="regular-btn cancel-btn"
                style={{ marginRight: "auto" }}
                onClick={handleClear}
              >
                Clear
              </button>
              <button className="regular-btn cancel-btn" onClick={onCancel}>
                Cancel
              </button>
              <button
                className="regular-btn confirm-btn"
                onClick={handleConfirm}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumericPad;
