//
// client/src/components/modals/ProductModal/SectionAttributes.jsx

const SectionAttributes = ({ data }) => {
  const { inventory } = data || {};
  const rows = inventory?.inventoryPerAttributes || [];
  return (
    <section className="df-section-wrapper">
      <div className="df-section-title">
        <h3>Inventory With Attributes</h3>
      </div>
      <div className="table-container medium-table">
        <table>
          <thead>
            <tr>
              <th>
                <span>Item No.</span>
              </th>
              <th>
                <span>Quantity Available</span>
              </th>
              <th>
                <span>Quantity Reserved</span>
              </th>
              <th>
                <span>Attributes</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row?.attributeIdsAsString}>
                <td>
                  <span>{row?.itemNo}</span>
                </td>
                <td>
                  <span>{row?.availableInventory}</span>
                </td>
                <td>
                  <span>{row?.reservedInventory}</span>
                </td>
                <td>
                  <span>{row?.attributeNamesAsString || "..."}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SectionAttributes;
