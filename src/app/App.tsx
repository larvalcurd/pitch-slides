import { useState } from 'react';
import type { Presentation } from '../entities/presentation/types/PresentationTypes.ts';
import type { Slide } from '../entities/slide/types/SlideTypes.ts';
import type { SlideObject } from '../entities/object/types/ObjectTypes.ts';
import {
    addSlide,
    createPresentation,
    deleteSlide,
    setSelectedSlide,
    updatePresentationTitle,
    updateSlideInPresentation,
} from '../entities/presentation/utils/PresentationUtils';
import { createSlide } from '../entities/slide/factory/SlideFactory.ts';
import { PresentationTitle } from '../components/PresentationTitle/PresentationTitle.tsx';
import Toolbar, { ToolbarActions } from '../components/Toolbar/Toolbar.tsx';
import SlideList from '../components/SlideLIst.tsx';
import SlideCanvas from '../components/SlideCanvas/SlideCanvas.tsx';
import {
    createTextObject,
} from '../entities/object/factory/TextObjectFactory.ts';
import { createMinimalImage } from '../entities/object/factory/ImageObjectFactory.ts';
import { addObjectToSlide } from '../entities/slide/utils/SlideUtils.ts';

function App() {
    const [presentation, setPresentation] = useState<Presentation>(() =>
        createPresentation('p1', 'Untitled presentation', [])
    );

    const changeTitle = (newTitle: string) => {
        setPresentation((prevPresentation) => {
            console.log('Presentation title changed:', newTitle);
            return updatePresentationTitle(prevPresentation, newTitle);
        });
    };

    const handleSelectSlide = (slideId: string) => {
        setPresentation((prev) => setSelectedSlide(prev, slideId));
    };

    const handleAddSlide = () => {
        setPresentation((prev) => {
            const newSlide: Slide = createSlide();
            console.log('Adding new slide:', newSlide.id);
            return addSlide(prev, newSlide);
        });
    };

    const handleDeleteSlide = () => {
        setPresentation((prev) => {
            if (!prev.selectedSlideId) {
                console.log('No slide selected to delete');
                return prev;
            }
            console.log('Deleting slide:', prev.selectedSlideId);
            return deleteSlide(prev, prev.selectedSlideId);
        });
    };

    const handleAddObject = (createFn: () => SlideObject) => {
        setPresentation((prev) => {
            const slide = prev.slides.find((s) => s.id === prev.selectedSlideId);
            if (!slide) {
                console.log('No slide selected — cannot add object');
                return prev;
            }

            const obj = createFn();
            console.log(`Adding object ${obj.id} to slide ${slide.id}`);

            const updatedSlide = addObjectToSlide(slide, obj);
            return updateSlideInPresentation(prev, slide.id, updatedSlide);
        });
    };

    const handleAddText = () =>
        handleAddObject(() =>
            createTextObject({
                x: 20,
                y: 20,
                width: 300,
                height: 80,
                content: 'New text',
            })
        );
    const handleAddImage = () => handleAddObject(() => createMinimalImage({ x: 30, y: 30 }));

    const actions = {
        ...ToolbarActions,
        addSlide: handleAddSlide,
        deleteSlide: handleDeleteSlide,
        addText: handleAddText,
        addImage: handleAddImage,
    };

    const selectedSlide =
        presentation.slides.find((s) => s.id === presentation.selectedSlideId) ?? null;

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <SlideList
                slides={presentation.slides}
                selectedSlideId={presentation.selectedSlideId}
                onSelect={handleSelectSlide}
                width={220}
            />

            <main
                style={{
                    flex: 1,
                    padding: 16,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <PresentationTitle title={presentation.title} onTitleChange={changeTitle} />
                <Toolbar actions={actions} />

                <div
                    style={{
                        flex: 1,
                        marginTop: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <SlideCanvas slide={selectedSlide} slideWidth={960} slideHeight={540} />
                </div>
            </main>
        </div>
    );
}

export default App;
