import React, { useEffect, useState } from 'react';
import LeftSidebar from '../layouts/sideBar';
import { useGlobalContext } from '../context/context';
import CustomModal from '../components/customModal';
import MediasItem from '../components/mediasItem';
import { PlusCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import mediaApi from '../api/mediaApi';
import { BG_COLOR_CLASS, BUTTON_BG_COLOR, BUTTON_TEXT_COLOR, PRIMARY_COLOR_CLASS, PRIMARY_TEXT_COLOR, SECONDARY_COLOR_CLASS } from '../constants.js';

const MediasPage = () => {
  const [mediaList, setMediaList] = useState([]);
  const [filteredMedias, setFilteredMedias] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isAddMediaModal, setIsAddMediaModal] = useState(false);
  const [isEditMediaModal, setIsEditMediaModal] = useState(false);
  const [newMediaName, setNewMediaName] = useState('');
  const [newMediaFile, setNewMediaFile] = useState(null); // To handle file input
  const [searchQuery, setSearchQuery] = useState('');
  const { loading, setLoading, user, error, setErrorMesage } =
    useGlobalContext();

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const mediaFromApi = await mediaApi.getAll(user.organizationId);
      setMediaList(mediaFromApi.data.data);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const openAddMediaModal = () => setIsAddMediaModal(true);
  const closeAddMediaModal = () => setIsAddMediaModal(false);
  const openEditMediaModal = (mediaId) => {
    const { name, type, id } = mediaList.find((media) => media.id === mediaId);
    setSelectedMedia({ name, type, id });
    setIsEditMediaModal(true);
  };
  const closeEditMediaModal = () => setIsEditMediaModal(false);

  const handleCreateMedia = async (e) => {
    e.preventDefault();

    if (!newMediaFile) {
      return setErrorMesage('empty input', 3000);
    }

    if (!newMediaName) {
      return setErrorMesage('empty input', 3000);
    }

    try {
      // Analyze file type, if it’s an image, set type as "image"
      const acceptedTypes = ['image/jpeg', 'image/png', 'video/mp4'];

      if (!acceptedTypes.includes(newMediaFile.type)) {
        return setErrorMesage('Invalid file type', 3000);
      }

      const fileType = newMediaFile.type.startsWith('image') ? 'image' : 'video';
      await mediaApi.add(newMediaFile, newMediaName, fileType, user.organizationId);
      setNewMediaName('');
      setNewMediaFile(null);
      closeAddMediaModal();
      fetchMedia();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateMedia = async (e) => {
    e.preventDefault();
    try {
      await mediaApi.update(
        newMediaFile,
        selectedMedia.id,
        selectedMedia.type,
        selectedMedia.name,
        user.organizationId
      );
      setSelectedMedia(null);
      closeEditMediaModal();
      fetchMedia();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMedia = async (id) => {
    try {
      await mediaApi.delete(id, user.organizationId);
      fetchMedia();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) {
      setFilteredMedias(null);
    }
    setFilteredMedias(
      mediaList.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const handleFileInput = (e) => {
    setNewMediaFile(e.target.files[0]);
  };

  return (
    <div className="flex">
      <LeftSidebar/>
      <div
        className={`flex-grow mx-auto p-6 backdrop-blur-lg bg-white/60 shadow-lg rounded-lg ${PRIMARY_TEXT_COLOR}`}
      >
        <h1 className="text-3xl font-bold mb-4">All Media</h1>

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
            placeholder="Search media..."
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-300/50 hover:bg-gray-400/60 backdrop-blur rounded-lg p-2"
          >
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-500"/>
          </button>
        </form>

        {/* "Add new media" */}
        <button
          disabled={loading}
          className="flex items-center bg-blue-500/60 hover:bg-blue-700/70 text-white px-4 py-2 rounded-lg shadow-md backdrop-blur"
          onClick={openAddMediaModal}
        >
          <PlusCircleIcon className="h-5 w-5 mr-2"/>
          Add new media
        </button>

        {/* Media List */}
        <div className="mt-6">
          <div className="min-w-full mb-4">
            <div className="bg-gray-200/70 backdrop-blur-md rounded-lg p-4 flex font-bold">
              <span className="flex-[2] text-center">Image Preview</span>
              <span className="flex-[2] text-center">Name</span>
              <span className="flex-[2] text-center">Type</span>
              <span className="flex-[2] text-center">Resolution</span>
              <span className="flex-[2] text-center">Size</span>
              <span className="flex-[2] text-center">Added at</span>
            </div>
          </div>
          {filteredMedias
            ? filteredMedias.map((media) => (
              <MediasItem
                key={media.id}
                media={media}
                handleDeleteMedia={handleDeleteMedia}
                handleUpdateMedia={openEditMediaModal}
              />
            ))
            : mediaList.map((media) => (
              <MediasItem
                key={media.id}
                media={media}
                handleDeleteMedia={handleDeleteMedia}
                handleUpdateMedia={openEditMediaModal}
              />
            ))}
        </div>
        {/* Add Modal */}
        <CustomModal isOpen={isAddMediaModal} closeModal={closeAddMediaModal}>
          <h2 className="text-2xl font-semibold mb-4">Add New Media</h2>
          {error && (
            <span className="text-red-500 text-l font-semibold">
          Some fields empty!
        </span>
          )}
          <input
            disabled={loading}
            type="text"
            value={newMediaName}
            onChange={(e) => setNewMediaName(e.target.value)}
            className={`border bg-white/50 backdrop-blur-md ${PRIMARY_TEXT_COLOR} rounded-lg p-2 w-full mb-4`}
            placeholder="Media name"
          />
          <input
            disabled={loading}
            type="file"
            onChange={handleFileInput}
            className="border bg-white/50 backdrop-blur-md border-gray-300 rounded-lg p-2 w-full mb-4"
          />
          <div className="flex justify-end space-x-4">
            <button
              disabled={loading}
              className="bg-gray-300/50 text-gray-700 px-4 py-2 rounded-lg backdrop-blur"
              onClick={closeAddMediaModal}
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="bg-blue-500/60 text-white px-4 py-2 rounded-lg hover:bg-blue-600/70"
              onClick={handleCreateMedia}
            >
              Save
            </button>
          </div>
        </CustomModal>

        {/* Edit Modal */}
        {selectedMedia && (
          <CustomModal isOpen={isEditMediaModal} closeModal={closeEditMediaModal}>
            <h2 className="text-2xl font-semibold mb-4">Edit Media</h2>
            {error && (
              <span className="text-red-500 text-l font-semibold">
            Some fields empty!
          </span>
            )}
            <input
              disabled={loading}
              type="text"
              value={selectedMedia.name}
              onChange={(e) =>
                setSelectedMedia({ ...selectedMedia, name: e.target.value })
              }
              className={`border bg-white/50 backdrop-blur-md ${PRIMARY_TEXT_COLOR} rounded-lg p-2 w-full mb-4`}
            />
            <input
              disabled={loading}
              type="file"
              onChange={handleFileInput}
              className="border bg-white/50 backdrop-blur-md border-gray-300 rounded-lg p-2 w-full mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                disabled={loading}
                className="bg-gray-300/50 text-gray-700 px-4 py-2 rounded-lg backdrop-blur"
                onClick={closeEditMediaModal}
              >
                Cancel
              </button>
              <button
                disabled={loading}
                className="bg-blue-500/60 text-white px-4 py-2 rounded-lg hover:bg-blue-600/70"
                onClick={handleUpdateMedia}
              >
                Save
              </button>
            </div>
          </CustomModal>
        )}
      </div>
    </div>

  );
};

export default MediasPage;
