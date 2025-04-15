//
// client/src/pages/CustomerOrders/CustomerOrdersTable.jsx

import { useModalNavigation } from "../../hooks/useModalNavigation";

const CustomerOrdersTable = ({ rows }) => {
  const tableRows = rows || [];

  return (
    <div className="border-shadow table-container large-table">
      <table>
        <colgroup>
          <col style={{ width: "calc(4em + 4vw)" }} />
          <col style={{ width: "calc(2em + 10vw)" }} />
          <col style={{ width: "calc(5em + 10vw)" }} />
          <col style={{ width: "calc(3em + 8vw)" }} />
          <col style={{ width: "calc(3em + 8vw)" }} />
        </colgroup>
        <thead>
          <tr>
            <th>
              <span>Order No.</span>
            </th>
            <th>
              <span>Status</span>
            </th>
            <th>
              <span>Name</span>
            </th>
            <th>
              <span>Phone</span>
            </th>
            <th>
              <span>Required Date</span>
            </th>
            <th className="align-end">
              <span>Total</span>
            </th>
            <th className="align-end">
              <span>Balance</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row) => (
            <TableRow key={row.meta.orderNo} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableRow = ({ row }) => {
  const { syncOpenModal } = useModalNavigation();
  return (
    <tr>
      <td>
        <span
          className="key-row-selector"
          onClick={() =>
            syncOpenModal("customerOrderCard", { orderNo: row.meta.orderNo })
          }
        >
          {row.meta.orderNo}
        </span>
      </td>
      <td>
        <span>{row.meta.status}</span>
      </td>
      <td>
        <span
          className="key-row-selector"
          onClick={() =>
            syncOpenModal("clientCard", { clientId: row?.customer?.clientId })
          }
        >
          {row.customer.name}
        </span>
      </td>
      <td>
        <span
          className="key-row-selector"
          onClick={() =>
            syncOpenModal("clientCard", { clientId: row?.customer?.clientId })
          }
        >
          {row.customer.contact.phone}
        </span>
      </td>
      <td>
        <span>{row.orderInfo.requiredDate}</span>
      </td>
      <td className="align-end">
        <span>{row.totals.totalToString}</span>
      </td>
      <td className="align-end">
        <span>{row.totals.balanceToString}</span>
      </td>
    </tr>
  );
};

export default CustomerOrdersTable;
