import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { TextField, Typography, Card, CardContent } from "@material-ui/core";

import makeStyles from "./training-summary-card-styles";
import { updateOptimsThunk } from "../../../store";
import ModifierRow from "./modifier-row";
import Background from "./background";
import DisplayCard from "../../../components/display-card";
import DisplayCardBody from "../../../components/display-card-body";
import DisplayCardActions from "../../../components/display-card-actions";
import EpochRange from "../../../components/epoch-range";

const useStyles = makeStyles();

const TrainingSummaryCard = ({ projectId, optim }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [startEpoch, setStartEpoch] = useState(`${optim.start_epoch}`);
  const [endEpoch, setEndEpoch] = useState(`${optim.end_epoch}`);

  const modifiers = [];
  let pruningStart = optim.end_epoch;
  let pruningEnd = optim.start_epoch;

  if (optim.pruning_modifiers) {
    optim.pruning_modifiers.forEach((mod) => {
      modifiers.push({
        name: "Pruning Modifier",
        start: mod.start_epoch,
        end: mod.end_epoch,
      });

      if (mod.start_epoch < pruningStart) {
        pruningStart = mod.start_epoch;
      }

      if (mod.end_epoch > pruningEnd) {
        pruningEnd = mod.end_epoch;
      }
    });
  }

  if (optim.lr_schedule_modifiers) {
    optim.lr_schedule_modifiers.forEach((mod) => {
      modifiers.push({
        name: "Learning Rate Modifier",
        start: mod.start_epoch,
        end: mod.end_epoch,
      });
    });
  }

  function setEpochs() {
    let newStartEpoch = parseFloat(startEpoch);
    let newEndEpoch = parseFloat(endEpoch);

    if (isNaN(newStartEpoch)) {
      newStartEpoch = startEpoch;
    }

    if (isNaN(newEndEpoch)) {
      newEndEpoch = endEpoch;
    }

    if (newEndEpoch < newStartEpoch) {
      newEndEpoch = newStartEpoch + 1.0;
    }

    setStartEpoch(`${newStartEpoch}`);
    setEndEpoch(`${newEndEpoch}`);

    if (newStartEpoch !== optim.start_epoch || newEndEpoch !== optim.end_epoch) {
      dispatch(
        updateOptimsThunk({
          projectId,
          optimId: optim.optim_id,
          startEpoch: newStartEpoch,
          endEpoch: newEndEpoch,
        })
      );
    }
  }

  return (
    <DisplayCard cardClassName={classes.card}>
      <DisplayCardBody className={classes.rowsLayout}>
        <div className={classes.rows}>
          {modifiers.map((mod) => (
            <ModifierRow
              key={mod.name}
              name={mod.name}
              start={mod.start}
              end={mod.end}
              globalStart={optim.start_epoch}
              globalEnd={optim.end_epoch}
            />
          ))}
          <Background
            pruningStart={pruningStart}
            pruningEnd={pruningEnd}
            globalStart={optim.start_epoch}
            globalEnd={optim.end_epoch}
          />
          <Typography
            className={classes.rowsXLabel}
            color="textSecondary"
            variant="subtitle2"
          >
            Active Epochs
          </Typography>
        </div>
      </DisplayCardBody>

      <DisplayCardActions noMargin={true}>
        <EpochRange
          label="Global Epoch Range"
          startEpoch={startEpoch}
          endEpoch={endEpoch}
          onStartEpochChange={setStartEpoch}
          onEndEpochChange={setEndEpoch}
          onStartFinished={setEndEpoch}
          onEndFinished={setEpochs}
        />
      </DisplayCardActions>
    </DisplayCard>
  );
};

TrainingSummaryCard.propTypes = {
  projectId: PropTypes.string.isRequired,
  optim: PropTypes.object.isRequired,
};

export default TrainingSummaryCard;
