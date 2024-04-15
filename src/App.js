import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import SignUp from "./components/signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
