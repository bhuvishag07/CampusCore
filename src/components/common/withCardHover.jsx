import React, { useState } from 'react';

/**
 * withCardHover (Higher-Order Component)
 * Demonstrates the classic React Higher-Order Component (HOC) pattern:
 * - Accepts a Component as an argument
 * - Returns a new enhanced Component with augmented state/props
 * - Preserves props and sets a meaningful displayName for debugging
 */
export function withCardHover(WrappedComponent) {
  const WithCardHoverComponent = (props) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transition: 'transform 200ms ease, box-shadow 200ms ease',
          transform: isHovered ? 'translateY(-2px)' : 'none',
        }}
      >
        <WrappedComponent {...props} isCardHovered={isHovered} />
      </div>
    );
  };

  WithCardHoverComponent.displayName = `WithCardHover(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithCardHoverComponent;
}
