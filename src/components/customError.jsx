import React from 'react';
import { useGlobalContext } from '../context/context';

const CustomError = () => {
  const { error } = useGlobalContext();

  return (
    <div className="w-[max-content] flex flex-col items-center justify-center px-7 py-3 rounded bg-gray-800 absolute top-[50px] right-[50px] rounded">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Oops!</h1>
      <p className="text-lg text-white">
        <i>{error}</i>
      </p>
    </div>
  );
};

export default CustomError;
