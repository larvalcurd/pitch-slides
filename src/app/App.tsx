import usePresentation from '../hooks/usePresentation.ts';
import useEditorUI from '../hooks/useEditorUI.ts';
import PresentationTitle from '../components/PresentationTitle/PresentationTitle.tsx';
import Toolbar from '../components/Toolbar/Toolbar.tsx';
import SlideList from '../components/SlideList/SlideList.tsx';
import { SlideCanvas } from '../components/SlideCanvas';
import BackgroundSelector from '../components/BackgroundSelector/BackgroundSelector.tsx';
import ImageSelector from '../components/ImageSelector/ImageSelector.tsx';

function App() {
  const {
    editor,
    presentation,
    currentSlide,
    selectedObjectIds,

    isDragging,
    startDrag,
    getDeltaForObject,

    isResizing,
    resizingObjectId,
    resizePreview,
    startResize,

    changeTitle,
    handleAddSlide,
    handleDeleteSlide,
    handleSelectSlide,
    handleChangeSlideBackground,

    handleAddText,
    handleAddImage,
    handleDeleteObject,

    handleSelectObject,
    handleDeselectAll,

    editingTextObjectId,
    handleStartEditingText,
    handleStopEditingText,
    handleUpdateTextContent,
  } = usePresentation();

  const { activeModal, openModal, closeModal } = useEditorUI();

  const toolbarActions = {
    addSlide: handleAddSlide,
    deleteSlide: handleDeleteSlide,
    addText: handleAddText,
    deleteObject: handleDeleteObject,
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
        selectedSlideId={editor.selection?.slideId}
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

        <Toolbar actions={toolbarActions} onOpenModal={openModal} />

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
            slide={currentSlide}
            selectedObjectIds={selectedObjectIds}
            onSelectObject={handleSelectObject}
            onDeselectAll={handleDeselectAll}
            isDragging={isDragging}
            startDrag={startDrag}
            getDeltaForObject={getDeltaForObject}
            isResizing={isResizing}
            resizingObjectId={resizingObjectId}
            resizePreview={resizePreview}
            startResize={startResize}
            editingTextObjectId={editingTextObjectId}
            onStartEditingText={handleStartEditingText}
            onStopEditingText={handleStopEditingText}
            onUpdateTextContent={handleUpdateTextContent}
          />
        </div>
      </main>

      {activeModal === 'addImage' && (
        <ImageSelector
          onSelect={payload => {
            handleAddImage(payload);
            closeModal();
          }}
          onClose={closeModal}
        />
      )}

      {activeModal === 'background' && (
        <BackgroundSelector
          currentBackground={
            presentation.slides.find(s => s.id === editor.selection?.slideId)?.background
          }
          onSelect={bg => {
            handleChangeSlideBackground(bg);
            closeModal();
          }}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default App;
