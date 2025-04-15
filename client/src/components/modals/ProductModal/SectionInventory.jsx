//
// client/src/components/modals/ProductModal/SectionInventory.jsx

import React, { useState } from "react";
import usePostSessionProduct from "../../../hooks/fetch/production/usePostSessionProduct";

import InputCell from "../../Inputcell";
import Loading from "../../loaders/Loading";

import styles from "./styles.module.css";

const SectionInventory = ({ data, session }) => {
  const { itemNo, inventory, possibleAttributes = [] } = data || {};
  const { header, lines = [] } = session || {};
  const [quantity, setQuantity] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState([1]);
  const postSessionProduct = usePostSessionProduct();

  const toggleAttribute = (attrId) => {
    setSelectedAttributes((prev) =>
      prev.includes(attrId)
        ? prev.filter((id) => id !== attrId)
        : [...prev, attrId]
    );
  };

  const handleCommit = () => {
    if (!itemNo || quantity <= 0) return;
    postSessionProduct.mutate({
      itemNo,
      quantity,
      attributes: selectedAttributes,
    });
    setQuantity(0); // Reset input after commit
    setSelectedAttributes([1]); // Reset selected attributes
  };
  return (
    <section className="df-section-wrapper">
      {postSessionProduct.isPending && <Loading />}
      <div className="df-section-title">
        <h3>Inventory</h3>
      </div>
      <div
        className="df-section-content-wrapper"
        style={{ "--column-width": "28em" }}
      >
        <div className="df-section-content">
          <h4>Quantity</h4>
          <InputCell
            label="Actual Inventory&nbsp;:"
            value={inventory?.actualInventory}
            readOnly
            disabled
          />
          <InputCell
            label="Available Inventory&nbsp;:"
            value={inventory?.availableInventory}
            readOnly
            disabled
          />
          <InputCell
            label="Quantity on Orders&nbsp;:"
            value={inventory?.quantityOnOrders}
            readOnly
            disabled
          />
          <InputCell
            label="Quantity Reserved&nbsp;:"
            value={inventory?.quantityReserved}
            readOnly
            disabled
          />
        </div>
        <div className="df-section-content">
          <h4>Session</h4>
          <InputCell
            label="Current Session&nbsp;:"
            value={header?.session_no}
            readOnly
            disabled
          />
          <InputCell
            label="Quantity on Session&nbsp;:"
            value={lines.reduce((sum, row) => sum + (row.quantity || 0), 0)}
            readOnly
            disabled
          />
          <SessionTable rows={lines} />
        </div>
        <div className="df-section-content">
          <h4>Add to Inventory</h4>
          <div className={styles.inventoryToolWrapper}>
            <div className={styles.buttonWrapper}>
              <button
                onClick={() => setQuantity((q) => Math.max(0, q - 1))}
              >{`\u2212`}</button>
              <button
                onClick={() => setQuantity((q) => q + 1)}
              >{`\u002B`}</button>
            </div>
            <input
              type="number"
              inputMode="numeric"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />

            {/* Attributes */}
            <div className={styles.attributeSelection}>
              <h4>Attributes&nbsp;:</h4>
              <div className={styles.attributeList}>
                {possibleAttributes.map(({ attrId, attrName }) => (
                  <label key={attrId} className={styles.attributeItem}>
                    <input
                      type="checkbox"
                      checked={selectedAttributes.includes(attrId)}
                      onChange={() => toggleAttribute(attrId)}
                    />
                    <span>{attrName}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Attributes */}

            <button
              className={styles.commitButton}
              onClick={handleCommit}
              disabled={quantity <= 0 || postSessionProduct.isPending}
            >
              {postSessionProduct.isPending ? "Staging..." : "Stage"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const SessionTable = ({ rows }) => {
  return (
    <div className="table-container small-table">
      <table>
        <colgroup>
          <col style={{ width: "19ch" }} />
          <col style={{ width: "10ch" }} />
          <col style={{ width: "9ch" }} />
        </colgroup>
        <thead>
          <tr>
            <th>
              <span>Date</span>
            </th>
            <th>
              <span>Item No.</span>
            </th>
            <th className="align-end">
              <span>Quantity</span>
            </th>
            <th>
              <span>Attributes</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.line_no}>
              <td>
                <span>{row?.createdAt}</span>
              </td>
              <td>
                <span>{row?.item_no}</span>
              </td>
              <td className="align-end">
                <span>{row?.quantity}</span>
              </td>
              <td title={row?.attrNameAsString}>
                <span>{row?.attrNameAsString}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SectionInventory;
