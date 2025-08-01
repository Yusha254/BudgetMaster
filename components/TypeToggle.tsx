// components/TypeToggle.tsx
import React from 'react';
import ToggleTabs from './ToggleTabs';

type TypeOption = 'Expense' | 'Income';

export default function TypeToggle({
  selectedType,
  onSelect,
}: {
  selectedType: TypeOption;
  onSelect: (type: TypeOption) => void;
}) {
  return (
    <ToggleTabs
      options={['Expense', 'Income']}
      selected={selectedType}
      onSelect={onSelect}
    />
  );
}
