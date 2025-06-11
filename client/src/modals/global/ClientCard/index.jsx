//
// client/src/components/modals/ClientCard/index.jsx

import ASModalWrapper from "../../ASModalWrapper";
import ASModalStyles from "../../ASModalWrapper/styles.module.css";

import { useModalNavigation } from "../../../hooks/useModalNavigation";
import useFetchCustomerCard from "../../../hooks/fetch/customers/useFetchCustomerCard";

import SectionOrders from "./SectionOrders";
import Loading from "../../../components/loaders/Loading";

const ClientCard = ({ isHidden, onClose }) => {
  const { modalParams } = useModalNavigation();
  const clientId = modalParams?.clientId;

  const { data, isLoading } = useFetchCustomerCard(clientId);
  const orders = data?.data?.orders || [];
  const customer = data?.data?.client[0] || [];

  if (!modalParams) return null;
  return (
    <ASModalWrapper isHidden={isHidden} onClose={onClose} size="medium">
      {isLoading && <Loading />}
      <div className={ASModalStyles.stickyTitleBar}>
        <div className={ASModalStyles.title}>
          <h3>{`Client Card ${"\u2022"} ${customer?.names?.name || ""}`}</h3>
          <div className={ASModalStyles.titleButtons}></div>
        </div>
      </div>
      <div className={ASModalStyles.modalBody}>
        <SectionOrders rows={orders} />
      </div>
      <div className="btn-container">
        <button className="regular-btn cancel-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </ASModalWrapper>
  );
};

export default ClientCard;
