import { useMemo, useCallback } from 'react';

type Props = {
  selectedIds: string[];
  onSelect: (id: string, multiSelect?: boolean) => void;
};

export default function useObjectSelection({ selectedIds, onSelect }: Props) {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const toggleSelection = useCallback(
    (id: string, multi = false) => {
      if (!multi) {
        onSelect(id, false);
        return;
      }

      if (selectedSet.has(id)) {
        onSelect(id, true); // тут потом будет remove
      } else {
        onSelect(id, true);
      }
    },
    [onSelect, selectedSet],
  );

  const isSelected = useCallback((id: string) => selectedSet.has(id), [selectedSet]);

  return { toggleSelection, isSelected };
}
