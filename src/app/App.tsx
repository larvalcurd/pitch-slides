import type { Presentation } from '../entities/presentation/types/PresentationTypes';
import { createPresentation } from '../entities/presentation/utils/PresentationUtils';
import { useState } from 'react';
import { PresentationTitle } from '../components/PresentationTitle/PresentationTitle.tsx';
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
        setPresentation((prev) => {
            if (prev.title === newTitle) return prev;
            console.log('Presentation title changed:', newTitle);
            return { ...prev, title: newTitle };
        });
    };

    const addText = () => {
        const obj = createMinimalText();
        console.log('Created minimal text object:', obj);
    };

    const addImage = () => {
        const obj = createMinimalImage();
        console.log('Created minimal image object:', obj);
    };

    const moveObjectHandler = () => {
        const obj = createMinimalText();
        const moved = moveObject(obj, obj.x + 10, obj.y + 10);
        console.log('Moved object:', { before: obj, after: moved });
    };

    const resizeObjectHandler = () => {
        const obj = createMinimalImage();
        const resized = resizeObject(obj, obj.width + 20, obj.height + 20);
        console.log('Resized object:', { before: obj, after: resized });
    };

    const bringForward = () => {
        const obj = createMinimalText();
        const bumped = setObjectZIndex(obj, obj.zIndex + 1);
        console.log('Brought forward:', { before: obj, after: bumped });
    };

    const sendBackward = () => {
        const obj = createMinimalText();
        const bumped = setObjectZIndex(obj, Math.max(0, obj.zIndex - 1));
        console.log('Sent backward:', { before: obj, after: bumped });
    };

    const updateTextHandler = () => {
        const obj = createMinimalText();
        const updated = updateTextContent(obj, obj.content === '' ? 'Hello' : obj.content + '!');
        console.log('Updated text object:', { before: obj, after: updated });
    };

    const updateImageHandler = () => {
        const obj = createMinimalImage();
        const updated = { ...obj, src: '../../../newImage.png' };
        console.log('Updated image object:', { before: obj, after: updated });
    };

    return (
        <div>
            <PresentationTitle title={presentation.title} onTitleChange={changeTitle} />

            <Toolbar
                onAddText={addText}
                onAddImage={addImage}
                onMoveObject={moveObjectHandler}
                onResizeObject={resizeObjectHandler}
                onBringForward={bringForward}
                onSendBackward={sendBackward}
                onUpdateText={updateTextHandler}
                onUpdateImage={updateImageHandler}
            />
        </div>
    );
}

export default App;
