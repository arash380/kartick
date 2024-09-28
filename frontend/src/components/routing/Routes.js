import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes as Switch } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout/MainLayout";
import Home from "../pages/Home/Home";
import rc from "./routeConfigs";
import Join from "../pages/Join/Join";
import Lobby from "../pages/Lobby/Lobby";

const { default: defaultRoute, wildCard, join, lobby } = rc;

const Routes = () => (
  <Router>
    <Switch>
      <Route element={<MainLayout />}>
        <Route path={defaultRoute} element={<Home />} />
        <Route path={join} element={<Join />} />
        <Route path={lobby} element={<Lobby />} />
        <Route path={wildCard} element={<Navigate to={defaultRoute} />} />
      </Route>
    </Switch>
  </Router>
);

export default Routes;
