//
// client/src/pages/Products/ProductsTable.jsx

import { useModalNavigation } from "../../hooks/useModalNavigation";

const ProductsTable = ({ rows, onSelectProduct, selectedProducts }) => {
  const tableRows = rows || [];

  return (
    <div className="border-shadow table-container large-table">
      <table>
        <colgroup>
          <col style={{ width: "calc(4em + 5vw)" }} />
          <col style={{ width: "calc(8em + 12vw)" }} />
        </colgroup>
        <thead>
          <tr>
            <th>
              <span>Item No.</span>
            </th>
            <th>
              <span>Descripion</span>
            </th>
            <th className="align-end">
              <span>Available</span>
            </th>
            <th className="align-end">
              <span>Reserved</span>
            </th>
            <th className="align-end">
              <span>Actual</span>
            </th>
            <th className="align-end">
              <span>U. Price</span>
            </th>
            <th className="align-end">
              <span>P./Thousand</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row) => (
            <TableRow
              key={row.itemNo}
              row={row}
              onSelectProduct={onSelectProduct}
              selectedProducts={selectedProducts}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableRow = ({ row, onSelectProduct, selectedProducts }) => {
  const { syncOpenModal } = useModalNavigation();
  const handleSelectRow = (itemNo) => {
    onSelectProduct(itemNo); // Toggle selection in parent
  };
  return (
    <tr
      className={selectedProducts.includes(row?.itemNo) ? "selected" : ""}
      onClick={() => handleSelectRow(row?.itemNo)}
    >
      <td>
        <span
          className="key-row-selector"
          onClick={(e) => {
            e.stopPropagation();
            syncOpenModal("productCard", { itemNo: row.itemNo });
          }}
        >
          {row.itemNo}
        </span>
      </td>
      <td>
        <span>{row.naming?.description}</span>
      </td>
      <td className="align-end">
        <span>{row.inventory?.availableInventory}</span>
      </td>
      <td className="align-end">
        <span className="key-row-selector">
          {row.inventory?.quantityReserved}
        </span>
      </td>
      <td className="align-end">
        <span>{row.inventory?.actualInventory}</span>
      </td>
      <td className="align-end">
        <span>{row.pricing?.unitPriceToString}</span>
      </td>
      <td className="align-end">
        <span>{row.pricing?.pricePerThousandToString}</span>
      </td>
    </tr>
  );
};

export default ProductsTable;
