// src/components/Toolbar.tsx
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

    return (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            <button type="button" onClick={() => handle('add-default-text-object', onAddText)} aria-label="Add default text object" style={btnStyle}>
                ✏️ Add Text
            </button>

            <button type="button" onClick={() => handle('add-default-image-object', onAddImage)} aria-label="Add default image object" style={btnStyle}>
                🖼️ Add Image
            </button>

            <div style={{ width: 1, height: 28, background: '#e5e7eb', margin: '0 8px' }} />

            <button type="button" onClick={() => handle('move-selected-object', onMoveObject)} aria-label="Move selected object" style={btnStyle}>
                ⤴ Move
            </button>

            <button type="button" onClick={() => handle('resize-selected-object', onResizeObject)} aria-label="Resize selected object" style={btnStyle}>
                ⤦ Resize
            </button>

            <button type="button" onClick={() => handle('bring-selected-forward', onBringForward)} aria-label="Bring forward" style={btnStyle}>
                ⬆ Bring Forward
            </button>

            <button type="button" onClick={() => handle('send-selected-backward', onSendBackward)} aria-label="Send backward" style={btnStyle}>
                ⬇ Send Backward
            </button>

            <div style={{ width: 1, height: 28, background: '#e5e7eb', margin: '0 8px' }} />

            <button type="button" onClick={() => handle('update-text-content', onUpdateText)} aria-label="Update text content" style={btnStyle}>
                🅰 Update Text
            </button>

            <button type="button" onClick={() => handle('update-image-source', onUpdateImage)} aria-label="Update image source" style={btnStyle}>
                🌄 Update Image
            </button>
        </div>
    );
}
