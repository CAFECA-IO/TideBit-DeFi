'use client';

import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder = 'Search by keyword' }) => {
  const isActive = value.length > 0;

  return (
    <div
      className={`${
        isActive ? 'border-text-field-outline-focused' : 'border-text-field-outline-default'
      } flex w-full items-center overflow-hidden rounded-full border py-spacing-lv-3`}
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-spacing-lv-6 font-medium text-text-field-text-active outline-none placeholder:text-text-field-text-placeholder"
        aria-label="Search"
      />
      <div className="shrink-0 pl-spacing-lv-4 pr-spacing-lv-6 text-text-field-text-placeholder">
        <FiSearch size={24} />
      </div>
    </div>
  );
};

export default SearchBar;
