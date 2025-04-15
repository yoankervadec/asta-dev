//
// client/src/components/modals/ClientCard/SectionOrders.jsx

import { useModalNavigation } from "../../../hooks/useModalNavigation";

const SectionOrders = ({ rows = [] }) => {
  return (
    <section className="df-section-wrapper">
      <div className="df-section-title">
        <h3>Customer Orders</h3>
      </div>
      <div className="table-container medium-table">
        <table>
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
            {rows.map((row) => (
              <TableRow key={row.meta.orderNo} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const TableRow = ({ row }) => {
  const { syncOpenModal } = useModalNavigation();
  const { customer, meta, orderInfo, totals } = row || {};
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
        <span>{row.customer.name}</span>
      </td>
      <td>
        <span>{row.customer.contact.phone}</span>
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

export default SectionOrders;
