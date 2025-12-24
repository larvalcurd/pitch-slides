import { useState } from 'react';

type ModalType = 'background' | null;

export function useEditorUI() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return {
    activeModal,
    openModal: (modal: ModalType) => setActiveModal(modal),
    closeModal: () => setActiveModal(null),
  };
}
