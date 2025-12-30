import type { ResizeHandle, SlideObject } from '../../entities/object/types/ObjectTypes';
import DraggableObject from './DraggableObject';
import TextObjectComponent from './TextObjectComponent';
import ImageObjectComponent from './ImageObjectComponent';
import type { ResizePreview } from '../../entities/editor';

type Props = {
  objects: SlideObject[];
  selectedObjectIds: string[];
  onSelectObject: (id: string, multiSelect?: boolean) => void;

  isDragging: boolean;
  startDrag: (e: React.MouseEvent, objectIds: string[]) => void;
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
            onSelect={onSelectObject}
            isDragging={isObjDragging}
            dragDelta={getDeltaForObject(obj.id)}
            onStartDrag={e => {
              // Если объект уже выделен — тащим все выделенные
              // Если нет — тащим только этот
              const objectsToMove =
                isSelected && selectedObjectIds.length > 0 ? selectedObjectIds : [obj.id];
              startDrag(e, objectsToMove);
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
