import React from 'react';

const CustomInput = ({
                       type = 'text',
                       placeholder,
                       value,
                       onChange,
                       disable = false,
                       className = '',
                     }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      disabled={disable}
      onChange={onChange}
      className={`px-3 py-2 border border-green-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${className}`}
    />
  );
};

export default CustomInput;
