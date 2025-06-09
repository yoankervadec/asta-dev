//
// client/src/components/modals/SessionModal/SectionLines.jsx

const SectionLines = ({ rows }) => {
  return (
    <section
      className="df-section-wrapper"
      style={{ "--column-width": "22em" }}
    >
      <div className="df-section-title">
        <h3>Items</h3>
      </div>
      <div className="table-container medium-table">
        <table>
          <thead>
            <tr>
              <th>
                <span>Line No.</span>
              </th>
              <th>
                <span>Item No.</span>
              </th>
              <th>
                <span>Quantity</span>
              </th>
              <th>
                <span>Attributes</span>
              </th>
              <th>
                <span>Staged At</span>
              </th>
              <th>
                <span>Staged By</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <TableRow key={row?.lineNo} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SectionLines;

const TableRow = ({ row }) => {
  const { item, details } = row || {};
  return (
    <tr>
      <td>
        <span>{row?.lineNo}</span>
      </td>
      <td>
        <span>{item?.itemNo}</span>
      </td>
      <td>
        <span>{item?.quantity}</span>
      </td>
      <td>
        <span>{item?.attributes?.attributeNameAsString}</span>
      </td>
      <td>
        <span>{details?.createdAt}</span>
      </td>
      <td>
        <span>{details?.createdByName}</span>
      </td>
    </tr>
  );
};
