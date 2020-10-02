import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
} from "@material-ui/core";

import makeStyles from "../optim-create-styles";
import CustomOptimSelect from "./custom-optim-select";
import PresetOptimSelect from "./preset-optim-select";

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
      {optimizerSelectTab === 0 && (
        <CustomOptimSelect pruning={pruning} setPruning={setPruning} />
      )}
      {optimizerSelectTab === 1 && <PresetOptimSelect />}
      <DialogActions>
        <Box paddingRight={1}>
          <Button
            onClick={() => onCancel()}
            className={classes.cancelButton}
            disableElevation
          >
            Cancel
          </Button>
        </Box>
        <Box>
          <Button
            onClick={() => onNext()}
            color="secondary"
            variant="contained"
            disableElevation
          >
            Next
          </Button>
        </Box>
      </DialogActions>
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
