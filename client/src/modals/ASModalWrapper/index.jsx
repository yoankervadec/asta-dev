//
// client/src/modals/ASModalWrapper/index.jsx

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FocusTrap } from "focus-trap-react";
import styles from "./styles.module.css";

// Pre-defined modal sizes
const SIZE_MAP = {
  extraSmall: { width: "calc(40em + 15vw)", height: "calc(35svh - 2em)" },
  small: { width: "calc(40em + 15vw)", height: "calc(60svh - 2em)" },
  medium: { width: "calc(60em + 15vw)", height: "calc(90svh - 2em)" },
  large: { width: "calc(80em + 20vw)", height: "calc(100svh - 2em)" },
  fullScreen: { width: "calc(100vw - 2em)", height: "calc(100svh - 2em)" },
};

const modalRoot = document.getElementById("as-modal-root");

const ASModalWrapper = ({
  isHidden = false, // avoids very dark overlay when multiple instances
  zIndex = 0,
  onClose,
  size = "medium",
  isFrozen = false,
  children,
}) => {
  if (!modalRoot) return null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevents closing when frozen
      if (e.key === "Escape" && !isFrozen) {
        e.preventDefault();
        onClose?.();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className={`${styles.modalOverlay} ${isHidden ? styles.hidden : ""}`}
      onClick={onClose} // Closes when clicking overlay
    >
      <FocusTrap
        focusTrapOptions={{
          onDeactivate: () => onClose,
          escapeDeactivates: false,
          allowOutsideClick: () => !isFrozen,
        }}
      >
        <div>
          {/* Fallback for FocusTrap */}
          <button style={{ position: "absolute", opacity: 0 }} tabIndex="0">
            Hot Dogs
          </button>

          {/* Actual Modal */}
          <div
            className={styles.modalWrapper}
            style={{
              zIndex: zIndex,
              "--modal-width": SIZE_MAP[size]?.width,
              "--modal-height": SIZE_MAP[size]?.height,
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className={styles.childrenContainer}>
              <div className={styles.content}>{children}</div>
            </div>
            {isFrozen && <div className={styles.freezeOverlay}></div>}
          </div>
          {/* Actual Modal */}
        </div>
      </FocusTrap>
    </div>,
    modalRoot
  );
};

export default ASModalWrapper;
