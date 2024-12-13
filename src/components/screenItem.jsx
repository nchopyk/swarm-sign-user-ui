import React from 'react';
import {
  TrashIcon,
  PencilSquareIcon,
  LinkIcon
} from '@heroicons/react/24/solid';

const ScreenItem = ({ screen, handleDeleteScreen, handleUpdateScreen, handleScreenLinkStatus }) => {
  return (
    <tr className="border-b border-gray-200 rounded-lg">
      <td className="px-4 py-2 text-center">{screen.name}</td>
      <td className="px-4 py-2 text-center">{screen.notes || 'None'}</td>
      <td className="px-4 py-2 text-center">{screen.location || 'Unknown'}</td>
      <td className="px-4 py-2 text-center">
        <div
          className={`h-4 w-4 rounded-full mx-auto ${
            screen.deviceId ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
      </td>
      <td className="px-4 py-2 text-center">
        {new Date(screen.updatedAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-center flex justify-between space-x-2">
        <button
          className="text-green-500 bg-green-200 hover:text-green-700 p-3"
          onClick={() => handleScreenLinkStatus(screen.id)}
        >
          <LinkIcon className="h-5 w-5"/>
        </button>

        <button
          className="text-blue-500 bg-blue-200 hover:text-blue-700 p-3"
          onClick={() => handleUpdateScreen(screen.id)}
        >
          <PencilSquareIcon className="h-5 w-5"/>
        </button>

        <button
          className="text-red-500 bg-red-200 hover:text-red-700 p-3"
          onClick={() => handleDeleteScreen(screen.id)}
        >
          <TrashIcon className="h-5 w-5"/>
        </button>
      </td>
    </tr>
  );
};

export default ScreenItem;
