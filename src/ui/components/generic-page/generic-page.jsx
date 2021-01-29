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
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";

import AbsoluteLayout from "../absolute-layout";
import makeStyles from "./generic-page-styles";

const useStyles = makeStyles();

function GenericPage({ title, description, logoComponent, logoClassName }) {
  const classes = useStyles();

  return (
    <AbsoluteLayout spacingTop={4} spacingBottom={4} spacingRight={4} spacingLeft={4}>
      <div className={classes.root}>
        <div className={classes.layout}>
          {logoComponent &&
            React.cloneElement(logoComponent, {
              className: logoClassName
                ? `${classes.icon} ${logoClassName}`
                : classes.icon,
            })}
          <Typography color="textSecondary" variant="h3" align="center">
            {title}
          </Typography>

          <Typography
            color="textSecondary"
            variant="h5"
            align="center"
            className={classes.desc}
          >
            {description}
          </Typography>
        </div>
      </div>
    </AbsoluteLayout>
  );
}

GenericPage.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  logoComponent: PropTypes.any,
  logoClassName: PropTypes.string,
};

export default GenericPage;
