//
// client/src/modals/global/GlobalModalContainer.jsx

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useModalStore } from "../../store/useModalStore";
import { useModalNavigation } from "../../hooks/useModalNavigation";

import ErrorModal from "./ErrorModal";
import ProgressModal from "./ProgressModal";
import ConfirmationModal from "./ConfirmationModal";
import CustomerOrderCard from "./CustomerOrderCard";
import ClientCard from "./ClientCard";
import ProductModal from "./ProductModal";
import SessionModal from "./SessionModal";

import ASModalWrapper from "../ASModalWrapper";

const GlobalModalContainer = () => {
  const { modals, setModalsFromURL } = useModalStore();
  const { syncCloseModal } = useModalNavigation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Parse the URL and set modals in Zustand on page load
    const modalParams = searchParams.getAll("modal");
    const restoredModals = modalParams.map((m) => JSON.parse(atob(m)));

    if (restoredModals.length !== modals.length) {
      setModalsFromURL(restoredModals);
    }
  }, [searchParams]);

  // Prevent background scroll
  // useEffect(() => {
  //   document.body.style.overflow = modals.length > 0 ? "hidden" : "";
  //   return () => {
  //     document.body.style.overflow = "";
  //   };
  // }, [modals.length]);

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
          case "session":
            Content = <SessionModal {...modal.props} />;
            break;
          default:
            return null;
        }

        return (
          <ASModalWrapper
            key={index}
            isHidden={isHidden}
            zIndex={index}
            onClose={syncCloseModal}
          >
            {Content}
          </ASModalWrapper>
        );
      })}
    </>
  );
};

export default GlobalModalContainer;
