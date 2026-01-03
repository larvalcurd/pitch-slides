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
    presentation,
    currentSlide,

    selectedSlideIds,
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
    handleMoveSlides,
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

  const { activeModal, handleOpenModal, handleCloseModal } = useEditorUI();

  const toolbarActions = {
    onAddSlide: handleAddSlide,
    onDeleteSlide: handleDeleteSlide,
    onAddText: handleAddText,
    onDeleteObject: handleDeleteObject,
    onMoveObject: () => console.log('Move object'),
    onResizeObject: () => console.log('Resize object'),
    onBringForward: () => console.log('Bring forward'),
    onSendBackward: () => console.log('Send backward'),
    onUpdateText: () => console.log('Update text'),
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
        selectedSlideIds={selectedSlideIds}
        onSelect={handleSelectSlide}
        startDrag={startDrag}
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

        <Toolbar actions={toolbarActions} onOpenModal={handleOpenModal} />

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
            currentSlide={currentSlide}
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
            handleCloseModal();
          }}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'background' && (
        <BackgroundSelector
          currentBackground={currentSlide?.background}
          onSelect={bg => {
            handleChangeSlideBackground(bg);
            handleCloseModal();
          }}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;
