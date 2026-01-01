import { useState } from 'react';

export type ModalType = 'background' | 'addImage' | null;

export default function useEditorUI() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return {
    activeModal,
    openModal: (modal: ModalType) => setActiveModal(modal),
    closeModal: () => setActiveModal(null),
  };
}
