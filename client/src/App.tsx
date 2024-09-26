import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import Space from "./components/Space";
import CreateSpace from "./components/CreateSpace";
import Auth from "./components/Auth";
import SpaceList from "./components/SpaceList";

const App: React.FC = () => {
  return (
   <AuthProvider>
    <Router>
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/spaces" element={<SpaceList />} />
          <Route path="/space/:spaceId" element={<Space />} />
          <Route path="/create-space" element={<CreateSpace />} />
    </Routes>
    </Router>
    </AuthProvider>
  );    
};

export default App;
