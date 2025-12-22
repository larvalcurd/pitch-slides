import styles from './Toolbar.module.css';
import { ChangeBackgroundButton } from './ChangeBackgroundButton';

type ToolbarProps = {
  actions: Record<string, (...args: any[]) => void>;
};

type ToolbarButton = {
  label: string;
  action: string;
  onClick?: () => void;
};

export default function Toolbar({ actions }: ToolbarProps) {
  const ToolbarButtons: ToolbarButton[] = [
    {
      label: 'Add Slide',
      action: 'addSlide',
    },
    {
      label: 'Delete Slide',
      action: 'deleteSlide',
    },
    {
      label: 'Add Text',
      action: 'addText',
    },
    {
      label: 'Add Image',
      action: 'addImage',
    },
    {
      label: 'Delete Object',
      action: 'deleteObject',
    },
    {
      label: 'Move',
      action: 'moveObject',
    },
    {
      label: 'Resize',
      action: 'resizeObject',
    },
    {
      label: 'Bring Forward',
      action: 'bringForward',
    },
    {
      label: 'Send Backward',
      action: 'sendBackward',
    },
    {
      label: 'Update Text',
      action: 'updateText',
    },
  ];

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Editor toolbar">
      {ToolbarButtons.map((button, idx) => {
        return (
          <button
            key={idx}
            type="button"
            className={styles.button}
            onClick={() => {
              console.log(`Action: ${button.action}`);
              if (button.onClick) {
                button.onClick();
              } else {
                actions[button.action as keyof typeof actions]?.();
              }
            }}
          >
            {button.label}
          </button>
        );
      })}
      <ChangeBackgroundButton changeBackground={actions.changeBackground} />
    </div>
  );
}
