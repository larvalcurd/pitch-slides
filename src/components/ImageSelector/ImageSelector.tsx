import { useState } from 'react';
import type { ImagePayload } from '../../entities/object/types/ImagePayload';
import styles from './ImageSelector.module.css';

type ImageSelectorProps = {
  onSelect: (payload: ImagePayload) => void;
  onClose: () => void;
};

type ImageData = {
  src: string;
  naturalWidth: number;
  naturalHeight: number;
};

export default function ImageSelector({ onSelect, onClose }: ImageSelectorProps) {
  const [imageData, setImageData] = useState<ImageData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;

      const img = new Image();
      img.onload = () => {
        setImageData({
          src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    if (!imageData) return;

    onSelect({
      src: imageData.src,
      naturalWidth: imageData.naturalWidth,
      naturalHeight: imageData.naturalHeight,
    });

    onClose();
  };

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.content} onClick={e => e.stopPropagation()}>
        <h3>Add Image</h3>

        <div>
          <label>Upload image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {imageData && (
          <div style={{ marginTop: 12 }}>
            <img src={imageData.src} alt="Preview" style={{ maxWidth: 200, maxHeight: 200 }} />
            <p>
              Original size: {imageData.naturalWidth} x {imageData.naturalHeight}
            </p>
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <button onClick={handleApply} disabled={!imageData}>
            Add
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
