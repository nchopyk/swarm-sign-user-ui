import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/context';

import {
  UserIcon,
  ArrowLeftEndOnRectangleIcon,
  ComputerDesktopIcon,
  PhotoIcon,
  PlayCircleIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/solid';

const LeftSidebar = () => {
  const urlPathName = window.location.pathname;
  const { setUser, setTokens } = useGlobalContext();
  const navigate = useNavigate();

  const SECTION_CLASS = 'flex items-center space-x-5 p-3 rounded border-l-4 hover:text-black';
  const SECTION_SELECTED_CLASS = 'bg-gray-100 text-black border-blue-500';
  const SECTION_UNSELECTED_CLASS = 'bg-slate-500 text-white';

  const userLogout = (e) => {
    e.preventDefault();
    setUser(null);
    setTokens(null);
    navigate('/login');
  };
  return (
    <div className="backdrop-blur-lg bg-gray-900 shadow-lg w-80 min-h-screen p-6 flex flex-col">
      <nav>
        <ul className="space-y-4">
          <li>
            <Link
              to="/"
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg text-white text-sm font-medium transition-colors
          ${
                urlPathName === '/'
                  ? 'bg-blue-500/30 text-white shadow-md'
                  : 'hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <ComputerDesktopIcon className="h-6 w-6"/>
              <span>Screens</span>
            </Link>
          </li>
          <li>
            <Link
              to="/medias"
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg text-white text-sm font-medium transition-colors
          ${
                urlPathName === '/medias'
                  ? 'bg-blue-500/30 text-white shadow-md'
                  : 'hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <PhotoIcon className="h-6 w-6"/>
              <span>Medias</span>
            </Link>
          </li>
          <li>
            <Link
              to="/playlists"
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg text-white text-sm font-medium transition-colors
          ${
                urlPathName === '/playlists'
                  ? 'bg-blue-500/30 text-white shadow-md'
                  : 'hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <PlayCircleIcon className="h-6 w-6"/>
              <span>Playlists</span>
            </Link>
          </li>
          <li>
            <Link
              to="/schedules"
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg text-white text-sm font-medium transition-colors
          ${
                urlPathName === '/schedules'
                  ? 'bg-blue-500/30 text-white shadow-md'
                  : 'hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <CalendarDaysIcon className="h-6 w-6"/>
              <span>Schedules</span>
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg text-white text-sm font-medium transition-colors
          ${
                urlPathName === '/profile'
                  ? 'bg-blue-500/30 text-white shadow-md'
                  : 'hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <UserIcon className="h-6 w-6"/>
              <span>Profile</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-auto w-full">
        <div
          className="flex items-center space-x-4 px-4 py-3 bg-gray-700/50 hover:bg-gray-700/70 rounded-lg text-white text-sm font-medium cursor-pointer transition-colors"
          onClick={userLogout}
        >
          <ArrowLeftEndOnRectangleIcon className="h-6 w-6" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
