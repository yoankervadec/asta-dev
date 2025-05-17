//
// client/src/pages/Home/PosTable.jsx

import { useModalNavigation } from "../../hooks/useModalNavigation";
import useFormField from "../../hooks/useFormField";

import EditableCell from "../../components/EditableCell";

const PosTable = ({ rows, onVoidLine }) => {
  const tableRows = rows || [];

  return (
    <div className="border-shadow table-container large-table">
      <table>
        <colgroup>
          <col style={{ width: "4em" }} />
          <col style={{ width: "12ch" }} />
          <col style={{ width: "12ch" }} />
          <col style={{ width: "auto" }} />
          <col style={{ width: "auto" }} />
          <col style={{ width: "8em" }} />
          <col style={{ width: "8em" }} />
          <col style={{ width: "8em" }} />
          <col style={{ width: "8em" }} />
        </colgroup>
        <thead>
          <tr>
            <th>
              <span>Delete</span>
            </th>
            <th>
              <span>Item No.</span>
            </th>
            <th>
              <span>Quantity</span>
            </th>
            <th>
              <span>Description</span>
            </th>
            <th>
              <span>Attributes</span>
            </th>
            <th className="align-end">
              <span>Board Feet</span>
            </th>
            <th className="align-end">
              <span>Unit Price</span>
            </th>
            <th className="align-end">
              <span>Discount (%)</span>
            </th>
            <th className="align-end">
              <span>Line Amount</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row) => (
            <TableRow key={row?.lineNo} row={row} onVoidLine={onVoidLine} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableRow = ({ row, onVoidLine }) => {
  const updateUrl = "/pos/updateLine";
  const refetchQueries = ["posPage"];

  const { syncOpenModal } = useModalNavigation();
  const { item, pricing } = row || {};
  const lineNo = row?.lineNo;

  const {
    value: quantity,
    handleChange: handleQuantityChange,
    handleBlur: handleQuantityBlur,
    isLoading: isLoadingQuantity,
  } = useFormField(
    item?.quantity ?? "",
    item?.quantity,
    updateUrl,
    `quantity`,
    refetchQueries,
    lineNo
  );
  const {
    value: discount,
    handleChange: handleDiscountChange,
    handleBlur: handleDiscountBlur,
    isLoading: isLoadingDiscount,
  } = useFormField(
    pricing?.lineDiscountPercentageToString ?? "",
    pricing?.lineDiscountPercentageToString,
    updateUrl,
    `discount`,
    refetchQueries,
    lineNo
  );
  return (
    <tr>
      <td className="with-icon">
        <i
          className="fas fa-trash-can"
          onClick={() => onVoidLine?.(lineNo)}
        ></i>
      </td>
      <td>
        <span
          className="key-row-selector"
          onClick={() => syncOpenModal("productCard", { itemNo: item?.itemNo })}
        >
          {item?.itemNo}
        </span>
      </td>
      <EditableCell
        value={quantity}
        onChange={handleQuantityChange}
        onBlur={() => handleQuantityBlur()}
        isLoading={isLoadingQuantity}
        className=""
      />
      <td>
        <span>{item?.description}</span>
      </td>
      <td>
        <span>{item?.attributes?.attributeNameSetAsString}</span>
      </td>
      <td className="align-end">
        <span>{item?.lineBoardfeetToString}</span>
      </td>
      <td className="align-end">
        <span>{pricing?.unitPriceToString}</span>
      </td>
      {/* <td className="align-end">
        <span>{pricing?.lineDiscountPercentageToString}</span>
      </td> */}
      <EditableCell
        value={discount}
        onChange={handleDiscountChange}
        onBlur={() => handleDiscountBlur()}
        isLoading={isLoadingDiscount}
        className="align-end"
      />
      <td className="align-end">
        <span>{pricing?.lineSubtotalToString}</span>
      </td>
    </tr>
  );
};

export default PosTable;
