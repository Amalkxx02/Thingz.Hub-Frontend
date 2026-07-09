import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "../../pages/AuthPage";
import Dashboard from "../../pages/Dashboard";
import { useAuth } from "../../context";
import LoadingSpinner from "../common/LoadingSpinner";

function App() {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard page="/" />} />
        
        <Route path="/devices" element={<Dashboard page="devices" />} />
        <Route path="/device/:id" element={<Dashboard page="device" />} />

        <Route path="/things" element={<Dashboard page="things" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
