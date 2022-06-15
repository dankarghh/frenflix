import AuthContext, { AuthContextProvider } from "./AuthContext";
import Header from "./components/Header";
import NewUser from "./components/NewUser";
import "./App.css";
import Profile from "./components/Profile";
import Review from "./components/Review";
import Home from "./components/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./components/SignIn";
import SideNav from "./components/SideNav";
import Newsfeed from "./components/Newsfeed";

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <BrowserRouter>
          <Header />

          {/* <SideNav /> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/newsfeed" element={<Newsfeed />} />
            <Route path="/review" element={<Review />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/newuser" element={<NewUser />} />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
