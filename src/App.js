import { AuthContextProvider } from "./AuthContext";
import Header from "./components/Header";
import NewUser from "./components/NewUser";
import "./App.css";
import Profile from "./components/Profile";
import Review from "./components/Review";
import Home from "./components/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="home" element={<Home />} />
          </Routes>
          <NewUser />
          <Review />
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
