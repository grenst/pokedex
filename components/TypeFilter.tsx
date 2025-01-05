import { ChangeEvent } from 'react';

interface TypeFilterProps {
  types: string[];
  selectedTypes: string[];
  onChange: (types: string[]) => void;
}

const TypeFilter: React.FC<TypeFilterProps> = ({ types, selectedTypes, onChange }) => {
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      onChange([...selectedTypes, value]);
    } else {
      onChange(selectedTypes.filter(type => type !== value));
    }
  };

  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">Фильтр по типам:</h3>
      <div className="flex flex-wrap gap-2">
        {types.map(type => (
          <label key={type} className="flex items-center space-x-1">
            <input
              type="checkbox"
              value={type}
              checked={selectedTypes.includes(type)}
              onChange={handleCheckboxChange}
            />
            <span className="capitalize">{type}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TypeFilter;
