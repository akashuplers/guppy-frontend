import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import SignUp from "./components/signup";
import { StoryUploadApiProvider } from "./contexts/ApiContext";
import UserHistory from "./components/history";
import MasterWsPage from "./components/master-ws";
import CompareJsons from "./components/compare-jsons";

function App() {

  return (
    <StoryUploadApiProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/history' element={<UserHistory />} />
          <Route path='/master-ws' element={<MasterWsPage />} />
          <Route path='/compare-jsons' element={<CompareJsons />} />
        </Routes>
      </BrowserRouter>
    </StoryUploadApiProvider>
  );
}

export default App;
