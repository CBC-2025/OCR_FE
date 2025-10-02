import React from 'react';

interface StatusBadgeProps {
  status: 'green' | 'yellow' | 'red';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeColor;

  switch (status) {
    case 'green':
      badgeColor = 'bg-green-500';
      break;
    case 'yellow':
      badgeColor = 'bg-yellow-500';
      break;
    case 'red':
      badgeColor = 'bg-red-500';
      break;
    default:
      badgeColor = 'bg-gray-500';
  }

  return (
    <span className={`inline-block px-2 py-1 text-white text-sm font-semibold rounded ${badgeColor}`}>
      {status === 'green' ? 'XANH' : status === 'yellow' ? 'VÀNG' : 'ĐỎ'}
    </span>
  );
};

export default StatusBadge;