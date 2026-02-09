import { useState } from 'react';
import type { ExpandedSections, TabType } from '../types/widget.types';

export const useUIState = () => {
  const [activeTab, setActiveTab] = useState<TabType>('theme');
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    mainColors: true,
    textColors: true,
    messageBubbles: true,
    chatButton: true,
    iconSelection: true
  });

  // Toggle section expansion
  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Expand all sections
  const expandAllSections = () => {
    setExpandedSections({
      mainColors: true,
      textColors: true,
      messageBubbles: true,
      chatButton: true,
      iconSelection: true
    });
  };

  // Collapse all sections
  const collapseAllSections = () => {
    setExpandedSections({
      mainColors: false,
      textColors: false,
      messageBubbles: false,
      chatButton: false,
      iconSelection: false
    });
  };

  return {
    activeTab,
    setActiveTab,
    expandedSections,
    setExpandedSections,
    toggleSection,
    expandAllSections,
    collapseAllSections
  };
};
