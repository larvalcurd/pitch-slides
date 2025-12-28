import type { SlideObject } from '../../entities/object/types/ObjectTypes';
import DraggableObject from './DraggableObject';
import TextObjectComponent from './TextObjectComponent';
import ImageObjectComponent from './ImageObjectComponent';

type Props = {
  objects: SlideObject[];
  selectedObjectIds: string[];
  onSelectObject: (id: string, multiSelect?: boolean) => void;
  onUpdateObjectPosition: (id: string, x: number, y: number) => void;
  onUpdateObjectSize: (id: string, x: number, y: number, width: number, height: number) => void;
};

export default function SlideObjectsRenderer({
  objects,
  selectedObjectIds,
  onSelectObject,
  onUpdateObjectPosition,
  onUpdateObjectSize,
}: Props) {
  const renderContent = (obj: SlideObject) => {
    switch (obj.type) {
      case 'text':
        return <TextObjectComponent text={obj} />;
      case 'image':
        return <ImageObjectComponent image={obj} />;
      default:
        return null;
    }
  };

  return (
    <>
      {objects.map(obj => (
        <DraggableObject
          key={obj.id}
          object={obj}
          isSelected={selectedObjectIds.includes(obj.id)}
          onSelect={onSelectObject}
          onUpdatePosition={onUpdateObjectPosition}
          onUpdateSize={onUpdateObjectSize}
          minWidth={50}
          minHeight={30}
        >
          {renderContent(obj)}
        </DraggableObject>
      ))}
    </>
  );
}
