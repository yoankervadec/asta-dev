//
// client/src/pages/DashBoard/JobBoard/components/LocalModal/JobLinesFocus/index.jsx

import ASModalWrapper from "../../../../../../modals/ASModalWrapper";
import AMModalStyles from "../../../../../../modals/ASModalWrapper/styles.module.css";

import CurrentOrderLines from "./CurrentOrderLines";
import SuggestedOrderLines from "./SuggestedOrderLines";

import useFetchCustomerOrderLines from "../../../../../../hooks/fetch/customerOrders/useFetchCustomerOrderLines";

const JobLinesFocus = ({ onClose, isFrozen, data }) => {
  const { data: currentOrderLinesRaw, isLoading } = useFetchCustomerOrderLines({
    orderNo: data?.currentOrderNo,
  });

  const currentOrderLines = currentOrderLinesRaw?.data?.ordersList || [];

  return (
    <ASModalWrapper size="medium" onClose={onClose} isFrozen={isFrozen}>
      <div className={AMModalStyles.stickyTitleBar}>
        <div className={AMModalStyles.title}>
          <h3>Focus: Customer Order Lines</h3>
        </div>
        <div className={AMModalStyles.titleButtons}></div>
      </div>
      <div className={AMModalStyles.modalBody}>
        <CurrentOrderLines rows={currentOrderLines} />
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
