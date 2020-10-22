import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import {
  createBenchmarkThunk,
  getBenchmarksThunk,
  selectSelectedOptimsState,
  selectSystemState,
  STATUS_SUCCEEDED,
} from "../../store";

import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  FormControlLabel,
} from "@material-ui/core";

import makeStyles from "./benchmark-create-styles";
import { dateUtcToLocalString, inferenceEngineToName } from "../../components";

const useStyles = makeStyles();

const sortSelected = (selected, multiple) => {
  if (multiple) {
    return sortAsNumbers(selected).join(", ");
  } else {
    return selected;
  }
};

const sortAsNumbers = (array) => {
  const values = [...array];
  values.sort((a, b) => Number(a) - Number(b));
  return values;
};

function BenchmarkCreateDialog({ open, handleClose, projectId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const systemInfoState = useSelector(selectSystemState);
  const engines = _.get(systemInfoState, "val.available_engines", ["ort_cpu"]);
  const defaultCore =
    _.get(systemInfoState, "val.cores_per_socket", 1) *
    _.get(systemInfoState, "val.num_sockets", 1);

  const selectedOptimState = useSelector(selectSelectedOptimsState);
  const [inferenceEngine, setInferenceEngine] = useState(
    engines.includes("neural_magic") ? "neural_magic" : "ort_cpu"
  );
  const [inferenceModelOptimization, setInferenceModelOptimization] = useState("None");

  const [enableComparison, setEnableComparison] = useState(false);
  const [secondaryInferenceEngine, setSecondaryInferenceEngine] = useState("");
  const [secondaryInferenceModelOptimization, setSecondaryModelOptimization] = useState(
    "None"
  );
  const [multipleCoreCounts, setMultipleCoreCounts] = useState(false);
  const [multipleBatchSizes, setMultipleBatchSizes] = useState(false);
  const [coreCounts, setCoreCounts] = useState([defaultCore]);
  const [batchSizes, setBatchSizes] = useState([1]);

  useEffect(() => {
    if (systemInfoState.status === STATUS_SUCCEEDED) {
      const defaultCore =
        _.get(systemInfoState, "val.cores_per_socket", 1) *
        _.get(systemInfoState, "val.num_sockets", 1);
      setCoreCounts([defaultCore]);
      setInferenceEngine(engines.includes("neural_magic") ? "neural_magic" : "ort_cpu");
    }
  }, [systemInfoState]);

  const setDefault = () => {
    setInferenceEngine(engines.includes("neural_magic") ? "neural_magic" : "ort_cpu");
    setInferenceModelOptimization("None");
    setSecondaryInferenceEngine("");
    setSecondaryModelOptimization("None");
    setMultipleBatchSizes(false);
    setMultipleCoreCounts(false);
    setEnableComparison(false);
    setCoreCounts([defaultCore]);
    setBatchSizes([1]);
  };

  const onCancel = () => {
    handleClose();
    setDefault();
  };

  const getMaxIterations = () => {
    const minBatchSize = Math.min(...batchSizes);
    return Math.round(5 + 25 * Math.exp(1 - Math.pow(minBatchSize, 0.25)));
  };

  const onSubmit = () => {
    const inferenceModels = [
      {
        inference_engine: inferenceEngine,
        inference_model_optimization:
          inferenceModelOptimization === "None" ? "" : inferenceModelOptimization,
      },
    ];

    if (secondaryInferenceEngine) {
      inferenceModels.push({
        inference_engine: secondaryInferenceEngine,
        inference_model_optimization:
          secondaryInferenceModelOptimization === "None"
            ? ""
            : secondaryInferenceModelOptimization,
      });
    }
    dispatch(
      createBenchmarkThunk({
        projectId,
        inferenceModels,
        coreCounts,
        batchSizes,
        iterationsPerCheck: getMaxIterations(),
      })
    );
    handleClose();
    setDefault();
  };

  const onOrtCpuSelect = () => {
    setCoreCounts([defaultCore]);
    setMultipleCoreCounts(false);
  };

  const availableCores = [];
  for (let i = 0; i < defaultCore; i++) {
    availableCores.push(i + 1);
  }

  const availableBatchSizes = [];
  for (let i = 0; i < 15; i++) {
    availableBatchSizes.push(Math.pow(2, i));
  }

  const onComparison = () => {
    if (enableComparison) {
      setSecondaryInferenceEngine("");
      setSecondaryModelOptimization("None");
    }
    setEnableComparison(!enableComparison);
  };

  return (
    <Dialog open={open} PaperProps={{ className: classes.dialog }} maxWidth="md">
      <DialogTitle>Create Benchmark</DialogTitle>
      <DialogContent>
        <Grid container direction="column" className={classes.fieldRow}>
          <Grid item container xs={12} spacing={2}>
            <Grid item xs={7}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="inference-engine-label">Inference Engine</InputLabel>
                <Select
                  labelId="inference-engine-label"
                  value={inferenceEngine}
                  onChange={(event) => {
                    if (event.target.value === "ort_cpu") {
                      onOrtCpuSelect();
                    }
                    setInferenceEngine(event.target.value);
                  }}
                  label="Inference Engine"
                >
                  {engines.map((engine) => (
                    <MenuItem value={engine} key={engine}>
                      {inferenceEngineToName(engine)}
                    </MenuItem>
                  ))}

                  {/* <MenuItem value="ort_cpu">ONNX Runtime CPU</MenuItem> */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={5}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="optimization-label">Optimization version</InputLabel>
                <Select
                  labelId="optimization-label"
                  value={inferenceModelOptimization}
                  onChange={(event) => {
                    if (event.target.value === "ort_cpu") {
                      onOrtCpuSelect();
                    }
                    setInferenceModelOptimization(event.target.value);
                  }}
                  label="Optimization version"
                >
                  <MenuItem value="None">None</MenuItem>
                  {selectedOptimState.val.map((optim) => (
                    <MenuItem key={optim.optim_id} value={optim.optim_id}>
                      {optim.name || dateUtcToLocalString(optim.created)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item container xs={12} justify="flex-end">
            <FormControlLabel
              label={"Enable Comparison"}
              control={
                <Checkbox
                  color="primary"
                  checked={enableComparison}
                  onChange={onComparison}
                />
              }
            />
            {/* <Button onClick={onComparison}>{enableComparison ? "Remove Comparison" : "Enable Comparison"}</Button> */}
          </Grid>
          {enableComparison && (
            <Grid item container xs={12} spacing={2} className={classes.fieldRow}>
              <Grid item xs={7}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="secondary-inference-engine-label">
                    Comparing to
                  </InputLabel>
                  <Select
                    labelId="secondary-inference-engine-label"
                    value={secondaryInferenceEngine}
                    onChange={(event) => {
                      setSecondaryInferenceEngine(event.target.value);
                    }}
                    label="Inference Engine"
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="neural_magic">Neural Magic</MenuItem>
                    <MenuItem value="ort_cpu">ONNX Runtime CPU</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={5}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="secondary-optimization-label">
                    Optimization version
                  </InputLabel>
                  <Select
                    labelId="secondary-optimization-label"
                    value={secondaryInferenceModelOptimization}
                    onChange={(event) => {
                      setSecondaryModelOptimization(event.target.value);
                    }}
                    label="Optimization version"
                  >
                    <MenuItem value="None">None</MenuItem>
                    {selectedOptimState.val.map((optim) => (
                      <MenuItem key={optim.optim_id} value={optim.optim_id}>
                        {optim.name || dateUtcToLocalString(optim.created)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          <Grid item container xs={12} spacing={2} className={classes.fieldRow}>
            <Grid item xs={6}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="core-label">Core Counts</InputLabel>
                <Select
                  labelId="core-label"
                  multiple={multipleCoreCounts}
                  disabled={
                    inferenceEngine === "ort_cpu" ||
                    secondaryInferenceEngine === "ort_cpu"
                  }
                  value={multipleCoreCounts ? coreCounts : _.get(coreCounts, 0, "")}
                  onChange={(event) => {
                    if (multipleCoreCounts) {
                      setCoreCounts(sortAsNumbers(event.target.value));
                    } else {
                      setCoreCounts([event.target.value]);
                    }
                  }}
                  label="Core Counts"
                  renderValue={(value) => sortSelected(value, multipleCoreCounts)}
                >
                  {availableCores.map((core) => (
                    <MenuItem key={core} value={core}>
                      {multipleCoreCounts && (
                        <Checkbox checked={coreCounts.includes(core)} color="primary" />
                      )}
                      <ListItemText primary={core} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                label="Enable Multiple"
                control={
                  <Checkbox
                    color="primary"
                    disabled={
                      inferenceEngine === "ort_cpu" ||
                      secondaryInferenceEngine === "ort_cpu"
                    }
                    checked={multipleCoreCounts}
                    onChange={() => {
                      if (multipleCoreCounts && coreCounts.length > 1) {
                        setCoreCounts(coreCounts.slice(0, 1));
                      }
                      setMultipleCoreCounts(!multipleCoreCounts);
                    }}
                  />
                }
              />
            </Grid>
          </Grid>
          <Grid item container xs={12} spacing={2} className={classes.fieldRow}>
            <Grid item xs={6}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="batch-label">Batch Sizes</InputLabel>
                <Select
                  labelId="batch-label"
                  multiple={multipleBatchSizes}
                  value={multipleBatchSizes ? batchSizes : _.get(batchSizes, 0, "")}
                  onChange={(event) => {
                    if (multipleBatchSizes) {
                      setBatchSizes(sortAsNumbers(event.target.value));
                    } else {
                      setBatchSizes([event.target.value]);
                    }
                  }}
                  label="Batch Sizes"
                  renderValue={(value) => sortSelected(value, multipleBatchSizes)}
                >
                  {availableBatchSizes.map((batchSize) => (
                    <MenuItem key={batchSize} value={batchSize}>
                      {multipleBatchSizes && (
                        <Checkbox
                          checked={batchSizes.includes(batchSize)}
                          color="primary"
                        />
                      )}
                      <ListItemText primary={batchSize} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                label="Enable Multiple"
                control={
                  <Checkbox
                    color="primary"
                    checked={multipleBatchSizes}
                    onChange={() => {
                      if (multipleBatchSizes && batchSizes.length > 1) {
                        setBatchSizes(batchSizes.slice(0, 1));
                      }
                      setMultipleBatchSizes(!multipleBatchSizes);
                    }}
                  />
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onCancel()}
          className={classes.cancelButton}
          disableElevation
        >
          Cancel
        </Button>
        <Button
          onClick={() => onSubmit()}
          color="secondary"
          variant="contained"
          disableElevation
        >
          Run
        </Button>
      </DialogActions>
    </Dialog>
  );
}

BenchmarkCreateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  projectId: PropTypes.string.isRequired,
};

export default BenchmarkCreateDialog;
