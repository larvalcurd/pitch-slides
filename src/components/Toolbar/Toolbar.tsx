import { createMinimalImage } from '../../entities/object/factory/ImageObjectFactory';
import { createMinimalText } from '../../entities/object/factory/TextObjectFactory';
import { moveObject, resizeObject, setObjectZIndex } from '../../entities/object/utils/ObjectUtils';
import { updateTextContent } from '../../entities/object/utils/TextObjectUtils';

type ToolbarProps = {
    actions: Record<string, () => void>;
};

type ToolbarButton = {
    label: string;
    action: string;
    onClick?: () => void;
};

const handleAddText = () => {
    const obj = createMinimalText();
    console.log('Created minimal text object:', obj);
};

const handleAddImage = () => {
    const obj = createMinimalImage();
    console.log('Created minimal image object:', obj);
};

const handleMoveObject = () => {
    const obj = createMinimalText();
    const moved = moveObject(obj, obj.x + 10, obj.y + 10);
    console.log('Moved object:', { before: obj, after: moved });
};

const handleResizeObject = () => {
    const obj = createMinimalImage();
    const resized = resizeObject(obj, obj.width + 20, obj.height + 20);
    console.log('Resized object:', { before: obj, after: resized });
};

const handleBringForward = () => {
    const obj = createMinimalText();
    const bumped = setObjectZIndex(obj, obj.zIndex + 1);
    console.log('Brought forward:', { before: obj, after: bumped });
};

const handleSendBackward = () => {
    const obj = createMinimalText();
    const bumped = setObjectZIndex(obj, Math.max(0, obj.zIndex - 1));
    console.log('Sent backward:', { before: obj, after: bumped });
};

const handleUpdateText = () => {
    const obj = createMinimalText();
    const updated = updateTextContent(obj, obj.content === '' ? 'Hello' : obj.content + '!');
    console.log('Updated text object:', { before: obj, after: updated });
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
        { label: 'Add Text', action: 'addText' },
        { label: 'Add Image', action: 'addImage' },
        { label: 'Move', action: 'moveObject' },
        { label: 'Resize', action: 'resizeObject' },
        { label: 'Bring Forward', action: 'bringForward' },
        { label: 'Send Backward', action: 'sendBackward' },
        { label: 'Update Text', action: 'updateText' },
    ];

    return (
        <div>
            {ToolbarButtons.map((button, idx) => (
                <button
                    key={idx}
                    type="button"
                    onClick={() => {
                        console.log(`Action: ${button.action}`);
                        actions[button.action]?.();
                    }}
                >
                    {button.label}
                </button>
            ))}
        </div>
    );
}
