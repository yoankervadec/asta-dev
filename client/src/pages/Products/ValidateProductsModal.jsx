//
// client/src/pages/Products/ValidateProductsModal.jsx

import { useState } from "react";

import useFetchProductCard from "../../hooks/fetch/products/useFetchProductCard";
import NumericPad from "../../components/NumericPad";
import Loading from "../../components/loaders/Loading";

const ValidateProductsModal = ({ products, onClose, onValidate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNumericPad, setShowNumericPad] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [pendingAttribute, setPendingAttribute] = useState(null);
  const currentItemNo = products[currentIndex];

  const { data, isLoading } = useFetchProductCard(currentItemNo);
  const productInfo = data?.data?.productInfo[0] || {};
  const rows = productInfo?.inventory?.inventoryPerAttributes || [];

  const handleSelectAttribute = (attribute) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [currentItemNo]: attribute,
    }));
  };

  const handleValidate = () => {
    const attribute = selectedAttributes[currentItemNo];
    if (!attribute) return;

    setPendingAttribute(attribute);
    setShowNumericPad(true);
  };

  const handleConfirmQuantity = (quantity) => {
    setShowNumericPad(false);

    const attribute = pendingAttribute;
    if (!attribute) return;

    const isLast = currentIndex === products.length - 1;

    onValidate({ itemNo: currentItemNo, attribute, quantity, isLast }).then(
      () => {
        if (!isLast) setCurrentIndex((prev) => prev + 1);
        else onClose();
      }
    );
  };

  if (!data && !isLoading) onClose();
  return (
    <div className="modal-overlay">
      <div className="modal-content medium-modal">
        <div className="modal-content-wrapper">
          <div className="modal-title">
            <h4>{`Select Attributes for : ${currentItemNo}`}</h4>
          </div>
          <div
            className="table-container medium-table"
            style={{ marginBottom: "1em" }}
          >
            <table>
              <colgroup>
                <col style={{ width: "12ch" }} />
                <col style={{ width: "10em" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>
                    <span>Item No.</span>
                  </th>
                  <th>
                    <span>Actual Inventory</span>
                  </th>
                  <th>
                    <span>Attributes</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows?.map((row) => (
                  <tr
                    key={row.attributeIdsAsString}
                    onClick={() => handleSelectAttribute(row)}
                    className={
                      selectedAttributes[currentItemNo] === row
                        ? "selected"
                        : ""
                    }
                  >
                    <td>
                      <span>{currentItemNo}</span>
                    </td>
                    <td>
                      <span>{row?.quantity}</span>
                    </td>
                    <td>
                      <span>{row?.attributeNamesAsString || "Default"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="btn-container">
            <button className="regular-btn cancel-btn" onClick={onClose}>
              Close
            </button>
            {/* Trigger mutation in parent component */}
            <button
              className="regular-btn confirm-btn"
              onClick={handleValidate}
            >
              Add to card
            </button>
          </div>
        </div>
      </div>
      {showNumericPad && (
        <NumericPad
          onConfirm={handleConfirmQuantity}
          onCancel={() => setShowNumericPad(false)}
        />
      )}
    </div>
  );
};

export default ValidateProductsModal;
