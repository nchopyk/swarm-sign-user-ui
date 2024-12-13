import React, { useEffect, useState } from 'react';
import LeftSidebar from '../layouts/sideBar';
import { useGlobalContext } from '../context/context';
import CustomModal from '../components/customModal';
import ScheduleItem from '../components/scheduleItem';
import { PlusCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import scheduleApi from '../api/scheduleApi';
import playlistApi from '../api/playlistApi';
import screenApi from '../api/screenApi';
import { BG_COLOR_CLASS, PRIMARY_COLOR_CLASS, PRIMARY_TEXT_COLOR, SECONDARY_COLOR_CLASS } from '../constants.js';

const SchedulePage = () => {
  const [scheduleList, setScheduleList] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isAddScheduleModal, setIsAddScheduleModal] = useState(false);
  const [isEditScheduleModal, setIsEditScheduleModal] = useState(false);
  const [newScheduleName, setNewScheduleName] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [selectedScreenId, setSelectedScreenId] = useState('');
  const [availablePlaylists, setAvailablePlaylists] = useState([]);
  const [availableScreens, setAvailableScreens] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { loading, setLoading, user, error, setErrorMesage } =
    useGlobalContext();

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const schedulesFromApi = await scheduleApi.getAll(user.organizationId);
      setScheduleList(schedulesFromApi.data.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const playlistsFromApi = await playlistApi.getAll(user.organizationId);
      setAvailablePlaylists(playlistsFromApi.data.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const fetchScreens = async () => {
    try {
      const screensFromApi = await screenApi.getAll(user.organizationId);
      setAvailableScreens(screensFromApi.data.data);
    } catch (error) {
      console.error('Error fetching screens:', error);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchPlaylists();
    fetchScreens();
  }, []);

  const openAddScheduleModal = () => setIsAddScheduleModal(true);
  const closeAddScheduleModal = () => setIsAddScheduleModal(false);
  const openEditScheduleModal = (scheduleId) => {
    const schedule = scheduleList.find(
      (schedule) => schedule.id === scheduleId
    );
    setSelectedSchedule(schedule);
    setIsEditScheduleModal(true);
  };
  const closeEditScheduleModal = () => setIsEditScheduleModal(false);

  const handleCreateSchedule = async (e) => {
    e.preventDefault();

    if (!newScheduleName || !selectedPlaylistId || !selectedScreenId) {
      return setErrorMesage('Please fill all fields', 3000);
    }

    try {
      await scheduleApi.add(
        newScheduleName,
        selectedPlaylistId,
        selectedScreenId,
        user.organizationId,
        startDateTime,
        endDateTime
      );
      setNewScheduleName('');
      setSelectedPlaylistId('');
      setSelectedScreenId('');
      closeAddScheduleModal();
      fetchSchedules();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    try {
      await scheduleApi.update(
        selectedSchedule.id,
        selectedSchedule.name,
        user.organizationId
      );
      setSelectedSchedule(null);
      closeEditScheduleModal();
      fetchSchedules();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await scheduleApi.delete(id, user.organizationId);
      fetchSchedules();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) {
      setFilteredSchedules(null);
    }
    setFilteredSchedules(
      scheduleList.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  return (
    <div className="flex">
      <LeftSidebar/>
      <div
        className={`flex-grow mx-auto p-6 backdrop-blur-lg bg-white/60 shadow-lg rounded-lg ${PRIMARY_TEXT_COLOR}`}
      >
        <h1 className="text-3xl font-bold mb-4">All Schedules</h1>

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
            placeholder="Search schedules..."
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-300/50 hover:bg-gray-400/60 backdrop-blur rounded-lg p-2 focus:outline-none"
          >
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-500"/>
          </button>
        </form>

        {/* "Add new schedule" */}
        <button
          disabled={loading}
          className="flex items-center bg-blue-500/60 hover:bg-blue-700/70 text-white px-4 py-2 rounded-lg shadow-md backdrop-blur focus:outline-none"
          onClick={openAddScheduleModal}
        >
          <PlusCircleIcon className="h-5 w-5 mr-2"/>
          Add new schedule
        </button>

        {/* Schedule list */}
        <div className="mt-6">
          <div className="min-w-full mb-4">
            <div className="bg-gray-200/70 backdrop-blur-md rounded-lg p-4 flex justify-center font-bold">
              <span className="flex-[3] text-center">Name</span>
              <span className="flex-[2] text-center">Screen</span>
              <span className="flex-[2] text-center">Start</span>
              <span className="flex-[2] text-center">End</span>
              <span className="flex-[2] text-center">Close/Open</span>
            </div>
          </div>
          {filteredSchedules
            ? filteredSchedules.map((schedule) => (
              <ScheduleItem
                key={schedule.id}
                schedule={schedule}
                handleDeleteSchedule={handleDeleteSchedule}
                handleUpdateSchedule={openEditScheduleModal}
              />
            ))
            : scheduleList.map((schedule) => (
              <ScheduleItem
                key={schedule.id}
                schedule={schedule}
                handleDeleteSchedule={handleDeleteSchedule}
                handleUpdateSchedule={openEditScheduleModal}
              />
            ))}
        </div>

        {/* Add Schedule Modal */}
        <CustomModal
          isOpen={isAddScheduleModal}
          closeModal={closeAddScheduleModal}
          className="backdrop-blur-lg bg-white/60 shadow-lg rounded-lg"
        >
          <h2 className="text-2xl font-semibold mb-6">Add New Schedule</h2>
          {error && (
            <span className="text-red-600 text-lg font-medium block mb-4">
          Please fill all fields!
        </span>
          )}
          <input
            disabled={loading}
            type="text"
            value={newScheduleName}
            onChange={(e) => setNewScheduleName(e.target.value)}
            className="border bg-white/50 backdrop-blur-md border-gray-300 rounded-lg p-3 w-full mb-5 focus:outline-none"
            placeholder="Schedule name"
          />

          <div className="mb-5">
            <h3 className="font-semibold text-lg mb-2">Select Playlist:</h3>
            <select
              value={selectedPlaylistId}
              onChange={(e) => setSelectedPlaylistId(e.target.value)}
              className="w-full p-3 pr-10 border rounded-lg bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled className="text-gray-400">
                Select a playlist
              </option>
              {availablePlaylists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <h3 className="font-semibold text-lg mb-2">Select Screen:</h3>
            <select
              value={selectedScreenId}
              onChange={(e) => setSelectedScreenId(e.target.value)}
              className="w-full p-3 pr-10 border rounded-lg bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled className="text-gray-400">
                Select a screen
              </option>
              {availableScreens.map((screen) => (
                <option key={screen.id} value={screen.id}>
                  {screen.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <h3 className="font-semibold text-lg mb-2">Start Time:</h3>
            <input
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              className="border bg-white/50 backdrop-blur-md border-gray-300 rounded-lg p-3 w-full focus:outline-none"
              disabled={loading}
            />
          </div>

          <div className="mb-5">
            <h3 className="font-semibold text-lg mb-2">End Time:</h3>
            <input
              type="datetime-local"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              className="border bg-white/50 backdrop-blur-md border-gray-300 rounded-lg p-3 w-full focus:outline-none"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              disabled={loading}
              onClick={closeAddScheduleModal}
              className="px-5 py-3 rounded-lg bg-gray-300/50 text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={handleCreateSchedule}
              className="px-5 py-3 rounded-lg bg-blue-500/60 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Save
            </button>
          </div>
        </CustomModal>

        {/* Edit Schedule Modal */}
        {selectedSchedule && (
          <CustomModal
            isOpen={isEditScheduleModal}
            closeModal={closeEditScheduleModal}
            className="backdrop-blur-lg bg-white/60 shadow-lg rounded-lg"
          >
            <h2 className="text-2xl font-semibold mb-6">Edit Schedule</h2>
            {error && (
              <span className="text-red-600 text-lg font-medium block mb-4">
            Please fill all fields!
          </span>
            )}
            <input
              disabled={loading}
              type="text"
              value={selectedSchedule.name}
              onChange={(e) =>
                setSelectedSchedule({ ...selectedSchedule, name: e.target.value })
              }
              className="border bg-white/50 backdrop-blur-md border-gray-300 rounded-lg p-3 w-full mb-5 focus:outline-none"
              placeholder="Schedule name..."
            />
            <select
              value={selectedSchedule.playlistId}
              onChange={(e) =>
                setSelectedSchedule({ ...selectedSchedule, playlistId: e.target.value })
              }
              className="w-full p-3 pr-10 border rounded-lg bg-white/50 backdrop-blur-md focus:outline-none"
            >
              <option value="" disabled className="text-gray-400">
                Select a playlist
              </option>
              {availablePlaylists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-4 mt-5">
              <button
                disabled={loading}
                onClick={closeEditScheduleModal}
                className="px-5 py-3 rounded-lg bg-gray-300/50 text-gray-700 hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleUpdateSchedule}
                className="px-5 py-3 rounded-lg bg-blue-500/60 text-white hover:bg-blue-600 focus:outline-none"
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

export default SchedulePage;
