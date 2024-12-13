import React from 'react';

const CustomButton = ({
                        onClick,
                        children,
                        disable = false,
                        className = '',
                      }) => {
  return (
    <button
      onClick={onClick}
      disabled={disable}
      className={`px-4 py-2 bg-green-400 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

export default CustomButton;
