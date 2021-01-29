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

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
} from "@material-ui/core";
import _ from "lodash";

import { selectSelectedConfigState, STATUS_FAILED, STATUS_LOADING } from "../../store";
import makeStyles from "./export-styles";
import { useExportEffects } from "./export-hooks";
import CodeContainer from "./code-container";

function ExportDialog({ projectId, optimId, open, handleClose }) {
  const configState = useSelector(selectSelectedConfigState);
  const [frameworkTab, setFrameworkTab] = useState(0);
  const [sampleType, setSampleType] = useState("");
  const dispatch = useDispatch();
  const useStyles = makeStyles();
  const classes = useStyles();

  const {
    availableFrameworks,
    availableCodeSamples,
    codeSamples,
    config,
    codeSampleStatus,
    configStatus,
    error,
    configError,
    codeSampleError,
  } = configState;
  useExportEffects(dispatch, projectId, optimId, frameworkTab, sampleType, open);

  useEffect(() => {
    const codeSamples = _.get(
      availableCodeSamples,
      availableFrameworks[frameworkTab],
      []
    );
    if (codeSamples.length > 0) {
      setSampleType(codeSamples[0]);
    }
  }, [availableCodeSamples, availableFrameworks, frameworkTab]);

  const configExists =
    _.get(availableFrameworks, frameworkTab) &&
    availableFrameworks[frameworkTab] in config;
  const codeExists =
    _.get(availableFrameworks, frameworkTab) &&
    sampleType in _.get(codeSamples, `${availableFrameworks[frameworkTab]}`, {});

  const loadingConfig =
    configStatus === STATUS_LOADING || configStatus === STATUS_FAILED;
  const loadingCodeSample =
    codeSampleStatus === STATUS_LOADING || codeSampleStatus === STATUS_FAILED;

  return (
    <Dialog
      open={open}
      onClose={() => handleClose()}
      maxWidth="md"
      PaperProps={{ className: classes.dialog }}
    >
      <DialogTitle>
        <Box display="flex">
          <Box flexGrow="1">Export</Box>
          <Box>
            <Tabs
              onChange={(event, value) => {
                setFrameworkTab(value);
              }}
              indicatorColor="primary"
              textColor="primary"
              value={frameworkTab}
            >
              {availableFrameworks.map((framework, index) => (
                <Tab label={framework} key={index} />
              ))}
            </Tabs>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Box>
            <Typography className={classes.contentHeader}>
              Optimization config file
            </Typography>
          </Box>
        </Box>
        <CodeContainer
          language="yaml"
          text={configExists ? _.get(config, availableFrameworks[frameworkTab]) : ""}
          defaultFileName="recal.config.yaml"
          loading={loadingConfig}
          error={configError || error}
        />
        <Box className={classes.optimizationRow}>
          <Typography className={classes.contentHeader}>
            Code for optimization
          </Typography>
          <Box>
            <FormControl variant="outlined" className={classes.select}>
              <InputLabel id="code-type-label">Code type</InputLabel>
              <Select
                labelId="code-type-label"
                value={sampleType}
                onChange={(event) => {
                  setSampleType(event.target.value);
                }}
                label="Code type"
              >
                {_.get(availableCodeSamples, availableFrameworks[frameworkTab], []).map(
                  (sampleTypeOption) => (
                    <MenuItem value={sampleTypeOption} key={sampleTypeOption}>
                      {sampleTypeOption}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <CodeContainer
          language="python"
          text={
            codeExists
              ? _.get(codeSamples, `${availableFrameworks[frameworkTab]}.${sampleType}`)
              : ""
          }
          defaultFileName="sample.py"
          loading={loadingCodeSample}
          error={codeSampleError || error}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => handleClose()}
          className={classes.containedButton}
          disableElevation
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ExportDialog.propTypes = {
  projectId: PropTypes.string.isRequired,
  optimId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
};

export default ExportDialog;
