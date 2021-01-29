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

import React from "react";
import { Button, Typography } from "@material-ui/core";
import ChevronLeft from "@material-ui/icons/ChevronLeft";

import AbsoluteLayout from "../../components/absolute-layout";
import makeStyles from "./not-found-sidenav-styles";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles();

function NotFoundSideNav() {
  const classes = useStyles();
  const history = useHistory();
  return (
    <AbsoluteLayout layoutClass={classes.root}>
      <div className={classes.header}>
        <Button className={classes.headerButton} onClick={() => history.push("/")}>
          <ChevronLeft />
        </Button>
        <Typography color="textPrimary" className={classes.headerText} noWrap>
          Home
        </Typography>
      </div>
    </AbsoluteLayout>
  );
}

export default NotFoundSideNav;
