/*
Copyright 2021-present Neuralmagic, Inc.

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

import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";

import makeTheme, { useDarkMode } from "./app-theme";
import AppSideNav from "./sidenav";
import makeStyles from "./app-styles";
import AppMain from "./main";
import useLocationUpdateStore from "./hooks/use-location-update-store";
import SystemInfoModal from "../modals/system-info";

function App() {
  const [systemInfoOpen, setSystemInfoOpen] = useState(false);

  const [darkMode, setDarkMode] = useDarkMode();
  const theme = makeTheme(darkMode);
  const sideNavTheme = makeTheme(!darkMode);
  const useStyles = makeStyles();
  const classes = useStyles();
  useLocationUpdateStore();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <ThemeProvider theme={sideNavTheme}>
          <AppSideNav onInfoClick={() => setSystemInfoOpen(true)} />
        </ThemeProvider>

        <div className={classes.main}>
          <AppMain />
          <SystemInfoModal
            open={systemInfoOpen}
            handleClose={() => setSystemInfoOpen(false)}
            isDarkMode={darkMode}
            toggleDarkMode={() => setDarkMode(!darkMode)}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
