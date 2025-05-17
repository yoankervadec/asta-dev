//
// client/src/components/modals/ConfirmationModal/index.jsx

import { useQueryClient } from "@tanstack/react-query";
import { useModalStore } from "../../../store/useModalStore";
import { usePostHelper } from "../../../api/postHelper";
import Loading from "../../loaders/Loading";

import styles from "../ErrorModal/styles.module.css"; // from ErrorModal

const ConfirmationModal = ({ message, action, body = {} }) => {
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();

  const { mutateAsync: processAction, isPending } = usePostHelper(action);
  const handleConfirm = async () => {
    await processAction({ ...body });
    closeModal();
    queryClient.invalidateQueries();
  };
  return (
    <div className={styles.errorModalContainer}>
      {isPending && <Loading />}
      <div className={styles.titleWrapper}>
        <i className="fas fa-hourglass-half"></i>
        <h2>Confirmation Required</h2>
      </div>
      <div className={styles.errorMessage}>
        <p>{message}</p>
      </div>
      <div className="btn-container">
        <button className="regular-btn cancel-btn" onClick={() => closeModal()}>
          Cancel
        </button>
        <button className="regular-btn confirm-btn" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
