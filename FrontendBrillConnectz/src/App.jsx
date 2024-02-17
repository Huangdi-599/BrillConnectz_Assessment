import './App.css'
import { Routes, Route } from 'react-router-dom';
import Profile from './components/Profile/Profile';
import Discover from './components/pages/Discover';
import Login from './Authentication/Login';
import Signup from './Authentication/Signup';
import ForgotPassword from './Authentication/ForgotPassword';
import VerifyOtp from './Authentication/VerifyOtp';
import ConfirmEmail from './Authentication/ConfirmEmail';
import ResetPassword from './Authentication/ResetPassword';
import Navigation from './container/Navigaton';
import Setting from './components/pages/Setting';
import Buddies from './components/pages/Buddies';
import ProtectedRoute from "./Authentication/ProtectedRoute"
import { AuthContainer as AuthProvider } from './container/AuthContainer';

function App() {

  return (
    <>
       <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigation />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="verifyotp" element={<VerifyOtp />} />
              <Route path="confirm-email/:userId" element={<ConfirmEmail />} />
              <Route path="reset-password/:resetToken" element={<ResetPassword />} />
              <Route path="" element={<Discover />} />
              <Route path="buddies" element={<Buddies />} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="settings" element={<ProtectedRoute><Setting /></ProtectedRoute>} />
          </Route>
          </Routes>
       </AuthProvider>
    </>
  )
}

export default App
