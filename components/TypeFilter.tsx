'use client';

import React from 'react';

interface TypeFilterProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

const filterTypes = ['all', 'normal', 'poison', 'rock', 'fire', 'water', 'electric', 'bug'];

const TypeFilter: React.FC<TypeFilterProps> = ({ selectedType, onSelectType }) => {
  return (
    <ul className="flex flex-wrap gap-2 mb-4">
      {filterTypes.map(type => (
        <li
          key={type}
          onClick={() => onSelectType(type)}
          className={`cursor-pointer px-4 py-2 rounded-full border ${
            selectedType === type
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-blue-100'
          } transition-colors duration-200 capitalize`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </li>
      ))}
    </ul>
  );
};

export default TypeFilter;