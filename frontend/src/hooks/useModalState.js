import { useState } from 'react';

/**
 * Custom hook to manage multiple modals
 */
export const useModalState = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  const openModal = (modalName, data = null) => {
    setActiveModal(modalName);
    setModalData(data);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  const isModalOpen = (modalName) => {
    return activeModal === modalName;
  };

  return {
    activeModal,
    modalData,
    openModal,
    closeModal,
    isModalOpen
  };
};
