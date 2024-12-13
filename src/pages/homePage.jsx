import React, { useEffect, useState } from 'react';
import LeftSidebar from '../layouts/sideBar';
import { useGlobalContext } from '../context/context';
import CustomModal from '../components/customModal';
import ScreenItem from '../components/screenItem';
import { PlusCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import screenApi from '../api/screenApi';
import { BG_COLOR_CLASS, PRIMARY_COLOR_CLASS, PRIMARY_TEXT_COLOR, SECONDARY_COLOR_CLASS } from '../constants.js';

const HomePage = () => {
  const { loading, setLoading, user } = useGlobalContext();
  const [screens, setScreens] = useState([]);
  const [filteredScreens, setFilteredScreens] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [isAddScreenModal, setIsAddScreenModal] = useState(false);
  const [isEditScreenModal, setIsEditScreenModal] = useState(false);
  const [newScreenName, setNewScreenName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLinkScreenModal, setIsLinkScreenModal] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchScreens = async () => {
    setLoading(true);
    try {
      const screensFromApi = await screenApi.getAll(user.organizationId);
      setScreens(screensFromApi.data.data);
    } catch (error) {
      console.error('Error fetching screens:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  const openAddScreenModal = () => setIsAddScreenModal(true);
  const closeAddScreenModal = () => setIsAddScreenModal(false);
  const openEditScreenModal = (screenId) => {
    const { name, notes, location, id, deviceId } = screens.find((screen) => screen.id === screenId);
    setSelectedScreen({ name, notes, location, id, deviceId });
    setIsEditScreenModal(true);
  };
  const closeEditScreenModal = () => setIsEditScreenModal(false);

  const openLinkScreenModal = (screenId) => {
    const { name, notes, location, id, deviceId } = screens.find((screen) => screen.id === screenId);
    setSelectedScreen({ name, notes, location, id, deviceId });
    setIsLinkScreenModal(true);
  };

  const closeLinkScreenModal = () => {
    setIsLinkScreenModal(false);
    setErrorMessage('');
  };

  const handleCreateScreen = async (e) => {
    e.preventDefault();

    try {
      await screenApi.add(newScreenName, user.organizationId);
      setNewScreenName('');
      closeAddScreenModal();
      fetchScreens();
    } catch (error) {
      console.error(error);
    }
  };
  const handleUpdateScreen = async (e) => {
    e.preventDefault();
    try {
      await screenApi.update(
        {
          name: selectedScreen.name,
          notes: selectedScreen.notes ? selectedScreen.notes : null,
          location: selectedScreen.location,
        },
        selectedScreen.id,
        user.organizationId
      );
      setSelectedScreen(null);
      closeEditScreenModal();
      fetchScreens();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteScreen = async (id) => {
    try {
      await screenApi.delete(id, user.organizationId);
      fetchScreens();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) {
      setFilteredScreens(null);
    }
    setFilteredScreens(
      screens.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const handleScreenUnlink = async () => {
    try {
      await screenApi.deactivate(selectedScreen.id, user.organizationId);
      setSelectedScreen(null);
      closeLinkScreenModal();
      fetchScreens();
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Failed to unlink the screen.');
    }
  };

  const handleScreenLink = async () => {
    try {
      await screenApi.activate(selectedScreen.id, activationCode, user.organizationId);
      setSelectedScreen(null);
      closeLinkScreenModal();
      fetchScreens();
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Failed to link the screen.');
    }
  };

  return (
    <div className="flex">
      <LeftSidebar/>
      <div
        className={`flex-grow mx-auto p-6 backdrop-blur-lg bg-white/60 shadow-lg rounded-lg ${PRIMARY_TEXT_COLOR}`}
      >
        <h1 className="text-3xl font-bold mb-4">All Screens</h1>

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
            placeholder="Search screens..."
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-300/50 hover:bg-gray-400/60 backdrop-blur rounded-lg p-2"
          >
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-500"/>
          </button>
        </form>

        {/* "Add new screen" */}
        <button
          disabled={loading}
          className="flex items-center bg-blue-500/60 hover:bg-blue-700/70 text-white px-4 py-2 rounded-lg shadow-md backdrop-blur"
          onClick={openAddScreenModal}
        >
          <PlusCircleIcon className="h-5 w-5 mr-2"/>
          Add new screen
        </button>

        {/* Screens list */}
        <div className="overflow-x-auto mt-6 rounded-lg bg-white/50 backdrop-blur-md shadow-md p-4">
          <table
            className={`min-w-full table-auto border-collapse rounded-lg overflow-hidden ${PRIMARY_TEXT_COLOR}`}
          >
            <thead>
            <tr className={`${PRIMARY_COLOR_CLASS} bg-gray-200/70 backdrop-blur`}>
              <th className="px-4 py-2 border-b w-[20%]">Name</th>
              <th className="px-4 py-2 border-b w-[20%]">Notes</th>
              <th className="px-4 py-2 border-b w-[15%]">Location</th>
              <th className="px-4 py-2 border-b w-[10%]">Activated</th>
              <th className="px-4 py-2 border-b w-[10%]">Last Updated</th>
              <th className="px-4 py-2 border-b w-[10%]">Actions</th>
            </tr>
            </thead>
            <tbody>
            {filteredScreens
              ? filteredScreens.map((screen) => (
                <ScreenItem
                  key={screen.id}
                  screen={screen}
                  handleDeleteScreen={handleDeleteScreen}
                  handleUpdateScreen={openEditScreenModal}
                />
              ))
              : screens.map((screen) => (
                <ScreenItem
                  key={screen.id}
                  screen={screen}
                  handleDeleteScreen={handleDeleteScreen}
                  handleUpdateScreen={openEditScreenModal}
                  handleScreenLinkStatus={openLinkScreenModal}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Modal */}
        <CustomModal isOpen={isAddScreenModal} closeModal={closeAddScreenModal}>
          <h2 className="text-2xl font-semibold mb-4">Add New Screen</h2>
          <input
            disabled={loading}
            type="text"
            value={newScreenName}
            onChange={(e) => setNewScreenName(e.target.value)}
            className={`border bg-white/50 backdrop-blur-md ${PRIMARY_TEXT_COLOR} rounded-lg p-2 w-full mb-4`}
            placeholder="Screen name..."
          />
          <div className="flex justify-end space-x-4">
            <button
              disabled={loading}
              className="bg-gray-300/50 text-gray-700 px-4 py-2 rounded-lg backdrop-blur"
              onClick={closeAddScreenModal}
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="bg-blue-500/60 text-white px-4 py-2 rounded-lg hover:bg-blue-600/70"
              onClick={handleCreateScreen}
            >
              Create
            </button>
          </div>
        </CustomModal>

        {/* Edit Modal */}
        {selectedScreen && (
          <CustomModal isOpen={isEditScreenModal} closeModal={closeEditScreenModal}>
            <h2 className="text-2xl font-semibold mb-4">Edit Screen</h2>
            <input
              disabled={loading}
              type="text"
              value={selectedScreen.name}
              onChange={(e) =>
                setSelectedScreen({ ...selectedScreen, name: e.target.value })
              }
              className={`border bg-white/50 backdrop-blur-md ${PRIMARY_TEXT_COLOR} rounded-lg p-2 w-full mb-4`}
              placeholder="Screen name..."
            />
            <input
              disabled={loading}
              type="text"
              value={selectedScreen.notes || ''}
              onChange={(e) =>
                setSelectedScreen({ ...selectedScreen, notes: e.target.value })
              }
              className={`border bg-white/50 backdrop-blur-md ${PRIMARY_TEXT_COLOR} rounded-lg p-2 w-full mb-4`}
              placeholder="Screen notes..."
            />
            <input
              disabled={loading}
              type="text"
              value={selectedScreen.location || ''}
              onChange={(e) =>
                setSelectedScreen({
                  ...selectedScreen,
                  location: e.target.value,
                })
              }
              className={`border bg-white/50 backdrop-blur-md ${PRIMARY_TEXT_COLOR} rounded-lg p-2 w-full mb-4`}
              placeholder="Screen location..."
            />
            <div className="flex justify-end space-x-4">
              <button
                disabled={loading}
                className="bg-gray-300/50 text-gray-700 px-4 py-2 rounded-lg backdrop-blur"
                onClick={closeEditScreenModal}
              >
                Cancel
              </button>
              <button
                disabled={loading}
                className="bg-blue-500/60 text-white px-4 py-2 rounded-lg hover:bg-blue-600/70"
                onClick={handleUpdateScreen}
              >
                Update
              </button>
            </div>
          </CustomModal>
        )}


        {/* Link Manage Modal */}
        {selectedScreen && (
          <CustomModal isOpen={isLinkScreenModal} closeModal={closeLinkScreenModal}>
            {selectedScreen.deviceId ? (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Unlink Screen</h2>
                  {errorMessage && (
                    <p className="text-red-500 mb-4">{errorMessage}</p>
                  )}
                  <p className="mb-6">
                    Are you sure you want to unlink device from this screen?
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      disabled={loading}
                      className="bg-gray-300/50 text-gray-700 px-4 py-2 rounded-lg backdrop-blur"
                      onClick={closeLinkScreenModal}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={loading}
                      className="bg-red-500/60 text-white px-4 py-2 rounded-lg hover:bg-red-600/70"
                      onClick={handleScreenUnlink}
                    >
                      Unlink
                    </button>
                  </div>
                </div>
              ) :
              (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Link Screen</h2>
                  {errorMessage && (
                    <p className="text-red-500 mb-4">{errorMessage}</p>
                  )}
                  <p className="mb-4">
                    Enter the device code to link this screen.
                  </p>
                  <input
                    disabled={loading}
                    type="text"
                    onChange={(e) => setActivationCode(e.target.value)}
                    className={`border bg-white/50 backdrop-blur-md ${PRIMARY_TEXT_COLOR} rounded-lg p-2 w-full mb-4`}
                    placeholder="Device code..."
                  />
                  <div className="flex justify-end space-x-4">
                    <button
                      disabled={loading}
                      className="bg-gray-300/50 text-gray-700 px-4 py-2 rounded-lg backdrop-blur"
                      onClick={closeLinkScreenModal}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={loading}
                      className="bg-blue-500/60 text-white px-4 py-2 rounded-lg hover:bg-blue-600/70"
                      onClick={handleScreenLink}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
          </CustomModal>
        )}
      </div>
    </div>

  );
};

export default HomePage;
