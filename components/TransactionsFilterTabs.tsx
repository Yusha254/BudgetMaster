// components/TransactionsFilterTabs.tsx
import React from 'react';
import ToggleTabs from './ToggleTabs';

type FilterOption = 'All' | 'Expense' | 'Income';

export default function TransactionsFilterTabs({
  selected = 'All',
  onSelect,
}: {
  selected: FilterOption;
  onSelect: (option: FilterOption) => void;
}) {
  return (
    <ToggleTabs
      options={['All', 'Expense', 'Income']}
      selected={selected}
      onSelect={onSelect}
    />
  );
}
