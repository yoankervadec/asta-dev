//
// client/src/components/modals/ClientCard/index.jsx

import { useModalNavigation } from "../../../hooks/useModalNavigation";
import useFetchCustomerCard from "../../../hooks/fetch/customers/useFetchCustomerCard";

import SectionOrders from "./SectionOrders";
import Loading from "../../../components/loaders/Loading";

import styles from "../ProductModal/styles.module.css"; // From Product Modal

const ClientCard = () => {
  const { modalParams, syncCloseModal } = useModalNavigation();
  const clientId = modalParams?.clientId;

  const { data, isLoading } = useFetchCustomerCard(clientId);
  const orders = data?.data?.orders || [];
  const customer = data?.data?.client[0] || [];

  if (!modalParams) return null;
  return (
    <div className={styles.productCardContainer}>
      {isLoading && <Loading />}
      <div className={styles.mainTitleWrapper}>
        <div className={styles.titleContent}>
          <h3>{`Client Card ${"\u2022"} ${customer?.names?.name || ""}`}</h3>
          <div className={styles.mainButtonWrapper}></div>
        </div>
      </div>
      <div className={styles.productCardContent}>
        <SectionOrders rows={orders} />
      </div>
      <div className="btn-container">
        <button className="regular-btn cancel-btn" onClick={syncCloseModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ClientCard;
