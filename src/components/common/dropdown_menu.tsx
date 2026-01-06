'use client';

import React from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import useOuterClick from '@/lib/hooks/use_outer_click';

interface IDropdownMenuProps {
  options: string[];
  activeOption: string;
  selectOption: (option: string) => void;
  prefixIcon?: React.ReactNode;
}

const DropdownMenu: React.FC<IDropdownMenuProps> = ({
  options,
  activeOption,
  selectOption,
  prefixIcon = null,
}) => {
  const {
    targetRef,
    componentVisible: isDropdownOpen,
    setComponentVisible: setDropdownOpen,
  } = useOuterClick<HTMLDivElement>(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Info: (20251224 - Julian) 在選單打開或非預設選項時，顯示高亮邊框
  const isFocused = isDropdownOpen || activeOption !== options[0];

  // Info: (20251224 - Julian) 圖標
  const icon = prefixIcon && <div className="pl-spacing-lv-6 pr-spacing-lv-4">{prefixIcon}</div>;

  return (
    <div ref={targetRef} className="relative flex flex-col items-center">
      {/* Info: (20251224 - Julian) Button */}
      <div
        onClick={toggleDropdown}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') toggleDropdown();
        }}
        role="button"
        tabIndex={0}
        className={` ${
          isFocused ? 'border-text-field-outline-focused' : 'border-text-field-outline-default'
        } flex w-full items-center rounded-radius-s border bg-text-field-surface-default py-spacing-lv-3 text-text-field-text-active hover:cursor-pointer hover:border-text-field-outline-focused hover:bg-text-field-surface-addon`}
      >
        {icon}
        <div className="w-140px whitespace-nowrap px-spacing-lv-6 font-medium">{activeOption}</div>
        <div className="pl-spacing-lv-4 pr-spacing-lv-6">
          <FaChevronDown size={24} />
        </div>
      </div>
      {/* Info: (20251224 - Julian) Dropdown Menu */}
      <div
        className={`${
          isDropdownOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-12 opacity-0'
        } absolute top-14 z-dropmenu flex w-full flex-col rounded-radius-s border border-text-field-outline-default bg-text-field-surface-default py-spacing-lv-3 text-text-field-text-active shadow-lg transition-all duration-150 ease-in-out`}
      >
        {options.map((op) => (
          <div
            key={op}
            onClick={() => {
              selectOption(op);
              setDropdownOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                selectOption(op);
                setDropdownOpen(false);
              }
            }}
            role="button"
            tabIndex={0}
            className="px-spacing-lv-6 py-spacing-lv-3 hover:cursor-pointer hover:bg-text-field-surface-addon"
          >
            {op}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
