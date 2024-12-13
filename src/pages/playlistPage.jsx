import React, { useEffect, useState } from 'react';
import LeftSidebar from '../layouts/sideBar';
import { useGlobalContext } from '../context/context';
import CustomModal from '../components/customModal';
import PlaylistItem from '../components/playlistItem';
import { PlusCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import playlistApi from '../api/playlistApi';
import mediaApi from '../api/mediaApi';
import { BG_COLOR_CLASS, PRIMARY_COLOR_CLASS, PRIMARY_TEXT_COLOR, SECONDARY_COLOR_CLASS } from '../constants.js';

const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isAddPlaylistModal, setIsAddPlaylistModal] = useState(false);
  const [isEditPlaylistModal, setIsEditPlaylistModal] = useState(false);
  const [isAddMediaModal, setIsAddMediaModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableMedias, setAvailableMedias] = useState([]);
  const [selectedMedias, setSelectedMedias] = useState([]);
  const { loading, setLoading, error, setErrorMesage, user } =
    useGlobalContext();

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const playlistsFromApi = await playlistApi.getAll(user.organizationId);
      setPlaylists(playlistsFromApi.data.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableMedias = async () => {
    try {
      const mediasFromApi = await mediaApi.getAll(user.organizationId);
      setAvailableMedias(mediasFromApi.data.data);
    } catch (error) {
      console.error('Error fetching medias:', error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
    fetchAvailableMedias();
  }, []);

  const openAddPlaylistModal = () => setIsAddPlaylistModal(true);
  const closeAddPlaylistModal = () => {
    setIsAddPlaylistModal(false);
    setNewPlaylistName('');
    setSelectedMedias([]);
  };

  const openEditPlaylistModal = (playlistId) => {
    const playlist = playlists.find((p) => p.id === playlistId);
    setSelectedPlaylist(playlist);
    setNewPlaylistName(playlist.name);
    setIsEditPlaylistModal(true);
  };
  const closeEditPlaylistModal = () => {
    setIsEditPlaylistModal(false);
    setSelectedPlaylist(null);
    setNewPlaylistName('');
  };

  const openAddMediaModal = async (playlistId) => {
    setSelectedPlaylist(playlists.find((p) => p.id === playlistId));
    await fetchAvailableMedias();
    setIsAddMediaModal(true);
  };
  const closeAddMediaModal = () => {
    setIsAddMediaModal(false);
    setSelectedPlaylist(null);
    setSelectedMedias([]);
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName) {
      return setErrorMesage('Please enter a playlist name', 3000);
    }
    if (selectedMedias.length === 0) {
      return setErrorMesage('Please select at least one media', 3000);
    }

    try {
      await playlistApi.add(
        newPlaylistName,
        selectedMedias,
        user.organizationId
      );
      closeAddPlaylistModal();
      fetchPlaylists();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName) {
      return setErrorMesage('Please enter a playlist name', 3000);
    }

    try {
      await playlistApi.update(
        selectedPlaylist.id,
        newPlaylistName,
        user.organizationId
      );
      closeEditPlaylistModal();
      fetchPlaylists();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePlaylist = async (id) => {
    try {
      await playlistApi.delete(id, user.organizationId);
      fetchPlaylists();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddMediasToPlaylist = async (e) => {
    e.preventDefault();
    if (selectedMedias.length === 0) {
      return setErrorMesage('Please select at least one media', 3000);
    }

    try {
      await playlistApi.addMedias(
        selectedPlaylist.id,
        selectedMedias,
        user.organizationId
      );
      fetchPlaylists();
      closeAddMediaModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) {
      setFilteredPlaylists(null);
      return;
    }
    setFilteredPlaylists(
      playlists.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const handleCheckboxChange = (mediaId) => {
    setSelectedMedias((prev) => {
      if (prev.includes(mediaId)) {
        return prev.filter((id) => id !== mediaId);
      } else {
        return [...prev, mediaId];
      }
    });
  };

  return (
    <div className="flex">
      <LeftSidebar/>
      <div
        className={`flex-grow mx-auto p-6 backdrop-blur-lg bg-white/60 shadow-lg rounded-lg ${PRIMARY_TEXT_COLOR}`}
      >
        <h1 className="text-3xl font-bold mb-4">All Playlists</h1>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex items-center mb-4 bg-white/50 backdrop-blur-md shadow-md rounded-lg p-2"
        >
          <input
            disabled={loading}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`rounded-lg p-2 flex-grow mr-2 focus:outline-none bg-white/60 ${PRIMARY_TEXT_COLOR}`}
            placeholder="Search playlists..."
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-300/50 hover:bg-gray-400/60 backdrop-blur rounded-lg p-2 focus:outline-none"
          >
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-500"/>
          </button>
        </form>

        {/* Add new playlist button */}
        <button
          disabled={loading}
          className="flex items-center bg-blue-500/60 hover:bg-blue-700/70 text-white px-4 py-2 rounded-lg shadow-md backdrop-blur focus:outline-none"
          onClick={openAddPlaylistModal}
        >
          <PlusCircleIcon className="h-5 w-5 mr-2"/>
          Add new playlist
        </button>

        {/* Playlists list */}
        <div className="mt-6">
          <div className="min-w-full mb-4">
            <div className="bg-gray-200/70 backdrop-blur-md rounded-lg p-4 flex justify-center font-bold">
              <span className="flex-[4] text-center">Playlist Name</span>
              <span className="flex-[2] text-center">Added at</span>
              <span className="flex-[2] text-center">Updated at</span>
              <span className="flex-[2] text-center">Close/Open</span>
            </div>
          </div>
          {playlists && filteredPlaylists
            ? filteredPlaylists.map((playlist) => (
              <PlaylistItem
                key={playlist.id}
                playlist={playlist}
                handleDeletePlaylist={handleDeletePlaylist}
                handleUpdatePlaylist={openEditPlaylistModal}
                openAddMediaModal={openAddMediaModal}
                organizationId={user.organizationId}
              />
            ))
            : playlists.map((playlist) => (
              <PlaylistItem
                key={playlist.id}
                playlist={playlist}
                handleDeletePlaylist={handleDeletePlaylist}
                handleUpdatePlaylist={openEditPlaylistModal}
                openAddMediaModal={openAddMediaModal}
                organizationId={user.organizationId}
              />
            ))}
        </div>

        {/* Add Playlist Modal */}
        <CustomModal
          isOpen={isAddPlaylistModal}
          closeModal={closeAddPlaylistModal}
          className={`backdrop-blur-lg bg-white/60 shadow-lg rounded-lg ${PRIMARY_TEXT_COLOR}`}
        >
          <h2 className="text-3xl font-bold mb-6">Add New Playlist</h2>
          {error && (
            <span className="text-red-600 text-base font-medium mb-4 block">
          Please fill out all required fields.
        </span>
          )}
          <input
            disabled={loading}
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="border bg-white/50 backdrop-blur-md border-gray-300 rounded-lg p-2 w-full mb-4"
            placeholder="Playlist name..."
          />
          <div className="border border-gray-300 bg-white/50 backdrop-blur-md rounded-lg p-4 w-full mb-6 max-h-68 overflow-y-auto">
            {availableMedias.map((media) => (
              <div
                key={media.id}
                className="flex items-center mb-4 gap-4 last:mb-0"
              >
                <input
                  type="checkbox"
                  id={`media-${media.id}`}
                  value={media.id}
                  checked={selectedMedias.includes(media.id)}
                  onChange={() => handleCheckboxChange(media.id)}
                  className="w-4 h-4 border-2 rounded checked:bg-blue-600 checked:border-transparent"
                />
                <img
                  src={media.thumbnail}
                  alt={media.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <label
                  htmlFor={`media-${media.id}`}
                  className="ml-2 text-lg font-medium cursor-pointer"
                >
                  {media.name}
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              disabled={loading}
              className="bg-gray-300/50 text-gray-700 px-4 py-2 rounded-lg focus:outline-none"
              onClick={closeAddPlaylistModal}
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="bg-blue-500/60 text-white px-4 py-2 rounded-lg hover:bg-blue-600/70"
              onClick={handleCreatePlaylist}
            >
              Save
            </button>
          </div>
        </CustomModal>

        {/* Edit Playlist Modal */}
        {selectedPlaylist && (
          <CustomModal
            isOpen={isEditPlaylistModal}
            closeModal={closeEditPlaylistModal}
            className="backdrop-blur-lg bg-white/60 shadow-lg rounded-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">Edit Playlist</h2>
            {error && (
              <span className="text-red-500 text-l font-semibold">
            Some fields empty!
          </span>
            )}
            <input
              disabled={loading}
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="border bg-white/50 backdrop-blur-md border-gray-300 rounded-lg p-2 w-full mb-4"
              placeholder="Playlist name..."
            />
            <div className="flex justify-end space-x-4">
              <button
                disabled={loading}
                className="bg-gray-300/50 text-gray-700 px-4 py-2 rounded-lg"
                onClick={closeEditPlaylistModal}
              >
                Cancel
              </button>
              <button
                disabled={loading}
                className="bg-blue-500/60 text-white px-4 py-2 rounded-lg hover:bg-blue-600/70"
                onClick={handleUpdatePlaylist}
              >
                Save
              </button>
            </div>
          </CustomModal>
        )}

        {/* Add Media to Playlist Modal */}
        {selectedPlaylist && (
          <CustomModal
            isOpen={isAddMediaModal}
            closeModal={closeAddMediaModal}
            className="backdrop-blur-lg bg-white/80 shadow-2xl rounded-xl p-6 max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Add Media to {selectedPlaylist.name}
            </h2>
            <div className="border border-gray-200 bg-gray-50 backdrop-blur-sm rounded-lg p-4 w-full mb-6 max-h-72 overflow-y-auto">
              {availableMedias.map((media) => (
                <div
                  key={media.id}
                  className="flex items-center gap-4 py-2 px-3 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <img
                    src={media.thumbnail || '/default-thumbnail.jpg'}
                    alt={media.name}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`media-${media.id}`}
                      className="text-sm font-medium text-gray-800 cursor-pointer"
                    >
                      {media.name}
                    </label>
                  </div>
                  <input
                    type="checkbox"
                    id={`media-${media.id}`}
                    value={media.id}
                    checked={selectedMedias.includes(media.id)}
                    onChange={() => handleCheckboxChange(media.id)}
                    className="w-5 h-5 border-gray-300 rounded checked:bg-blue-600 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                disabled={loading}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50"
                onClick={closeAddMediaModal}
              >
                Cancel
              </button>
              <button
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 disabled:opacity-50"
                onClick={handleAddMediasToPlaylist}
              >
                Add
              </button>
            </div>
          </CustomModal>
        )}

      </div>
    </div>

  );
};

export default PlaylistPage;
