import styled, { css } from 'styled-components';

// Tone-aware pastel card container with 20px radius and smooth hover
export const ToneCardWrapper = styled.div`
  border-radius: var(--radius-lg);
  padding: 20px;
  min-height: 190px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);

  ${({ $tone }) => {
    switch ($tone) {
      case 0:
        return css`
          background-color: var(--tone-0-bg);
          border: 1px solid rgba(217, 212, 247, 0.6);
        `;
      case 1:
        return css`
          background-color: var(--tone-1-bg);
          border: 1px solid rgba(211, 228, 250, 0.6);
        `;
      case 2:
      default:
        return css`
          background-color: var(--tone-2-bg);
          border: 1px solid rgba(213, 240, 210, 0.6);
        `;
    }
  }}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 30px rgba(60, 50, 100, 0.1);
  }
`;

// Status pill badge with colored status dot
export const StatusIndicatorPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(8px);
  color: var(--ink);

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.12);
    color: var(--ink);
  }

  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${({ $status }) => {
      switch ($status) {
        case 'Active':
        case 'Enrolled':
          return '#34c759'; // vibrant green
        case 'On leave':
          return 'var(--chart-blue)';
        case 'Graduated':
          return 'var(--chart-purple)';
        case 'Inactive':
        default:
          return 'var(--ink-soft)';
      }
    }};
  }
`;

// Pill Tab Indicator
export const ActiveTabIndicator = styled.div`
  position: absolute;
  inset: 0;
  background-color: var(--ink);
  border-radius: var(--radius-pill);
  z-index: 0;
`;

// Icon tile (36px, radius 12px, --ink background, white icon)
export const DarkIconTile = styled.div`
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background-color: var(--ink);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  [data-theme='dark'] & {
    background-color: #f1effb;
    color: #15131f;
  }
`;
