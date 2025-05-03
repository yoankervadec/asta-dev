//
// client/src/components/modals/CustomerOrderCard/SectionItems.jsx

import { useState } from "react";

import { useModalNavigation } from "../../../hooks/useModalNavigation";

const SectionItems = ({ rows = [], meta, onDeleteLine, onOpenAddItem }) => {
  const [showCanceled, setShowCanceled] = useState(false);

  const filteredRows = showCanceled
    ? rows
    : rows.filter((row) => row?.status?.active === 1);

  return (
    <section
      className="df-section-wrapper"
      style={{ "--column-width": "22em" }}
    >
      <div className="df-section-title">
        <h3>Items and Services</h3>
        <div>
          <button
            className="small-btn cancel-btn"
            onClick={onOpenAddItem}
            disabled={meta?.toggles?.addDisable}
          >
            Add Items
          </button>
          <button
            className="small-btn cancel-btn"
            onClick={() => setShowCanceled((prev) => !prev)}
          >
            {showCanceled ? "Hide Canceled" : "Show Canceled"}
          </button>
        </div>
      </div>
      <div className="table-container medium-table">
        <table>
          <colgroup>
            <col style={{ width: "4em" }} />
            <col style={{ width: "7em" }} />
            <col style={{ width: "12ch" }} />
            <col style={{ width: "10ch" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "7em" }} />
            <col style={{ width: "7em" }} />
            <col style={{ width: "7em" }} />
          </colgroup>
          <thead>
            <tr>
              <th>
                <span>Delete</span>
              </th>
              <th>
                <span>Status</span>
              </th>
              <th>
                <span>Item No.</span>
              </th>
              <th>
                <span>Quantity</span>
              </th>
              <th>
                <span>Description</span>
              </th>
              <th>
                <span>Attributes</span>
              </th>
              <th className="align-end">
                <span>Board Feet</span>
              </th>
              <th className="align-end">
                <span>Unit Price</span>
              </th>
              <th className="align-end">
                <span>Discount (%)</span>
              </th>
              <th className="align-end">
                <span>Subtotal</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <TableRow
                key={row?.lineNo}
                row={row}
                onDeleteLine={onDeleteLine}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SectionItems;

const TableRow = ({ row, onDeleteLine }) => {
  const { syncOpenModal } = useModalNavigation();
  const { customer, item, pricing, status } = row;
  return (
    <tr className={status.active === 1 ? "" : "row-canceled"}>
      <td className="with-icon">
        <i
          className="fas fa-trash-can"
          onClick={() => onDeleteLine?.(row.lineNo)}
        ></i>
      </td>
      <td>
        <span>{row?.lineStatus}</span>
      </td>
      <td>
        <span
          className="key-row-selector"
          onClick={() => syncOpenModal("productCard", { itemNo: item.itemNo })}
        >
          {item?.itemNo}
        </span>
      </td>
      <td>
        <span>{item?.quantity}</span>
      </td>
      <td>
        <span>{item?.description}</span>
      </td>
      <td>
        <span>{item?.attributeNameSetAsString}</span>
      </td>
      <td className="align-end">
        <span>{pricing?.lineBoardfeetToString}</span>
      </td>
      <td className="align-end">
        <span>{pricing?.unitPriceToString}</span>
      </td>
      <td className="align-end">
        <span>{pricing?.lineDiscountPercentage}</span>
      </td>
      <td className="align-end">
        <span>{pricing?.lineSubtotalToString}</span>
      </td>
    </tr>
  );
};
