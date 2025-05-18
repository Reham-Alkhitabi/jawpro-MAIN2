import { useState } from 'react';

export const useSectionTracker = (total) => {
  const safeTotal = Number.isInteger(total) && total > 0 ? total : 1;
  const [statuses, setStatuses] = useState(Array(safeTotal).fill('pending'));

  const markSectionPassed = (index) => {
    const updated = [...statuses];
    updated[index] = 'passed';
    setStatuses(updated);
  };

  const markSectionFailed = (index) => {
    const updated = [...statuses];
    updated[index] = 'failed';
    setStatuses(updated);
  };

  const getSectionStatus = (index) => statuses[index] || 'pending';

  const isComplete = () => statuses.every((s) => s === 'passed');

  const getProgress = () => {
    const passed = statuses.filter((s) => s === 'passed').length;
    return Math.round((passed / safeTotal) * 100);
  };

  return {
    markSectionPassed,
    markSectionFailed,
    getSectionStatus,
    isComplete,
    getProgress,
  };
};
