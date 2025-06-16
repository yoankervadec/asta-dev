//
// client/src/pages/DashBoard/JobBoard/components/LocalModal/JobLinesFocus/CurrentOrderLines.jsx

const CurrentOrderLines = ({ rows = [] }) => {
  return (
    <section
      className="df-section-wrapper"
      style={{ "--column-width": "22em" }}
    >
      <div className="df-section-title">
        <h3>Current Order</h3>
        <div>
          <button className="small-btn cancel-btn">do something</button>
        </div>
      </div>
      <div className="table-container medium-table">
        <table>
          <thead>
            <tr>
              <th>
                <span>Quantity required</span>
              </th>
              <th>
                <span>Quantity made</span>
              </th>
              <th>
                <span>Item No.</span>
              </th>
              <th>
                <span>Description</span>
              </th>
              <th>
                <span>Attributes</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <TableRow key={row.lineNo} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CurrentOrderLines;

const TableRow = ({ row }) => {
  const { customer, item, pricing, status, services } = row || {};
  return (
    <tr>
      <td>
        <span>{item?.quantity}</span>
      </td>
      <td>
        <span>{item?.quantity}</span>
      </td>
      <td>
        <span>{item?.itemNo}</span>
      </td>
      <td>
        <span>{item?.description}</span>
      </td>
      <td>
        <span>{item?.attributeNameSetAsString}</span>
      </td>
    </tr>
  );
};
