import { useState } from 'react';

export type ModalType = 'background' | 'addImage' | null;

export default function useEditorUI() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return {
    activeModal,
    handleOpenModal: (modal: ModalType) => setActiveModal(modal),
    handleCloseModal: () => setActiveModal(null),
  };
}
