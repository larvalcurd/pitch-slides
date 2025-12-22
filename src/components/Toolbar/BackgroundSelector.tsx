import React, { useState } from 'react';
import styles from './Toolbar.module.css';
import type { SlideBackground } from '../../entities/slide/types/SlideTypes';

type BackgroundSelectorProps = {
  onSelect: (background: SlideBackground) => void;
  onClose: () => void;
};

export default function BackgroundSelector({ onSelect, onClose }: BackgroundSelectorProps) {
  type BackgroundType = SlideBackground['type'];
  const [type, setType] = useState<BackgroundType>('color');
  const [color, setColor] = useState('#ffffff');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
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
            <input type="color" value={color} onChange={e => setColor(e.target.value)} />
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
