import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Detection from "../pages/Detection";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={ <Home />}
      />
 <Route
        path="/about"
        element={ <About/>}
      />


      <Route
        path="/detection"
        element={ <Detection /> }
      />
 
    </Routes>
  );
}

export default AppRoutes;