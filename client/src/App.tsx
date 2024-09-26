import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import Space from "./components/Space";
import CreateSpace from "./components/CreateSpace";
import Auth from "./components/Auth";

const app : React.FC = () => {
  return (
   <AuthProvider>

    <Router>

    <Routes>

   <Route  path = "/" element={ <Home />}  />
   <Route  path="/auth" element={ <Auth />}  />
   <Route  path = "/spaces"  element= { <Space />}  />
   <Route  path = "/space/:spaceId" element = { <CreateSpace />}  />  


    </Routes>

    </Router>

    </AuthProvider>

  );    
};

export default app;