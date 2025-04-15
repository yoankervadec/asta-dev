//
// client/src/pages/Products/SmallProductsModal.jsx

import React, { useState } from "react";
import useFetchProducts from "../../hooks/fetch/products/useFetchProducts";
import { fuzzySearch } from "../../utils/fuzzySearch";

import InputBox from "../../components/InputBox";
import Loading from "../../components/loaders/Loading";

const SmallProductsModal = ({
  onClose,
  onSelectProduct,
  selectedProducts,
  onValidateProduct,
}) => {
  const [filterText, setFilterText] = useState("");
  const { data, isLoading } = useFetchProducts();

  const rows = data?.data?.products || [];

  const filteredRows = fuzzySearch(
    rows,
    filterText,
    ["naming.description", "details.createdByName"], // Fuzzy
    ["itemNo", "naming.description"] // Exact
  );

  const handleSelectRow = (itemNo) => {
    onSelectProduct(itemNo); // Toggle selection in parent
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content small-modal">
        {isLoading && <Loading />}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1em",
            marginBottom: "1em",
          }}
        >
          <InputBox inputValue={filterText} setInputValue={setFilterText} />
          <div className="table-container medium-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <span>Item No.</span>
                  </th>
                  <th>
                    <span>Description</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr
                    key={row?.itemNo}
                    className={
                      selectedProducts.includes(row?.itemNo) ? "selected" : ""
                    }
                    onClick={() => handleSelectRow(row?.itemNo)}
                  >
                    <td>
                      <span>{row?.itemNo}</span>
                    </td>
                    <td>
                      <span>{row?.naming?.description}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="btn-container">
          <button className="regular-btn cancel-btn" onClick={onClose}>
            Close
          </button>
          <button
            className="regular-btn confirm-btn"
            onClick={() => onValidateProduct()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmallProductsModal;
