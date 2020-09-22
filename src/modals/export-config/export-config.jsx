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

import { selectSelectedConfigState } from "../../store";
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
  } = configState;
  useExportEffects(dispatch, projectId, optimId, frameworkTab, sampleType);

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
  return (
    <Dialog open={open} onClose={() => handleClose()} maxWidth="md">
      <DialogTitle>Export</DialogTitle>
      <DialogContent>
        <Box display="flex">
          <Box flexGrow="1">
            <Typography className={classes.contentHeader}>
              Optimization config file
            </Typography>
          </Box>
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
        <CodeContainer
          language="yaml"
          text={configExists ? _.get(config, availableFrameworks[frameworkTab]) : ""}
          defaultFileName="recal.config.yaml"
        />
        <Typography className={classes.contentHeader} gutterBottom>
          Code for optimization
        </Typography>
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
        <CodeContainer
          language="python"
          text={
            codeExists
              ? _.get(codeSamples, `${availableFrameworks[frameworkTab]}.${sampleType}`)
              : ""
          }
          defaultFileName="sample.py"
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => handleClose()}
          color="secondary"
          className={classes.containedButton}
          variant="contained"
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
