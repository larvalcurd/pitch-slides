import { createMinimalImage } from '../../entities/object/factory/ImageObjectFactory';
import { createMinimalText } from '../../entities/object/factory/TextObjectFactory';
import { moveObject, resizeObject, setObjectZIndex } from '../../entities/object/utils/ObjectUtils';
import { updateTextContent } from '../../entities/object/utils/TextObjectUtils';

export const handleAddText = () => {
  const obj = createMinimalText();
  console.log('Created minimal text object:', obj);
  return obj;
};

export const handleAddImage = () => {
  const obj = createMinimalImage();
  console.log('Created minimal image object:', obj);
  return obj;
};

export const handleMoveObject = () => {
  const obj = createMinimalText();
  const moved = moveObject(obj, obj.x + 10, obj.y + 10);
  console.log('Moved object:', { before: obj, after: moved });
  return { before: obj, after: moved };
};

export const handleResizeObject = () => {
  const obj = createMinimalImage();
  const resized = resizeObject(obj, obj.width + 20, obj.height + 20);
  console.log('Resized object:', { before: obj, after: resized });
  return { before: obj, after: resized };
};

export const handleBringForward = () => {
  const obj = createMinimalText();
  const bumped = setObjectZIndex(obj, obj.zIndex + 1);
  console.log('Brought forward:', { before: obj, after: bumped });
  return { before: obj, after: bumped };
};

export const handleSendBackward = () => {
  const obj = createMinimalText();
  const bumped = setObjectZIndex(obj, Math.max(0, obj.zIndex - 1));
  console.log('Sent backward:', { before: obj, after: bumped });
  return { before: obj, after: bumped };
};

export const handleUpdateText = () => {
  const obj = createMinimalText();
  const updated = updateTextContent(obj, obj.content === '' ? 'Hello' : obj.content + '!');
  console.log('Updated text object:', { before: obj, after: updated });
  return { before: obj, after: updated };
};
