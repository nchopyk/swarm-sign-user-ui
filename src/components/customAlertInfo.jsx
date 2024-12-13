import React from 'react';

const CustomAlertInfo = ({ title, description }) => {
  return (
    <div className="w-[max-content] flex flex-col rounded items-center justify-center px-7 py-3 bg-gray-800 absolute top-[50px] right-[50px]">
      <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
      <p className="text-lg text-white">
        <i>{description}</i>
      </p>
    </div>
  );
};

export default CustomAlertInfo;
