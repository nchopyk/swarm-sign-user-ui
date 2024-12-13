import React, { useState } from 'react';
import {
  TrashIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/solid';
import { SECONDARY_COLOR_CLASS } from '../constants.js';

const ScheduleItem = ({
                        schedule,
                        handleDeleteSchedule,
                        handleUpdateSchedule,
                      }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => setIsOpen(!isOpen);

  return (
    <div className="border rounded-xl mb-4">
      {/* Accordion Header */}
      <div
        className={`flex w-full direction-column items-center p-4 cursor-pointer ${SECONDARY_COLOR_CLASS} rounded-lg`}
        onClick={toggleAccordion}
      >
        <div className="flex flex-[9] items-center space-x-4">
          <div className="flex-[7] flex items-center !ml-0">
            <h3 className="text-lg font-semibold flex-[3] text-center">
              {schedule.name}
            </h3>
            <p className="text-sm text-gray-500 flex-[2] text-center">
              {schedule.screen.name}
            </p>
            <p className={`text-sm text-gray-500 flex-[2] text-center`}>
              {new Date(schedule.start).toLocaleString()}
            </p>
            <p className={`text-sm text-gray-500 flex-[2] text-center`}>
              {new Date(schedule.end).toLocaleString()}
            </p>
            {/*<p className="text-sm text-gray-500 flex-[2] text-center">*/}
            {/*  Added: {new Date(schedule.createdAt).toLocaleDateString()}*/}
            {/*</p>*/}
          </div>
        </div>
        {/* Chevron for Accordion */}
        <div className="flex-[2] flex justify-center">
          {isOpen ? (
            <ChevronUpIcon className="h-6 w-6 text-gray-500"/>
          ) : (
            <ChevronDownIcon className="h-6 w-6 text-gray-500"/>
          )}
        </div>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-3 bg-white rounded-b-xl">
          {/* Schedule Details */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm p-6">
            <div className="space-y-2">
              {/* Section 1: General Info */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">General Information</h4>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium text-blue-600">Name:</span>{' '}
                    {schedule.name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-blue-600">Screen:</span>{' '}
                    {schedule.screen.name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-blue-600">Playlist:</span>{' '}
                    {schedule.playlist.name}
                  </p>
                </div>
              </div>

              {/* Section 2: Timing */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Timing</h4>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium text-blue-600">Start:</span>{' '}
                    {new Date(schedule.start).toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-blue-600">End:</span>{' '}
                    {new Date(schedule.end).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Section 3: Metadata */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Metadata</h4>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium text-blue-600">Added:</span>{' '}
                    {new Date(schedule.createdAt).toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-blue-600">Last Updated:</span>{' '}
                    {new Date(schedule.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* Action Buttons */}
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => handleUpdateSchedule(schedule.id)}
              className="text-blue-500 bg-blue-100 flex items-center"
            >
              <PencilSquareIcon className="h-5 w-5 mr-1"/> Edit
            </button>
            <button
              onClick={() => handleDeleteSchedule(schedule.id)}
              className="text-red-500 bg-red-100 flex items-center"
            >
              <TrashIcon className="h-5 w-5 mr-1"/> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleItem;
