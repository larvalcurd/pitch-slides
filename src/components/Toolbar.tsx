type ToolbarProps = {
    actions: Record<string, () => void>;
};

type BtnDef = {
    label: string;
    action: string;
    onClick?: () => void;
};

export default function Toolbar({ actions }: ToolbarProps) {
    const items: BtnDef[] = [
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
            {items.map((item, idx) => (
                <button
                    key={idx}
                    type="button"
                    onClick={() => {
                        console.log(`Action: ${item.action}`);
                        actions[item.action]?.();
                    }}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
