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
import PropTypes from "prop-types";
import { Box, DialogContent, Tab, Tabs, Typography } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";

import makeStyles from "../optim-create-styles";
import OptimSwitch from "./optim-switch";

const useStyles = makeStyles();

function OptimInitContainer({ onCancel, onNext, pruning, setPruning }) {
  const [optimizerSelectTab, setOptimizerSelectTab] = useState(0);
  const classes = useStyles();
  return (
    <Box>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        value={optimizerSelectTab}
        onChange={(event, value) => {
          setOptimizerSelectTab(value);
        }}
      >
        <Tab label="Custom" />
        <Tab label="Presets" />
      </Tabs>
      <Box className={classes.tabContainer}>
        <SwipeableViews index={optimizerSelectTab} disabled={false}>
          <Box>
            <OptimSwitch
              value={pruning}
              onChange={setPruning}
              title="Pruning"
              description="Remove unused weights in the neural network to enable 
                    reduction in compute for inference speedup."
            />
            <OptimSwitch
              title="Coming Soon - Quantization"
              description="Use lower precision numerical formats for weights in neural networks to 
                    reduce bandwith and compute for inference speedup."
              disabled={true}
            />
            <OptimSwitch
              title="Coming Soon - Sparse transfer learning (trainable layers)"
              description="Use lower precision numerical formats for weights in neural 
                    networks to reduce bandwith and compute for inference speedup."
              disabled={true}
            />
          </Box>
          <Box
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            className={classes.noPresetsLabel}
          >
            <Typography color="textSecondary">Coming Soon</Typography>
          </Box>
        </SwipeableViews>
      </Box>
    </Box>
  );
}

OptimInitContainer.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  pruning: PropTypes.bool.isRequired,
  setPruning: PropTypes.func.isRequired,
};

export default OptimInitContainer;
