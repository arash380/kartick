import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes as Switch } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout/MainLayout";
import Home from "../pages/Home/Home";
import rc from "./routeConfigs";
import Join from "../pages/Join/Join";
import Lobby from "../pages/Lobby/Lobby";
import Create from "../pages/Create/Create";
import Results from "../pages/Results/Results";

const { default: defaultRoute, wildCard, join, create, lobby, results } = rc;

const Routes = () => (
  <Router>
    <Switch>
      <Route element={<MainLayout />}>
        <Route path={defaultRoute} element={<Home />} />
        <Route path={join} element={<Join />} />
        <Route path={lobby} element={<Lobby />} />
        <Route path={create} element={<Create />} />
        <Route path={results} element={<Results />} />
        <Route path={wildCard} element={<Navigate to={defaultRoute} />} />
      </Route>
    </Switch>
  </Router>
);

export default Routes;
