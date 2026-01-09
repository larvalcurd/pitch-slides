import { useState } from 'react';
import type { SlideBackground } from '../../entities/slide/types/SlideTypes';
import styles from './BackgroundSelector.module.css';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { getSelectedSlideId } from '../../entities/editor/selection/editorSelection';

type BackgroundSelectorProps = {
  onSelect: (background: SlideBackground) => void;
  onClose: () => void;
};

export default function BackgroundSelector({ onSelect, onClose }: BackgroundSelectorProps) {
  const editor = useSelector((state: RootState) => state.editor);
  const selectedSlideId = getSelectedSlideId(editor);
  const currentSlide = editor.presentation.slides.find(s => s.id === selectedSlideId) ?? null;
  const currentBackground = currentSlide?.background;
  type BackgroundType = SlideBackground['type'];
  const [type, setType] = useState<BackgroundType>(currentBackground?.type ?? 'color');
  const [color, setColor] = useState(
    currentBackground?.type === 'color' ? currentBackground.value : '#ffffff',
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    currentBackground?.type === 'image' ? currentBackground.value : null,
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    const background: SlideBackground | null =
      type === 'color'
        ? { type: 'color', value: color }
        : imagePreview
          ? { type: 'image', value: imagePreview }
          : null;

    if (!background) return;

    onSelect(background);
    onClose();
  };

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.content} onClick={e => e.stopPropagation()}>
        <h3>Change Slide Background</h3>

        <div>
          <label>
            <input
              type="radio"
              value="color"
              checked={type === 'color'}
              onChange={() => setType('color')}
            />
            Color
          </label>
          <label>
            <input
              type="radio"
              value="image"
              checked={type === 'image'}
              onChange={() => setType('image')}
            />
            Image
          </label>
        </div>

        {type === 'color' && (
          <div>
            <label>Choose color:</label>
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className={styles.colorInput}
            />
          </div>
        )}

        {type === 'image' && (
          <div>
            <label>Upload image:</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: '200px', marginTop: '10px' }}
              />
            )}
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <button onClick={handleApply} disabled={type === 'image' && !imagePreview}>
            Apply
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
