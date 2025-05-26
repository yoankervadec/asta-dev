//
// client/src/pages/Products/ValidateProductsModal.jsx

import { useState, useEffect } from "react";

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
  const inventoryRows = productInfo?.inventory?.inventoryPerAttributes || [];
  const defaultRow = {
    attributeIdsAsString: "default",
    attributeNamesAsString: "Default",
    availableInventory: "",
    isDefault: true,
  };

  // Always include the default row as the first option
  const rows = [defaultRow, ...inventoryRows];

  const handleSelectAttribute = (attribute) => {
    console.log(attribute);
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
                    <span>Available Inventory</span>
                  </th>
                  <th>
                    <span>Attributes</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <AttributeRow
                    key={row.attributeIdsAsString}
                    row={row}
                    isSelected={
                      selectedAttributes[currentItemNo]
                        ?.attributeIdsAsString === row.attributeIdsAsString
                    }
                    onClick={() => handleSelectAttribute(row)}
                    itemNo={currentItemNo}
                  />
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

const AttributeRow = ({ row, isSelected, onClick, itemNo }) => (
  <tr onClick={onClick} className={isSelected ? "selected" : ""}>
    <td>
      <span>{itemNo}</span>
    </td>
    <td>
      <span>{row?.availableInventory}</span>
    </td>
    <td>
      <span>{row?.attributeNamesAsString || "Default"}</span>
    </td>
  </tr>
);
