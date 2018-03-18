import React, { Fragment } from "react";
import "./App.css";
import "./styles/app.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { RegisterPage, LoginPage, VerifyPage } from "./pages";
const App = () => (
  <Router>
    <div>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/verify" component={VerifyPage} />
    </div>
  </Router>
);

export default App;
