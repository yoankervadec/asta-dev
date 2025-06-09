//
// client/src/components/modals/CustomerOrderCard/SectionPaymentEntries.jsx

const SectionPaymentEntries = ({ rows }) => {
  return (
    <section
      className="df-section-wrapper"
      style={{ "--column-width": "22em" }}
    >
      <div className="df-section-title">
        <h3>Payment Entries</h3>
      </div>
      <div className="table-container medium-table">
        <table>
          <thead>
            <tr>
              <th>
                <span>Transaction No.</span>
              </th>
              <th>
                <span>Type</span>
              </th>
              <th>
                <span>Date, Time</span>
              </th>
              <th>
                <span>Payment Method</span>
              </th>
              <th className="align-end">
                <span>Amount</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row?.entryNo}>
                <td>
                  <span>{row?.details?.transactionId}</span>
                </td>
                <td>
                  <span>{row?.details?.transactionType}</span>
                </td>
                <td>
                  <span>{row?.details?.createdAt}</span>
                </td>
                <td>
                  <span>{row?.details?.payment?.paymentMethod}</span>
                </td>
                <td className="align-end">
                  <span>{row?.details?.payment?.paymentAmount}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SectionPaymentEntries;
