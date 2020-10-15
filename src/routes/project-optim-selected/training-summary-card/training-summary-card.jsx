import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { TextField, Typography, Card, CardContent } from "@material-ui/core";

import makeStyles from "./training-summary-card-styles";
import { updateOptimsThunk } from "../../../store";

const useStyles = makeStyles();

const ModifierRow = ({ name, start, end, globalStart, globalEnd }) => {
  const classes = useStyles();

  if (end < 0) {
    end = globalEnd;
  }

  if (start < 0) {
    start = globalStart;
  }

  const percentTotal = (end - start) / (globalEnd - globalStart);
  const percentBeforeStart = start / (globalEnd - globalStart);

  return (
    <div className={classes.modifier}>
      <div className={classes.modifierLabelContainer}>
        <div className={classes.modifierLabelWrapper}>
          <Typography
            className={classes.modifierLabel}
            color="textPrimary"
            variant="subtitle2"
            noWrap
          >
            {name}
          </Typography>
        </div>
      </div>

      <div className={classes.modifierBackground}>
        <div
          className={classes.modifierActive}
          style={{
            width: `${percentTotal * 100}%`,
            marginLeft: `${percentBeforeStart * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

ModifierRow.propTypes = {
  name: PropTypes.string.isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  globalStart: PropTypes.number.isRequired,
  globalEnd: PropTypes.number.isRequired,
};

const BackgroundDivider = ({ epoch }) => {
  const classes = useStyles();

  return (
    <div className={classes.backgroundDivider}>
      <Typography
        color="textSecondary"
        variant="subtitle2"
        className={classes.backgroundDividerLabel}
      >
        {epoch}
      </Typography>
    </div>
  );
};

BackgroundDivider.propTypes = {
  epoch: PropTypes.number.isRequired,
};

const BackgroundSection = ({ width, label, startEpoch, colorClass }) => {
  const classes = useStyles();

  return (
    <div className={classes.backgroundSection} style={{ width: `${width * 100}%` }}>
      <div className={classes.backgroundSectionLabelContainer}>
        <Typography
          color="textSecondary"
          variant="subtitle2"
          className={classes.backgroundSectionLabel}
        >
          {label}
        </Typography>
        <div className={classes.backgroundSectionLabelTick} />
      </div>

      <BackgroundDivider epoch={startEpoch} />

      <div className={`${colorClass} ${classes.backgroundSectionFill}`} />
    </div>
  );
};

BackgroundSection.propTypes = {
  width: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  startEpoch: PropTypes.number.isRequired,
  colorClass: PropTypes.string.isRequired,
};

const Background = ({ pruningStart, pruningEnd, globalStart, globalEnd }) => {
  const classes = useStyles();

  if (pruningEnd < pruningStart) {
    pruningStart = globalEnd;
    pruningEnd = globalEnd;
  }

  const stabilizationPercent = pruningStart / (globalEnd - globalStart);
  const pruningPercent = (pruningEnd - pruningStart) / (globalEnd - globalStart);
  const fineTuningPercent = 1.0 - pruningPercent - stabilizationPercent;

  return (
    <div className={classes.background}>
      {stabilizationPercent > 0 && (
        <BackgroundSection
          width={stabilizationPercent}
          label="Stabilization"
          startEpoch={globalStart}
          colorClass={classes.backgroundColorOne}
        />
      )}
      {pruningPercent > 0 && (
        <BackgroundSection
          width={pruningPercent}
          label="Pruning"
          startEpoch={pruningStart}
          colorClass={classes.backgroundColorTwo}
        />
      )}
      {fineTuningPercent > 0 && (
        <BackgroundSection
          width={fineTuningPercent}
          label="Fine-Tuning"
          startEpoch={pruningEnd}
          colorClass={classes.backgroundColorThree}
        />
      )}
      <BackgroundDivider epoch={globalEnd} />
    </div>
  );
};

Background.propTypes = {
  pruningStart: PropTypes.number.isRequired,
  pruningEnd: PropTypes.number.isRequired,
  globalStart: PropTypes.number.isRequired,
  globalEnd: PropTypes.number.isRequired,
};

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
    <Card elevation={1} className={classes.root}>
      <CardContent className={classes.layout}>
        <div className={classes.rowsLayout}>
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
        </div>

        <div className={classes.cardActions}>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            className={classes.epochLabel}
          >
            Global Epoch Range
          </Typography>

          <div className={classes.epochRange}>
            <TextField
              id="globalStartEpoch"
              variant="outlined"
              type="text"
              step={1.0}
              label="Start"
              value={startEpoch}
              onChange={(e) => setStartEpoch(e.target.value)}
              onKeyDown={(e) => e.keyCode === 13 && setEpochs()}
              onBlur={setEpochs}
              className={classes.epochInput}
            />
            <div className={classes.epochDash} />
            <TextField
              id="globalEndEpoch"
              variant="outlined"
              type="text"
              step={1.0}
              label="End"
              value={endEpoch}
              onChange={(e) => setEndEpoch(e.target.value)}
              onKeyDown={(e) => e.keyCode === 13 && setEpochs()}
              onBlur={setEpochs}
              className={classes.epochInput}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

TrainingSummaryCard.propTypes = {
  projectId: PropTypes.string.isRequired,
  optim: PropTypes.object.isRequired,
};

export default TrainingSummaryCard;
