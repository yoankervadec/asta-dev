//
// client/src/components/modals/ModalContainer/ModalContainer.jsx

import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useModalStore } from "../../../store/useModalStore";
import { useModalNavigation } from "../../../hooks/useModalNavigation";
import ErrorModal from "../ErrorModal";
import ProgressModal from "../ProgressModal";
import ConfirmationModal from "../ConfirmationModal";
import CustomerOrderCard from "../CustomerOrderCard";
import ClientCard from "../ClientCard";
import ProductModal from "../ProductModal";

import styles from "./styles.module.css";

export default function ModalContainer() {
  const { modals, setModalsFromURL } = useModalStore();
  const { syncCloseModal } = useModalNavigation();
  const [searchParams] = useSearchParams();
  const dialogRefs = useRef([]);

  useEffect(() => {
    // Parse the URL and set modals in Zustand on page load
    const modalParams = searchParams.getAll("modal");
    const restoredModals = modalParams.map((m) => JSON.parse(atob(m)));

    if (restoredModals.length !== modals.length) {
      setModalsFromURL(restoredModals);
    }
  }, [searchParams]);

  useEffect(() => {
    modals.forEach((_, index) => {
      if (dialogRefs.current[index]) {
        dialogRefs.current[index].showModal();
      }
    });
  }, [modals]);

  return (
    <>
      {modals.map((modal, index) => {
        const isHidden = index < modals.length - 3;

        let Content = null;
        switch (modal.type) {
          case "error":
            Content = <ErrorModal {...modal.props} />;
            break;
          case "confirmation":
            Content = <ConfirmationModal {...modal.props} />;
            break;
          case "progress":
            Content = <ProgressModal {...modal.props} />;
            break;
          case "clientCard":
            Content = <ClientCard {...modal.props} />;
            break;
          case "customerOrderCard":
            Content = <CustomerOrderCard {...modal.props} />;
            break;
          case "productCard":
            Content = <ProductModal {...modal.props} />;
            break;
        }

        return (
          <dialog
            key={index}
            ref={(el) => (dialogRefs.current[index] = el)}
            className={`${styles.modal} ${isHidden ? styles.hidden : ""}`}
            onClose={syncCloseModal}
          >
            <div className={styles.modalContainer}>{Content}</div>
          </dialog>
        );
      })}
    </>
  );
}
