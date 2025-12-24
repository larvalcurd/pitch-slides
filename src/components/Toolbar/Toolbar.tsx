import styles from './Toolbar.module.css';

type ToolbarItem =
  | { type: 'action'; label: string; action: string }
  | { type: 'modal'; label: string; modal: 'background' };

type ToolbarProps = {
  actions: Record<string, () => void>;
  onOpenModal: (modal: 'background') => void;
};

const toolbarConfig: ToolbarItem[] = [
  { type: 'action', label: 'Add Slide', action: 'addSlide' },
  { type: 'action', label: 'Delete Slide', action: 'deleteSlide' },
  { type: 'action', label: 'Add Text', action: 'addText' },
  { type: 'action', label: 'Add Image', action: 'addImage' },
  { type: 'action', label: 'Delete Object', action: 'deleteObject' },
  { type: 'modal', label: 'Change Background', modal: 'background' },
  { type: 'action', label: 'Move', action: 'moveObject' },
  { type: 'action', label: 'Resize', action: 'resizeObject' },
  { type: 'action', label: 'Bring Forward', action: 'bringForward' },
  { type: 'action', label: 'Send Backward', action: 'sendBackward' },
  { type: 'action', label: 'Update Text', action: 'updateText' },
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
