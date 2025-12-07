import type { Presentation } from '../entities/presentation/types/PresentationTypes.ts';
import { createPresentation, updatePresentationTitle } from '../entities/presentation/utils/PresentationUtils';
import { PresentationTitle } from '../components/PresentationTitle/PresentationTitle.tsx';
import { useState } from 'react';
import Toolbar from '../components/Toolbar.tsx';
import { createMinimalText } from '../entities/object/factory/TextObjectFactory';
import { createMinimalImage } from '../entities/object/factory/ImageObjectFactory';
import { moveObject, resizeObject, setObjectZIndex } from '../entities/object/utils/ObjectUtils';
import { updateTextContent } from '../entities/object/utils/TextObjectUtils';

function App() {
    const [presentation, setPresentation] = useState<Presentation>(() =>
        createPresentation('p1', 'Untitled presentation', [])
    );

    const changeTitle = (newTitle: string) => {
        setPresentation(() => {
            console.log('Presentation title changed:', newTitle);
            return updatePresentationTitle(presentation, newTitle);
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

    const actions = {
        addText: handleAddText,
        addImage: handleAddImage,
        moveObject: handleMoveObject,
        resizeObject: handleResizeObject,
        bringForward: handleBringForward,
        sendBackward: handleSendBackward,
        updateText: handleUpdateText,
    };

    return (
        <div>
            <PresentationTitle title={presentation.title} onTitleChange={changeTitle} />
            <Toolbar actions={actions} />
        </div>
    );
}

export default App;
