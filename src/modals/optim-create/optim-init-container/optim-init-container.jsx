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
    <DialogContent>
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
    </DialogContent>
  );
}

OptimInitContainer.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  pruning: PropTypes.bool.isRequired,
  setPruning: PropTypes.func.isRequired,
};

export default OptimInitContainer;
