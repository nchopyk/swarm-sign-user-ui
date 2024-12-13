import React, { createContext, useContext, useNavigate } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Login from './pages/loginPage';
import Register from './pages/registerPage';
import HomePage from './pages/homePage';
import MediasPage from './pages/mediasPage';
import GlobalProvider from './context/context';
import { useGlobalContext } from './context/context';
import ProfilePage from './pages/profilePage';
import PlaylistPage from './pages/playlistPage';
import SchedulePage from './pages/schedulePage';

const ProtectedRoute = ({ children }) => {
  const { user, tokens, logout } = useGlobalContext();

  if (!user || !tokens) {
    logout();
    return <Navigate to="/login" replace/>;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  return children;
};

const App = () => {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login/>
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register/>
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/medias"
            element={
              <ProtectedRoute>
                <MediasPage/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlists"
            element={
              <ProtectedRoute>
                <PlaylistPage/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedules"
            element={
              <ProtectedRoute>
                <SchedulePage/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </GlobalProvider>
  );
};

export default App;
