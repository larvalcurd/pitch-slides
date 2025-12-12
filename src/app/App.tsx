import type { Presentation } from '../entities/presentation/types/PresentationTypes.ts';
import type { Slide } from '../entities/slide/types/SlideTypes.ts';
import {
    createPresentation,
    updatePresentationTitle,
    setSelectedSlide,
    addSlide,
    deleteSlide,
} from '../entities/presentation/utils/PresentationUtils';
import { PresentationTitle } from '../components/PresentationTitle/PresentationTitle.tsx';
import { useState } from 'react';
import Toolbar, { ToolbarActions } from '../components/Toolbar/Toolbar.tsx';
import SlideList from '../components/SlideLIst.tsx';
import { createSlide } from '../entities/slide/factory/SlideFactory.ts';
import SlideCanvas from '../components/SlideCanvas/SlideCanvas.tsx';

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

    const actions = { ...ToolbarActions, addSlide: handleAddSlide, deleteSlide: handleDeleteSlide };

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

                {/* Slide preview area — centers the selected slide */}
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
