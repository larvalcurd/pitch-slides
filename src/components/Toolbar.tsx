import React from 'react';

type ToolbarProps = {
    onAddText?: () => void;
    onAddImage?: () => void;
    onMoveObject?: () => void;
    onResizeObject?: () => void;
    onBringForward?: () => void;
    onSendBackward?: () => void;
    onUpdateText?: () => void;
    onUpdateImage?: () => void;
};

type BtnDef =
    | {
    kind: 'button';
    label: string;
    action: string;
    onClick?: () => void;
}
    | {
    kind: 'divider';
};

export default function Toolbar({
                                    onAddText,
                                    onAddImage,
                                    onMoveObject,
                                    onResizeObject,
                                    onBringForward,
                                    onSendBackward,
                                    onUpdateText,
                                    onUpdateImage,
                                }: ToolbarProps) {
    const handle = (name: string, cb?: () => void) => {
        console.log(`Action: ${name}`);
        cb?.();
    };

    const btnStyle: React.CSSProperties = {
        padding: '8px 12px',
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        background: '#ffffff',
        cursor: 'pointer',
    };

    const items: BtnDef[] = [
        { kind: 'button', label: '✏️ Add Text', action: 'add-default-text-object', onClick: onAddText },
        { kind: 'button', label: '🖼️ Add Image', action: 'add-default-image-object', onClick: onAddImage },
        { kind: 'divider' },
        { kind: 'button', label: '⤴ Move', action: 'move-selected-object', onClick: onMoveObject },
        { kind: 'button', label: '⤦ Resize', action: 'resize-selected-object', onClick: onResizeObject },
        { kind: 'button', label: '⬆ Bring Forward', action: 'bring-selected-forward', onClick: onBringForward },
        { kind: 'button', label: '⬇ Send Backward', action: 'send-selected-backward', onClick: onSendBackward },
        { kind: 'divider' },
        { kind: 'button', label: '🅰 Update Text', action: 'update-text-content', onClick: onUpdateText },
        { kind: 'button', label: '🌄 Update Image', action: 'update-image-source', onClick: onUpdateImage },
    ];

    return (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            {items.map((it, idx) => {
                if (it.kind === 'divider') {
                    return (
                        <div
                            key={`div-${idx}`}
                            style={{
                                width: 1,
                                height: 28,
                                background: '#e5e7eb',
                                margin: '0 8px',
                            }}
                        />
                    );
                }

                return (
                    <button
                        key={`btn-${idx}`}
                        type="button"
                        onClick={() => handle(it.action, it.onClick)}
                        style={btnStyle}
                    >
                        {it.label}
                    </button>
                );
            })}
        </div>
    );
}
