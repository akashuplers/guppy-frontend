import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import SignUp from "./components/signup";
import { StoryUploadApiProvider } from "./contexts/ApiContext";
import UserHistory from "./components/history";

function App() {

  return (
    <StoryUploadApiProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/history' element={<UserHistory />} />
        </Routes>
      </BrowserRouter>
    </StoryUploadApiProvider>
  );
}

export default App;
