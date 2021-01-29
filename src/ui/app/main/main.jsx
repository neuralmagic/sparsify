/*
Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from "react";
import { Route } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";

import { makeContentRoutes, makeRouteTransitionOpacity } from "../../routes";
import ServerDownModal from "../../modals/server-down";
import makeStyles from "./main-styles";

const useStyles = makeStyles();

function AppMain() {
  const classes = useStyles();

  const routes = makeContentRoutes();
  const transition = makeRouteTransitionOpacity();

  return (
    <div className={classes.root}>
      <ServerDownModal />
      <AnimatedSwitch
        atEnter={transition.atEnter}
        atLeave={transition.atLeave}
        atActive={transition.atActive}
        mapStyles={transition.mapStyles}
      >
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            component={route.component}
            exact={route.exact}
          />
        ))}
      </AnimatedSwitch>
    </div>
  );
}

export default AppMain;
