//
// client/src/components/modals/ErrorModal/index.jsx

import { useModalStore } from "../../../store/useModalStore";
import { useQueryClient } from "@tanstack/react-query";

import styles from "./styles.module.css";

const ErrorModal = ({ status, message, details }) => {
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();

  // Pause all refetching while the error modal is open
  queryClient.setDefaultOptions({
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    },
  });

  const handleClose = () => {
    // Restore refetching behavior
    queryClient.setDefaultOptions({
      queries: {
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        retry: false,
        refetchInterval: 30000,
      },
    });
    queryClient.invalidateQueries();
    closeModal();
  };

  return (
    <div className={styles.errorModalContainer}>
      <div className={styles.titleWrapper}>
        <i className="fas fa-circle-exclamation"></i>
        <h2>Error</h2>
      </div>
      <div className={styles.errorMessage}>
        <span>{`[${status}]: ${details}`}</span>
        {details && (
          <span className={styles.details}>
            <pre>{message}</pre>
          </span>
        )}
      </div>
      <div className="btn-container">
        <button
          onClick={() => {
            handleClose();
          }}
          className="regular-btn cancel-btn"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
