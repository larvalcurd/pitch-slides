import usePresentation from '../hooks/usePresentation.ts';
import { PresentationTitle } from '../components/PresentationTitle/PresentationTitle.tsx';
import Toolbar from '../components/Toolbar/Toolbar.tsx';
import SlideList from '../components/SlideList/SlideList.tsx';
import { SlideCanvas } from '../components/SlideCanvas';
import type { SlideBackground } from '../entities/slide';

function App() {
  const {
    presentation,
    changeTitle,
    handleAddSlide,
    handleDeleteSlide,
    handleSelectSlide,
    handleAddObject,
    handleDeleteObject,
    handleSelectObject,
    selectedObjectIds,
    handleChangeSlideBackground,
  } = usePresentation();

  const toolbarActions = {
    addSlide: handleAddSlide,
    deleteSlide: handleDeleteSlide,
    addText: () => handleAddObject('text'),
    addImage: () => handleAddObject('image'),
    deleteObject: handleDeleteObject,
    changeBackground: (background: SlideBackground) => handleChangeSlideBackground(background),
    moveObject: () => console.log('Move object'),
    resizeObject: () => console.log('Resize object'),
    bringForward: () => console.log('Bring forward'),
    sendBackward: () => console.log('Send backward'),
    updateText: () => console.log('Update text'),
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
      }}
      className="app"
    >
      <SlideList
        slides={presentation.slides}
        selectedSlideId={presentation.selectedSlideId}
        onSelect={handleSelectSlide}
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

        <Toolbar actions={toolbarActions} />

        <div
          style={{
            flex: 1,
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SlideCanvas
            slide={presentation.slides.find(s => s.id === presentation.selectedSlideId) ?? null}
            onSelectObject={handleSelectObject}
            selectedObjectIds={selectedObjectIds}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
