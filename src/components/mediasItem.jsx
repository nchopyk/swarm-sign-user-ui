import React, { useState } from 'react';
import {
  TrashIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { PRIMARY_COLOR_CLASS, PRIMARY_TEXT_COLOR, SECONDARY_COLOR_CLASS } from '../constants.js';

const MediasItem = ({ media, handleDeleteMedia, handleUpdateMedia }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="border rounded-lg mb-4">
      {/* Media Item Header */}
      <div
        className={`flex w-full items-center p-3 cursor-pointer ${SECONDARY_COLOR_CLASS} rounded-lg`}
        onClick={openModal}
      >
        <div className="flex flex-[2] justify-center">
          <img
            src={`${media.thumbnail}`}
            alt={media.name}
            className="w-48 h-20 object-cover rounded-md"
          />
        </div>
        {/* Media Info */}
        <div className="flex flex-[2] justify-center">
          <p className="text-sm text-gray-700 text-center">{media.name}</p>
        </div>
        <div className="flex flex-[2] justify-center">
          <p className="text-sm text-gray-700 text-center">{media.mimeType}</p>
        </div>
        <div className="flex flex-[2] justify-center">
          <p className="text-sm text-gray-700 text-center">
            {media.width}x{media.height}
          </p>
        </div>
        <div className="flex flex-[2] justify-center">
          <p className="text-sm text-gray-700 text-center">
            {(media.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <div className="flex flex-[2] justify-center">
          <p className="text-sm text-gray-700 text-center">
            {new Date(media.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-xl font-bold">{media.name}</h2>
              <button
                onClick={closeModal}
                className={`absolute top-4 right-4 p-1 rounded focus:outline-none ${PRIMARY_COLOR_CLASS} `}
              >
                <XMarkIcon className={`h-6 w-6 ${PRIMARY_COLOR_CLASS} ${PRIMARY_TEXT_COLOR} hover:text-gray-700`} />
              </button>
            </div>

            {/* Modal Content */}
            <div>
              {/* Larger Media Preview */}
              {media.type === 'video' ? (
                <video
                  src={`${media.content}`}
                  poster={`${media.thumbnail}`}
                  alt={media.name}
                  className="w-full h-auto object-cover rounded-md mb-4"
                  controls
                />
              ) : (
                <img
                  src={`${media.content}`}
                  alt={media.name}
                  className="w-full h-auto object-cover rounded-md mb-4"
                />
              )}

              {/* Media Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Name:</strong> {media.name}
                  </p>
                  <p>
                    <strong>Type:</strong> {media.type}
                  </p>
                  <p>
                    <strong>MIME Type:</strong> {media.mimeType}
                  </p>
                  <p>
                    <strong>Dimensions:</strong> {media.width}x{media.height}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Size:</strong> {media.size} bytes
                  </p>
                  <p>
                    <strong>Added:</strong>{' '}
                    {new Date(media.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Last Updated:</strong>{' '}
                    {new Date(media.updatedAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Organization:</strong> {media.organization.name}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleUpdateMedia(media.id)}
                  className="text-blue-500 bg-blue-100 flex items-center px-4 py-2 rounded-md"
                >
                  <PencilSquareIcon className="h-5 w-5 mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteMedia(media.id)}
                  className="text-red-500 bg-red-100 flex items-center px-4 py-2 rounded-md"
                >
                  <TrashIcon className="h-5 w-5 mr-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediasItem;
