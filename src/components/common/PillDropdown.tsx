import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Common.module.css';

interface PillDropdownProps<T extends string | number> {
  value: T;
  options: { label: string; value: T }[];
  onChange: (val: T) => void;
  prefix?: string;
  className?: string;
}

export function PillDropdown<T extends string | number>({
  value,
  options,
  onChange,
  prefix = '',
  className = '',
}: PillDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.pillDropdown} ${className}`}
      onClick={() => setIsOpen((prev) => !prev)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setIsOpen((prev) => !prev);
        }
      }}
    >
      <span>
        {prefix ? `${prefix}: ` : ''}
        {selectedOption?.label || value}
      </span>
      <ChevronDown size={14} style={{ transition: 'transform 180ms ease', transform: isOpen ? 'rotate(180deg)' : 'none' }} />

      {isOpen && (
        <ul className={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
          {options.map((opt) => (
            <li
              key={String(opt.value)}
              className={`${styles.dropdownItem} ${opt.value === value ? styles.dropdownItemActive : ''}`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
