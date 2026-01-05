import React, { useState, useCallback, useEffect } from 'react';

type UseTextEditingProps = {
  initialContent: string;
  onSave: (content: string) => void;
  onCancel: () => void;
};

export function useTextEditing({ initialContent, onSave, onCancel }: UseTextEditingProps) {
  const [tempContent, setTempContent] = useState(initialContent);

  useEffect(() => {
    setTempContent(initialContent);
  }, [initialContent]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        onSave(tempContent);
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
    },
    [tempContent, onSave, onCancel],
  );

  return {
    tempContent,
    setTempContent,
    handleKeyDown,
  };
}
