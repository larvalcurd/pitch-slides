import type { Presentation } from '../entities/presentation/types/PresentationTypes';
import { createPresentation } from '../entities/presentation/utils/PresentationUtils';
import { useState } from 'react';
import PresentationTitle from '../components/PresentationTitle.tsx';
import Toolbar from '../components/Toolbar.tsx';
import { createMinimalText } from '../entities/object/factory/TextObjectFactory';
import { createMinimalImage } from '../entities/object/factory/ImageObjectFactory';
import { moveObject, resizeObject, setObjectZIndex } from '../entities/object/utils/ObjectUtils';
import { updateTextContent } from '../entities/object/utils/TextObjectUtils';

function App() {
    const [presentation, setPresentation] = useState<Presentation>(() =>
        createPresentation('p1', 'Untitled presentation', [])
    );

    const handleTitleChange = (newTitle: string) => {
        setPresentation((prev) => {
            if (prev.title === newTitle) return prev;
            console.log('Presentation title changed:', newTitle);
            return { ...prev, title: newTitle };
        });
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

    const handleUpdateImage = () => {
        const obj = createMinimalImage();
        const updated = { ...obj, src: obj.src === '' ? 'image-1.png' : 'image-2.png' };
        console.log('Updated image object:', { before: obj, after: updated });
    };

    return (
        <div style={{ padding: 24, background: '#f6f7fb', minHeight: '100vh', fontFamily: 'Inter, Roboto, system-ui' }}>
            <PresentationTitle title={presentation.title} onTitleChange={handleTitleChange} />
            <Toolbar
                onAddText={handleAddText}
                onAddImage={handleAddImage}
                onMoveObject={handleMoveObject}
                onResizeObject={handleResizeObject}
                onBringForward={handleBringForward}
                onSendBackward={handleSendBackward}
                onUpdateText={handleUpdateText}
                onUpdateImage={handleUpdateImage}
            />
        </div>
    );
}

export default App;
