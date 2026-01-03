import type { ModalType } from '../../hooks/useEditorUI';
import styles from './Toolbar.module.css';

type ToolbarItem =
  | { type: 'action'; label: string; action: string }
  | { type: 'modal'; label: string; modal: ModalType };

type ToolbarProps = {
  actions: Record<string, () => void>;
  onOpenModal: (modal: ModalType) => void;
};

const toolbarConfig: ToolbarItem[] = [
  { type: 'action', label: 'Add Slide', action: 'onAddSlide' },
  { type: 'action', label: 'Delete Slide', action: 'onDeleteSlide' },
  { type: 'action', label: 'Add Text', action: 'onAddText' },
  { type: 'modal', label: 'Add Image', modal: 'addImage' },
  { type: 'action', label: 'Delete Object', action: 'onDeleteObject' },
  { type: 'modal', label: 'Change Background', modal: 'background' },
  { type: 'action', label: 'Move', action: 'onMoveObject' },
  { type: 'action', label: 'Resize', action: 'onResizeObject' },
  { type: 'action', label: 'Bring Forward', action: 'onBringForward' },
  { type: 'action', label: 'Send Backward', action: 'onSendBackward' },
  { type: 'action', label: 'Update Text', action: 'onUpdateText' },
];

export default function Toolbar({ actions, onOpenModal }: ToolbarProps) {
  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Editor toolbar">
      {toolbarConfig.map((item, idx) => (
        <button
          key={idx}
          type="button"
          className={styles.button}
          onClick={() => {
            if (item.type === 'action') {
              actions[item.action]?.();
            } else {
              onOpenModal(item.modal);
            }
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
