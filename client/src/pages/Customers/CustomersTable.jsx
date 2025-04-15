//
// client/src/pages/Customers/CustomersTable.jsx

import { useModalNavigation } from "../../hooks/useModalNavigation";

const CustomersTable = ({ rows, onSelectClient, selectedClientId }) => {
  const tableRows = rows || [];

  return (
    <div className="border-shadow table-container large-table">
      <table>
        <colgroup>
          <col style={{ width: "10ch" }} />
        </colgroup>
        <thead>
          <tr>
            <th>
              <span>Client ID</span>
            </th>
            <th>
              <span>Name</span>
            </th>
            <th>
              <span>Phone</span>
            </th>
            <th>
              <span>Email</span>
            </th>
            <th>
              <span>Address</span>
            </th>
            <th>
              <span>City</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row) => (
            <TableRow
              key={row.clientId}
              row={row}
              onSelectClient={onSelectClient}
              isSelected={selectedClientId === row.clientId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableRow = ({ row, onSelectClient, isSelected }) => {
  const { syncOpenModal } = useModalNavigation();
  const { names, contact, location } = row || {};

  return (
    <tr
      onClick={() => onSelectClient(row.clientId)}
      className={isSelected ? "selected" : ""}
    >
      <td>
        <span
          className="key-row-selector"
          onClick={(e) => {
            e.stopPropagation();
            syncOpenModal("clientCard", { clientId: row.clientId });
          }}
        >
          {row?.clientId}
        </span>
      </td>
      <td>
        <span>{names?.name}</span>
      </td>
      <td>
        <span>{contact?.phone}</span>
      </td>
      <td>
        <span>{contact?.email}</span>
      </td>
      <td>
        <span>{location?.address}</span>
      </td>
      <td>
        <span>{location?.city}</span>
      </td>
    </tr>
  );
};

export default CustomersTable;
