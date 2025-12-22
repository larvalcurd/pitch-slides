import { useState } from 'react';
import type { SlideBackground } from '../../entities/slide';
import BackgroundSelector from './BackgroundSelector';
import styles from './Toolbar.module.css';

type ChangeBackgroundButtonProps = {
  changeBackground: (background: SlideBackground) => void;
};

export function ChangeBackgroundButton({ changeBackground }: ChangeBackgroundButtonProps) {
  const [showSelector, setShowSelector] = useState(false);

  const handleSelect = (background: SlideBackground) => {
    changeBackground(background);
    setShowSelector(false);
  };

  return (
    <>
      <button type="button" className={styles.button} onClick={() => setShowSelector(true)}>
        Change Background
      </button>
      {showSelector && (
        <BackgroundSelector onSelect={handleSelect} onClose={() => setShowSelector(false)} />
      )}
    </>
  );
}
