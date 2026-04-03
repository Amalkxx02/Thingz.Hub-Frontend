import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from '../../pages/AuthPage'
import Dashboard from '../../pages/Dashboard'
import OnboardingPage from '../../pages/OnboardingPage'
import ToastContainer from '../Toast'
import { useAuth } from '../../context'

function App() {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
        <ToastContainer />
      </>
    );
  }

  if (!user.is_onboarded) {
    return (
      <>
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </Routes>
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/devices" element={<Dashboard page="devices" />} />
        <Route path="/things" element={<Dashboard page="things" />} />
        <Route path="/rooms" element={<Dashboard page="rooms" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
