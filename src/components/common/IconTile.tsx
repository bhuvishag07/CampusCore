import React from 'react';
import { LucideIcon } from 'lucide-react';
import { DarkIconTile } from '@/styles/styledComponents';

interface IconTileProps {
  icon: LucideIcon;
  size?: number;
  iconSize?: number;
  className?: string;
}

export const IconTile: React.FC<IconTileProps> = ({
  icon: Icon,
  size = 36,
  iconSize = 18,
  className = '',
}) => {
  return (
    <DarkIconTile
      style={{ width: size, height: size }}
      className={className}
      aria-hidden="true"
    >
      <Icon size={iconSize} />
    </DarkIconTile>
  );
};
