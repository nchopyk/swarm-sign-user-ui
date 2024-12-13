import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { BUTTON_TEXT_COLOR, PRIMARY_COLOR_CLASS, PRIMARY_TEXT_COLOR, SECONDARY_COLOR_CLASS } from '../constants.js';

const CustomModal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        className={`relative ${SECONDARY_COLOR_CLASS} p-8 rounded-lg shadow-xl w-full max-w-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={`absolute top-4 right-4 p-2 rounded focus:outline-none ${PRIMARY_COLOR_CLASS} `}
          onClick={closeModal}
        >
          <XMarkIcon className={`h-6 w-6 ${PRIMARY_COLOR_CLASS} ${PRIMARY_TEXT_COLOR} hover:text-gray-700`} />
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};
export default CustomModal;
