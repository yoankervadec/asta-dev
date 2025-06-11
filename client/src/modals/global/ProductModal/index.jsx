//
// client/src/components/modals/ProductModal/index.jsx

import ASModalWrapper from "../../ASModalWrapper";
import { useModalNavigation } from "../../../hooks/useModalNavigation";
import useFetchProductCard from "../../../hooks/fetch/products/useFetchProductCard";

import SectionInventory from "./SectionInventory";
import SectionAttributes from "./SectionAttributes";
import SectionInformation from "./SectionInformation";
import SectionOrders from "./SectionOrders";
import Loading from "../../../components/loaders/Loading";

import ASModalStyles from "../../ASModalWrapper/styles.module.css";

const ProductModal = ({ isHidden, onClose }) => {
  const { modalParams, syncCloseModal, syncOpenModal } = useModalNavigation();
  const itemNo = modalParams?.itemNo;

  const { data, isLoading } = useFetchProductCard(itemNo ?? null);
  const { customerOrders, productInfo = [], sessionInfo } = data?.data || {};
  const product = productInfo[0] || {};

  if (!modalParams) return null;
  return (
    <ASModalWrapper isHidden={isHidden} onClose={onClose}>
      {isLoading ? <Loading /> : null}
      <div className={ASModalStyles.stickyTitleBar}>
        <div className={ASModalStyles.title}>
          <h3>{`Product Card ${"\u2022"} ${itemNo || ""}`}</h3>
        </div>
        <div className={ASModalStyles.titleButtons}>
          {/* Add buttons later for Navigation between products? */}
        </div>
      </div>
      <div className={ASModalStyles.modalBody}>
        <SectionInventory data={product} session={sessionInfo} />
        <SectionAttributes data={product} />
        <SectionInformation data={product} />
        <SectionOrders rows={customerOrders} />
      </div>

      <div className="btn-container">
        <button className="regular-btn cancel-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </ASModalWrapper>
  );
};

export default ProductModal;
