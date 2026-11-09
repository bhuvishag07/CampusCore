import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';
import styles from './Common.module.css';

export const PillDropdown = ({
  value,
  options = [],
  onChange,
  prefix = '',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
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
        {selectedOption ? selectedOption.label : value}
      </span>
      <ChevronDown
        size={14}
        style={{
          transition: 'transform 180ms ease',
          transform: isOpen ? 'rotate(180deg)' : 'none',
        }}
      />

      {isOpen && (
        <ul className={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
          {options.map((opt) => (
            <li
              key={String(opt.value)}
              className={`${styles.dropdownItem} ${
                opt.value === value ? styles.dropdownItemActive : ''
              }`}
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
};

PillDropdown.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  prefix: PropTypes.string,
  className: PropTypes.string,
};
