import usePresentation from '../hooks/usePresentation.ts';
import useEditorUI from '../hooks/useEditorUI.ts';
import PresentationTitle from '../components/PresentationTitle/PresentationTitle.tsx';
import Toolbar from '../components/Toolbar/Toolbar.tsx';
import SlideList from '../components/SlideList/SlideList.tsx';
import { SlideCanvas } from '../components/SlideCanvas';
import BackgroundSelector from '../components/BackgroundSelector/BackgroundSelector.tsx';
import ImageSelector from '../components/ImageSelector/ImageSelector.tsx';

function App() {
  const { actions } = usePresentation();

  const { activeModal, handleOpenModal, handleCloseModal } = useEditorUI();

  const toolbarActions = {
    onAddSlide: actions.handleAddSlide,
    onDeleteSlide: actions.handleDeleteSlide,
    onAddText: actions.handleAddText,
    onDeleteObject: actions.handleDeleteObject,
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
      <SlideList onSelect={actions.handleSelectSlide} />

      <main
        style={{
          flex: 1,
          padding: 16,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PresentationTitle onTitleChange={actions.changeTitle} />

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
            onSelectObject={actions.handleSelectObject}
            onDeselectAll={actions.handleDeselectAll}
            onStartEditingText={actions.handleStartEditingText}
            onStopEditingText={actions.handleStopEditingText}
            onUpdateTextContent={actions.handleUpdateTextContent}
          />
        </div>
      </main>

      {activeModal === 'addImage' && (
        <ImageSelector
          onSelect={payload => {
            actions.handleAddImage(payload);
            handleCloseModal();
          }}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'background' && (
        <BackgroundSelector
          onSelect={bg => {
            actions.handleChangeSlideBackground(bg);
            handleCloseModal();
          }}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;
