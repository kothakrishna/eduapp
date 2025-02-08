import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/mainPage/header";
import HeroSection from "./components/mainPage/HeroSection";
import AboutUs from "./components/AboutUs/AboutUs";
import Services from "./components/OurServices/Services";
import ContactUs from "./components/ContactUs/ContactUs";
import LoginForm from "./components/LoginRegister/LoginForm";
import ResetPassword from "./components/LoginRegister/ResetPassword";
import CreateAccount from "./components/LoginRegister/CreateAccount";
import Dashboard from "./components/Dashboard/Dashboard";
import ChatOllama from "./components/ChatOllama/ChatOllama";
import QuestionForm from "./components/QuestionForm/QuestionForm";
import Insert from "./components/DbInsert/Insert";
import Dashboard1 from "./components/Dashboard1/Dashboard1";

const AppContent = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();

  useEffect(() => {
    // Check login status from localStorage or any other method
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, [setIsLoggedIn]);

  return (
    <>
      {!isLoggedIn && <Header />}
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/LoginForm" element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/CreateAccount" element={<CreateAccount />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/ChatOllama" element={<ChatOllama />} />
        <Route path="/QuestionForm" element={<QuestionForm />} />
        <Route path="/Insert" element={<Insert />} />
        <Route path="/Dashboard1" element={<Dashboard1 setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </BrowserRouter>
  );
};

export default App;