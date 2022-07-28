import { AuthContextProvider } from "./AuthContext";
import Header from "./components/Header";
import NewUser from "./components/NewUser";
import "./App.css";
import Profile from "./components/Profile";
import NewReview from "./components/NewReview";
import Home from "./components/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./components/SignIn";

import Newsfeed from "./components/Newsfeed";

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <BrowserRouter>
          <Header />

          <div className="">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/newsfeed" element={<Newsfeed />} />
              <Route path="/review" element={<NewReview />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/newuser" element={<NewUser />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
