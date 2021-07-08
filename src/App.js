import './App.css';
import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import MyPage from "./pages/MyPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import ShowDetailPage from "./pages/ShowDetailPage";
import SignupPage from "./pages/SignupPage";
import UpdateDetailPage from "./pages/UpdateDetailPage";
import UpdateSelectionPage from "./pages/UpdateSelectionPage";
import UpdateUserPage from "./pages/UpdateUserPage";

import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

function App() {
  const state = useSelector((state) => state);
  //localStorage.clear();

  return (
    <Router>
      <Route
        render={() => {
          const pathname = window.location.pathname;
          console.log(pathname)
          const isTrue = pathname !== '/login' &&
            pathname !== '/signup' &&
            pathname !== '/updateuser';
          if (isTrue) {
            return <Header />
          }
        }}
      />
      <Switch>
        <Route path='/landing' render={() => <LandingPage />} />
        <Route path='/mypage' render={() => <MyPage />} />
        <Route path='/register' render={() => <RegisterPage />} />
        <Route path='/search' render={() => <SearchPage />} />
        <Route path='/showdetail' render={() => <ShowDetailPage />} />
        <Route path='/signup' render={() => <SignupPage />} />
        <Route path='/updatedetail' render={() => <UpdateDetailPage />} />
        <Route path='/updateselection' render={() => <UpdateSelectionPage />} />
        <Route path='/updateuser' render={() => <UpdateUserPage />} />
        <Route
          exact path='/'
          render={() => <Redirect to='/landing' />}
        />
      </Switch>
      <Route
        render={() => {
          const pathname = window.location.pathname;
          const isTrue = pathname !== '/login' &&
            pathname !== '/signup' &&
            pathname !== '/updateuser';
          if (isTrue) {
            return <Footer />
          }
        }}
      />
    </Router>
  );
}

export default App;
