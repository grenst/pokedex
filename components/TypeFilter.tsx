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
          className={`min-w-16 text-center cursor-pointer px-2 py-1 rounded-lg ${
            selectedType === type
              ? 'bg-gray-700 text-white'
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