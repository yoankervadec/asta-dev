//
// client/src/pages/Transactions/TransactionsTable.jsx

import { useModalNavigation } from "../../hooks/useModalNavigation";

const TransactionsTable = ({ rows }) => {
  return (
    <div className="border-shadow table-container large-table">
      <table>
        <colgroup>
          <col />
        </colgroup>
        <thead>
          <tr>
            <th>
              <span>Transaction ID</span>
            </th>
            <th>
              <span>Order No.</span>
            </th>
            <th>
              <span>Type</span>
            </th>
            <th>
              <span>Date / Time</span>
            </th>
            <th style={{ textAlign: "center" }}>
              <span>Created By</span>
            </th>
            <th className="align-end">
              <span>Amount</span>
            </th>
            <th className="align-end">
              <span>Payment</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <TableRow key={row.transactionId} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;

const TableRow = ({ row }) => {
  const { syncOpenModal } = useModalNavigation();
  const { totals, details } = row || {};

  return (
    <tr>
      <td>
        <span>{row?.transactionId}</span>
      </td>
      <td>
        <span
          className="key-row-selector"
          onClick={() =>
            syncOpenModal("customerOrderCard", { orderNo: row?.orderNo })
          }
        >
          {row?.orderNo}
        </span>
      </td>
      <td>
        <span>{totals?.transactionTypeName}</span>
      </td>
      <td>
        <span>{details?.createdAt}</span>
      </td>
      <td style={{ textAlign: "center" }}>
        <span>{details?.createdByName}</span>
      </td>
      <td className="align-end">
        <span>{totals?.amountToString}</span>
      </td>
      <td className="align-end">
        <span>{totals?.paymentAmountToString}</span>
      </td>
    </tr>
  );
};
