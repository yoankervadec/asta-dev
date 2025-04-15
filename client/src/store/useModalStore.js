//
// client/src/store/useModalStore.js

import { create } from "zustand";

export const useModalStore = create((set) => ({
  modals: [],

  openModal: (type, props = {}) =>
    set((state) => ({
      modals: [...state.modals, { type, props }],
    })),

  closeModal: (type = null) =>
    set((state) => ({
      modals: type
        ? state.modals.filter((modal) => modal.type !== type) // Remove specific modal
        : state.modals.slice(0, -1), // Default: remove last modal
    })),

  closeAllModals: () => set({ modals: [] }),

  setModalsFromURL: (modals) => set({ modals }),
}));
