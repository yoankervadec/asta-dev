//
// client/src/hooks/useModalNavigation.js

import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useModalStore } from "../store/useModalStore";

export const useModalNavigation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { openModal, closeModal, setModalsFromURL } = useModalStore();
  const hasInitialized = useRef(false);

  // Restore modals from URL on first load
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const modalParams = searchParams.getAll("modal");
    const restoredModals = modalParams
      .map((m) => {
        try {
          return JSON.parse(atob(m));
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);

    if (restoredModals.length > 0) {
      setModalsFromURL(restoredModals);
    }
  }, []);

  // Get the last opened modal's params
  const getModalParams = () => {
    const modalParams = searchParams.getAll("modal");

    if (modalParams.length === 0) return null; // No modals open

    try {
      return JSON.parse(atob(modalParams[modalParams.length - 1])); // Decode last modal
    } catch (e) {
      return null; // Return null if decoding fails
    }
  };

  // Sync Zustand & URL when opening a modal
  const syncOpenModal = (type, props = {}) => {
    const { modals } = useModalStore.getState(); // Get current modals from Zustand
    // const isAlreadyOpen = modals.some(
    //   (m) =>
    //     m.type === type &&
    //     JSON.stringify(Object.entries(m.props).sort()) ===
    //       JSON.stringify(Object.entries(props).sort())
    // );

    // Prevent duplicate openings
    // if (isAlreadyOpen) return;

    openModal(type, props);

    const encodedModal = btoa(JSON.stringify({ type, ...props }));
    const newParams = new URLSearchParams(searchParams);
    newParams.append("modal", encodedModal);
    setSearchParams(newParams);
  };

  // Sync Zustand & URL when closing a modal
  const syncCloseModal = () => {
    closeModal();

    const { modals } = useModalStore.getState();
    const newParams = new URLSearchParams();

    modals.forEach((modal) =>
      newParams.append("modal", btoa(JSON.stringify(modal)))
    );

    setSearchParams(newParams, { replace: true });
  };

  return { syncOpenModal, syncCloseModal, modalParams: getModalParams() };
};
