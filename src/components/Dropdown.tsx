import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface DropdownProps {
  label?: string;
  items?: string[];
  onSelect: (item: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label = "Select", items = [], onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(items[0]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (item: string) => {
    setSelected(item);
    setIsOpen(false);
    onSelect(item);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="inline-flex w-full z-20 justify-between items-center gap-2 border border-gray-300 bg-red-600 px-4 py-1.5 text-sm font-medium min-w-40 text-white cursor-pointer hover:bg-red-700 focus:outline-non max-h-11"
      >
        {selected?.replace('/', ' - ') || label.replace('/', ' - ')}
        <FontAwesomeIcon icon={faChevronDown} className='max-h-5' />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-56 origin-top-right bg-white shadow-lg ring-1 ring-opacity-5">
          <div className=" curpor-pointer">
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(item)}
                className="block w-full px-4 py-2 cursor-pointer text-left text-sm text-gray-700 hover:bg-red-600 hover:text-white"
              >
                {item.replace('/', ' - ')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
