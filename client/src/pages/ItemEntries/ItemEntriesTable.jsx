//
// client/src/pages/ItemEntries/ItemEntriesTable.jsx

import { useModalNavigation } from "../../hooks/useModalNavigation";

const ItemEntriesTable = ({ rows }) => {
  const tableRows = rows || [];

  return (
    <div className="border-shadow table-container large-table">
      <table>
        <colgroup>
          <col style={{ width: "6em" }} />
          <col style={{ width: "8em" }} />
          <col style={{ width: "8em" }} />
          <col style={{ width: "10em" }} />
          <col style={{ width: "8em" }} />
          <col style={{ width: "auto" }} />
          <col style={{ width: "9em" }} />
          <col style={{ width: "9em" }} />
          <col style={{ width: "12em" }} />
        </colgroup>
        <thead>
          <tr>
            <th>
              <span>Entry No.</span>
            </th>
            <th>
              <span>Type</span>
            </th>
            <th>
              <span>Warehouse</span>
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
              <span>Transaction ID</span>
            </th>
            <th>
              <span>Document No.</span>
            </th>
            <th>
              <span>Created At</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row) => (
            <TableRow key={row.entryNo} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableRow = ({ row }) => {
  const { warehouse, item, documents, details } = row;
  const { syncOpenModal } = useModalNavigation();
  return (
    <tr>
      <td>
        <span>{row?.entryNo}</span>
      </td>
      <td>
        <span>{row?.entryTypeName}</span>
      </td>
      <td>
        <span>{warehouse?.warehouseName}</span>
      </td>
      <td>
        <span
          className="key-row-selector"
          onClick={(e) => {
            e.stopPropagation();
            syncOpenModal("productCard", { itemNo: item.itemNo });
          }}
        >
          {item?.itemNo}
        </span>
      </td>
      <td>
        <span>{item?.quantity}</span>
      </td>
      <td>
        <span>{item?.attributes?.attributesNameSetAsString}</span>
      </td>
      <td>
        <span>{documents?.transactionId}</span>
      </td>
      <td>
        <span>{documents?.documentNo}</span>
      </td>
      <td>
        <span>{details?.createdAt}</span>
      </td>
    </tr>
  );
};

export default ItemEntriesTable;
