//
// client/src/pages/DashBoard/JobBoard/components/JobLines.jsx

import { useState } from "react";
import JobLinesFocus from "./LocalModal/JobLinesFocus";

const JobLines = ({ styles, data }) => {
  const { orderLines: rows, orderInfo } = data || [];

  const [focusLinesData, setFocusLinesData] = useState({
    isOpen: false,
    currentOrderNo: null,
  });

  return (
    <div
      className={styles.jobLinesContainer}
      onClick={(e) => {
        e.stopPropagation();
        setFocusLinesData({ isOpen: true, currentOrderNo: orderInfo.orderNo });
      }}
    >
      <div
        className={`table-container medium-table ${styles.simpleLinesTableWrap}`}
        style={{ height: "20em", fontSize: "var(--fs-sm)" }}
      >
        <table>
          <thead>
            <tr>
              <th>
                <span>Item No.</span>
              </th>
              <th>
                <span>Ordered</span>
              </th>
              <th>
                <span>Needed</span>
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
      {focusLinesData?.isOpen && (
        <JobLinesFocus
          data={focusLinesData}
          onClose={() =>
            setFocusLinesData({ isOpen: false, currentOrderNo: null })
          }
          isFrozen={false}
        />
      )}
    </div>
  );
};

export default JobLines;

const TableRow = ({ row }) => {
  return (
    <tr>
      <td>
        <span>{row?.item?.itemNo || ""}</span>
      </td>
      <td>
        <span>{row?.item?.quantity || ""}</span>
      </td>
      <td>
        <span>{row?.item?.quantity || ""}</span>
      </td>
      <td>
        <span>{row?.item?.attributeNameSetAsString || ""}</span>
      </td>
    </tr>
  );
};
