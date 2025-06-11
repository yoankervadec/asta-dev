//
// client/src/components/modals/ConfirmationModal/index.jsx

import ASModalWrapper from "../../ASModalWrapper";

import { useQueryClient } from "@tanstack/react-query";
import { usePostHelper } from "../../../api/postHelper";
import Loading from "../../../components/loaders/Loading";

import styles from "../ErrorModal/styles.module.css"; // from ErrorModal

const ConfirmationModal = ({
  message,
  action,
  body = {},
  isHidden,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: processAction, isPending } = usePostHelper(action);
  const handleConfirm = async () => {
    await processAction({ ...body });
    onClose();
    queryClient.invalidateQueries();
  };
  return (
    <ASModalWrapper
      isHidden={isHidden}
      onClose={onClose}
      isFrozen={isPending}
      size="extraSmall"
    >
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
          <button className="regular-btn cancel-btn" onClick={() => onClose()}>
            Cancel
          </button>
          <button className="regular-btn confirm-btn" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </ASModalWrapper>
  );
};

export default ConfirmationModal;
