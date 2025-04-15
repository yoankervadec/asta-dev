//
// client/src/components/modals/ProductModal/SectionOrders.jsx

import { useModalNavigation } from "../../../hooks/useModalNavigation";

const SectionOrders = ({ rows = [] }) => {
  const { syncOpenModal } = useModalNavigation();
  const { customer, item, pricing } = rows || {};
  return (
    <section className="df-section-wrapper">
      <div className="df-section-title">
        <h3>Active Customer Orders</h3>
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
                <span>Item No.</span>
              </th>
              <th>
                <span>Quantity</span>
              </th>
              <th>
                <span>Name</span>
              </th>
              <th>
                <span>Phone</span>
              </th>
              <th className="align-end">
                <span>Total</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.orderNo}-${row.lineNo}`}>
                <td>
                  <span
                    className="key-row-selector"
                    onClick={() =>
                      syncOpenModal("customerOrderCard", {
                        orderNo: row?.orderNo,
                      })
                    }
                  >
                    {row?.orderNo}
                  </span>
                </td>
                <td>
                  <span>{row?.lineStatus}</span>
                </td>
                <td>
                  <span>{row?.item?.itemNo}</span>
                </td>
                <td>
                  <span>{row?.item?.quantity}</span>
                </td>
                <td>
                  <span>{row?.customer?.clientName}</span>
                </td>
                <td>
                  <span>{row?.customer?.phone}</span>
                </td>
                <td className="align-end">
                  <span>{row?.pricing?.lineTotalToString}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SectionOrders;
