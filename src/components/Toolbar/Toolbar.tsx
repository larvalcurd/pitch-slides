import { wrapperStyle, buttonStyle } from './Toolbar.styles.ts';

import {
  handleAddText,
  handleAddImage,
  handleMoveObject,
  handleResizeObject,
  handleBringForward,
  handleSendBackward,
  handleUpdateText,
} from './Toolbar.handlers.ts';

type ToolbarProps = {
  actions: Record<string, () => void>;
};

type ToolbarButton = {
  label: string;
  action: string;
  onClick?: () => void;
};

export const ToolbarActions = {
  addText: handleAddText,
  addImage: handleAddImage,
  moveObject: handleMoveObject,
  resizeObject: handleResizeObject,
  bringForward: handleBringForward,
  sendBackward: handleSendBackward,
  updateText: handleUpdateText,
};

export default function Toolbar({ actions }: ToolbarProps) {
  const ToolbarButtons: ToolbarButton[] = [
    { label: 'Add Slide', action: 'addSlide' },
    { label: 'Delete Slide', action: 'deleteSlide' },
    { label: 'Add Text', action: 'addText' },
    { label: 'Add Image', action: 'addImage' },
    { label: 'Delete Object', action: 'deleteObject' },
    { label: 'Change Background', action: 'changeBackground' },
    { label: 'Move', action: 'moveObject' },
    { label: 'Resize', action: 'resizeObject' },
    { label: 'Bring Forward', action: 'bringForward' },
    { label: 'Send Backward', action: 'sendBackward' },
    { label: 'Update Text', action: 'updateText' },
  ];

  return (
    <div style={wrapperStyle} role="toolbar" aria-label="Editor toolbar">
      {ToolbarButtons.map((button, idx) => {
        return (
          <button
            key={idx}
            type="button"
            style={buttonStyle}
            onClick={() => {
              console.log(`Action: ${button.action}`);
              actions[button.action]?.();
            }}
          >
            {button.label}
          </button>
        );
      })}
    </div>
  );
}
