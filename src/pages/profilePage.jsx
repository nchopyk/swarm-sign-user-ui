import React from 'react';
import LeftSidebar from '../layouts/sideBar';
import { useGlobalContext } from '../context/context';
import personIcon from '../assets/person-icon.png';
import { BG_COLOR_CLASS, PRIMARY_TEXT_COLOR } from '../constants.js';

const ProfilePage = () => {
  const { user } = useGlobalContext();

  return (
    <div className="flex">
      <LeftSidebar/>
      {user && (
        <div className={`container mx-auto p-6 flex justify-center h-max my-auto ${BG_COLOR_CLASS}`}>
          <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-8">
            <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">
              {`${user.user.firstName} ${user.user.lastName}`}
            </h1>

            <div className="flex justify-center mb-6">
              <img
                src={user.user.avatarUrl || personIcon}
                alt="Avatar"
                className="w-32 h-32 rounded-full shadow-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-700">
                <p className="font-bold">Email:</p>
                <p>{user.user.email}</p>
              </div>
              <div className="text-gray-700">
                <p className="font-bold">Language:</p>
                <p>{user.user.language}</p>
              </div>
              <div className="text-gray-700">
                <p className="font-bold">Email Verified At:</p>
                <p>{new Date(user.user.emailVerifiedAt).toLocaleString()}</p>
              </div>
              <div className="text-gray-700">
                <p className="font-bold">Two Factor Auth Enabled:</p>
                <p>{user.twoFactorAuthEnabled ? 'Yes' : 'No'}</p>
              </div>
              <div className="text-gray-700">
                <p className="font-bold">Account Created At:</p>
                <p>{new Date(user.user.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-gray-700">
                <p className="font-bold">Last Updated At:</p>
                <p>{new Date(user.user.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
