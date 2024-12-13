import React, { useState, useEffect } from 'react';
import {
  TrashIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/solid';
import { playlistApi } from '../api/playlistApi';
import { SECONDARY_COLOR_CLASS } from '../constants.js';

const PlaylistItem = ({
                        playlist,
                        handleDeletePlaylist,
                        handleUpdatePlaylist,
                        openAddMediaModal,
                        organizationId,
                      }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [playlistMedias, setPlaylistMedias] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaylistsMedias = async () => {
    setLoading(true);
    try {
      const response = await playlistApi.getPlaylistMedias(
        playlist.id,
        organizationId
      );
      setPlaylistMedias(response.data.data);
    } catch (error) {
      console.error('Error fetching playlist medias:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistsMedias();
  }, [playlist]);

  const toggleAccordion = async () => {
    if (!isOpen) {
      setLoading(true);
      fetchPlaylistsMedias();
    }
    setIsOpen(!isOpen);
  };

  const handleRemoveMedia = async (playlistMediaId) => {
    try {
      await playlistApi.removeMedias(
        playlist.id,
        [playlistMediaId],
        organizationId
      );
      const response = await playlistApi.getPlaylistMedias(
        playlist.id,
        organizationId
      );
      setPlaylistMedias(response.data.data);
    } catch (error) {
      console.error('Error removing media:', error);
    }
  };

  useEffect(() => {
  }, [isOpen]);

  return (
    <div className="border rounded mb-4">
      {/* Accordion Header */}
      <div
        className={`flex w-full direction-column items-center p-4 cursor-pointer ${SECONDARY_COLOR_CLASS} rounded-lg`}
        onClick={toggleAccordion}
      >
        <div className="flex flex-[8] items-center space-x-4">
          <h3 className="text-lg font-semibold flex-[4] text-center">
            {playlist.name}
          </h3>
          <p className="text-sm text-gray-500 flex-[2] text-center">
            Added: {new Date(playlist.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500 flex-[2] text-center">
            Updated: {new Date(playlist.updatedAt).toLocaleDateString()}
          </p>
        </div>
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
        <div className={`p-4 ${SECONDARY_COLOR_CLASS}`}>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <>
              {/* Media List */}
              <div className="grid grid-cols-1 gap-4">
                {playlistMedias.map((playlistMedia) => (
                  <div
                    key={playlistMedia.id}
                    className="flex items-center space-x-4 border p-4 rounded-lg"
                  >
                    <img
                      src={`${playlistMedia.media.thumbnail}`}
                      alt={playlistMedia.media.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-grow">
                      <h4 className="font-semibold">
                        {playlistMedia.media.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Duration: {playlistMedia.duration}s
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveMedia(playlistMedia.id);
                      }}
                      className="text-red-500 bg-red-100 p-4 rounded-lg"
                    >
                      <TrashIcon className={'h-5 w-5 bg-red-100 '}/>
                    </button>
                  </div>
                ))}
                {playlistMedias.length === 0 && (
                  <p className="text-center text-gray-500">
                    No media items in this playlist
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openAddMediaModal(playlist.id);
                  }}
                  className="bg-green-100 text-green-500 px-4 py-2 rounded-lg flex items-center"
                >
                  <PlusCircleIcon className="h-5 w-5 mr-1"/> Add Media
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdatePlaylist(playlist.id);
                  }}
                  className="text-blue-500 bg-blue-100 flex items-center"
                >
                  <PencilSquareIcon className="h-5 w-5 mr-1"/> Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePlaylist(playlist.id);
                  }}
                  className="text-red-500 bg-red-100 flex items-center"
                >
                  <TrashIcon className="h-5 w-5 mr-1"/> Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaylistItem;
