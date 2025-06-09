//
// client/src/modals/ASModalWrapper/index.jsx

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FocusTrap } from "focus-trap-react";
import styles from "./styles.module.css";

const modalRoot = document.getElementById("as-modal-root");

const ASModalWrapper = ({ isHidden, zIndex, onClose, children }) => {
  if (!modalRoot) return null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return createPortal(
    <FocusTrap
      focusTrapOptions={{
        onDeactivate: onClose,
        escapeDeactivates: false,
      }}
    >
      <div
        className={`${styles.modalOverlay} ${isHidden ? styles.hidden : ""}`}
        onClick={onClose}
      >
        <button style={{ position: "absolute", opacity: 0 }} tabIndex="0">
          Hidden Focus Target
        </button>
        <div
          className={styles.childrenContainer}
          style={{ zIndex: zIndex }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          {children}
        </div>
      </div>
    </FocusTrap>,
    modalRoot
  );
};

export default ASModalWrapper;
