//
// client/src/pages/DashBoard/JobBoard/components/LocalModal/JobLinesFocus/index.jsx

import { useState, useEffect } from "react";
import SectionInventory from "../../../../../../modals/global/ProductModal/SectionInventory";

import ASModalWrapper from "../../../../../../modals/ASModalWrapper";
import AMModalStyles from "../../../../../../modals/ASModalWrapper/styles.module.css";

import CurrentOrderLines from "./CurrentOrderLines";
import SuggestedOrderLines from "./SuggestedOrderLines";

import useFetchCustomerOrderLines from "../../../../../../hooks/fetch/customerOrders/useFetchCustomerOrderLines";
import useFetchProductCard from "../../../../../../hooks/fetch/products/useFetchProductCard";

const JobLinesFocus = ({ onClose, isFrozen, data }) => {
  const [selectedLine, setSelectedLine] = useState(null);

  const { data: currentOrderLinesRaw, isLoading: isOrderLinesLoading } =
    useFetchCustomerOrderLines({
      orderNo: data?.currentOrderNo,
    });

  const currentOrderLines = currentOrderLinesRaw?.data?.ordersList || [];

  // Set selected line to first one in the array
  useEffect(() => {
    if (currentOrderLines.length > 0 && !selectedLine) {
      setSelectedLine({ line: currentOrderLines[0], quantityToAdd: 0 });
    }
  }, [currentOrderLines, selectedLine]);

  // Get details product info based on selected line
  const { data: rawProductData, isLoading: isProductDetailsLoading } =
    useFetchProductCard(selectedLine?.line?.item?.itemNo ?? null);

  const { productInfo = [], sessionInfo } = rawProductData?.data || {};
  const product = productInfo[0] || {};

  const handleSelectLine = (line) => {
    setSelectedLine({ line: line, quantityToAdd: 0 });
  };

  return (
    <ASModalWrapper size="medium" onClose={onClose} isFrozen={isFrozen}>
      <div className={AMModalStyles.stickyTitleBar}>
        <div className={AMModalStyles.title}>
          <h3>Focus: Customer Order Lines</h3>
        </div>
        <div className={AMModalStyles.titleButtons}></div>
      </div>
      <div className={AMModalStyles.modalBody}>
        <SectionInventory
          data={product}
          session={sessionInfo}
          overrideAttributes={selectedLine?.line?.item?.attributes || null}
          showSessionTable={false}
        />
        <CurrentOrderLines
          rows={currentOrderLines}
          selectedLine={selectedLine}
          onSelectLine={handleSelectLine}
        />
        <SuggestedOrderLines />
      </div>
      <div className="btn-container">
        <button onClick={onClose} className="regular-btn cancel-btn">
          Close
        </button>
      </div>
    </ASModalWrapper>
  );
};

export default JobLinesFocus;
