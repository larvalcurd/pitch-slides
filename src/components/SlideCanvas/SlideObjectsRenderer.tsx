import type { ResizeHandle, SlideObject } from '../../entities/object/types/ObjectTypes';
import DraggableObject from './DraggableObject';
import TextObjectComponent from './TextObjectComponent';
import ImageObjectComponent from './ImageObjectComponent';
import type { ResizePreview } from '../../entities/editor/types/UIStateTypes';

type Props = {
  slideId: string;

  objects: SlideObject[];
  selectedObjectIds: string[];
  onSelectObject: (objectId: string, multi: boolean) => void;

  isDragging: boolean;
  startDrag: (
    context: {
      type: 'object';
      slideId: string;
      objectIds: string[];
    },
    e: React.MouseEvent,
  ) => void;

  getDeltaForObject: (objectId: string) => { x: number; y: number };

  isResizing: boolean;
  resizingObjectId: string | null;
  resizePreview: ResizePreview | null;
  startResize: (e: React.MouseEvent, objectId: string, handle: ResizeHandle) => void;

  editingTextObjectId?: string | null;
  onStartEditingText: (objectId: string) => void;
  onStopEditingText: () => void;
  onUpdateTextContent: (objectId: string, content: string) => void;
};

export default function SlideObjectsRenderer({
  slideId,
  objects,
  selectedObjectIds,
  onSelectObject,
  isDragging,
  startDrag,
  getDeltaForObject,
  isResizing,
  resizingObjectId,
  resizePreview,
  startResize,
  editingTextObjectId,
  onStartEditingText,
  onStopEditingText,
  onUpdateTextContent,
}: Props) {
  const renderContent = (obj: SlideObject) => {
    switch (obj.type) {
      case 'text':
        return (
          <TextObjectComponent
            text={obj}
            isEditing={editingTextObjectId === obj.id}
            onStartEditing={() => onStartEditingText(obj.id)}
            onStopEditing={onStopEditingText}
            onUpdateContent={content => onUpdateTextContent(obj.id, content)}
          />
        );
      case 'image':
        return <ImageObjectComponent image={obj} />;
      default:
        return null;
    }
  };

  return (
    <>
      {objects.map(obj => {
        const isSelected = selectedObjectIds.includes(obj.id);
        const isObjDragging = isDragging && isSelected;
        const isObjResizing = isResizing && resizingObjectId === obj.id;

        return (
          <DraggableObject
            key={obj.id}
            object={obj}
            isSelected={isSelected}
            onSelectObject={onSelectObject}
            isDragging={isObjDragging}
            dragDelta={getDeltaForObject(obj.id)}
            onStartDrag={e => {
              const objectsToMove =
                isSelected && selectedObjectIds.length > 0 ? selectedObjectIds : [obj.id];

              startDrag(
                {
                  type: 'object',
                  slideId,
                  objectIds: objectsToMove,
                },
                e,
              );
            }}
            isResizing={isObjResizing}
            resizePreview={isObjResizing ? resizePreview : null}
            onStartResize={(e, handle) => startResize(e, obj.id, handle)}
            onDoubleClick={obj.type === 'text' ? () => onStartEditingText(obj.id) : undefined}
          >
            {renderContent(obj)}
          </DraggableObject>
        );
      })}
    </>
  );
}
