import { Route, Routes } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Home from '../pages/home/Home';
import PostPage from '../pages/posts/Post';
import Profile from '../pages/profile/Profile';
import Login from '../pages/login/Login';
import Signup from '../pages/signup/Signup';
import Auth from '../pages/auth/Auth';
import { useSocketNotificationEvents } from '../hooks/sockets/useSocketNotificationEvents';
import Notifications from '../pages/notifications/Notifications';

export function App() {
  useSocketNotificationEvents();

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" index element={<Home />} />
        <Route path="/home" index element={<Home />} />
        <Route path="/posts/:id" element={<PostPage />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>

      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* <Route path="/not-found" element={<NotFound />} /> */}
      {/* <Route path="*" element={<Navigate to="/not-found" replace />} /> */}
    </Routes>
  );
}

export default App;
