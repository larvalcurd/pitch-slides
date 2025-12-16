import React, { useState } from 'react';
import {
  wrapperStyle,
  inputStyle,
  inputFocusStyle,
  inputDisabledStyle,
} from './PresentationTitle.styles.ts';

type PresentationTitleProps = {
  title: string;
  onTitleChange: (newTitle: string) => void;
  disabled?: boolean;
};

export function PresentationTitle({
  title,
  onTitleChange,
  disabled = false,
}: PresentationTitleProps) {
  const [isFocused, setIsFocused] = useState(false);

  const mergedInputStyle: React.CSSProperties = {
    ...inputStyle,
    ...(isFocused ? inputFocusStyle : {}),
    ...(disabled ? inputDisabledStyle : {}),
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTitleChange(e.target.value);
    console.log(e.target.value);
  };

  return (
    <div style={wrapperStyle}>
      <input
        id="presentation-title"
        name="presentationTitle"
        value={title}
        onChange={handleChange}
        placeholder="Enter Presentation title"
        style={mergedInputStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        aria-disabled={disabled}
      />
    </div>
  );
}
