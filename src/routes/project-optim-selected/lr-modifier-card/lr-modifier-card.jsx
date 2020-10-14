import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { TextField, Typography, Card, CardContent } from "@material-ui/core";

import makeStyles from "./lr-modifier-card-styles";
import { summarizeLearningRateValues, updateOptimsThunk } from "../../../store";
import GenericPage from "../../../components/generic-page";
import DisplayMetric from "../../../components/display-metric";
import {scientificNumber} from "../../../components";
import LearningRateChart from "../../../components/learning-rate-chart";

const useStyles = makeStyles();

const LRModifierCard = ({
  projectId,
  optimId,
  modifier,
  globalStartEpoch,
  globalEndEpoch,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const startEpoch =
    modifier.start_epoch > -1 ? modifier.start_epoch : globalStartEpoch;
  const endEpoch = modifier.end_epoch > -1 ? modifier.end_epoch : globalEndEpoch;

  const lrSummaries = summarizeLearningRateValues(
    modifier,
    globalStartEpoch,
    globalEndEpoch
  );
  console.log(lrSummaries);
  const initLR = lrSummaries ? lrSummaries.values.objects[0].value : null;
  const finalLR = lrSummaries
    ? lrSummaries.values.objects[lrSummaries.values.objects.length - 1].value
    : null;

  return (
    <Card elevation={1} className={classes.root}>
      <CardContent className={classes.layout}>
        <div className={classes.metrics}>
          <DisplayMetric title="Initial LR" size="large" rootClass={classes.metric}>
            {scientificNumber(initLR)}
          </DisplayMetric>
          <DisplayMetric title="Final LR" size="large" rootClass={classes.metric}>
            {scientificNumber(finalLR)}
          </DisplayMetric>
        </div>

        <div className={classes.chart}>
          <LearningRateChart lrSummaries={lrSummaries} />
        </div>

        <div className={classes.cardActions}>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            className={classes.epochLabel}
          >
            Active Epoch Range
          </Typography>

          <div className={classes.epochRange}>
            <TextField
              id="lrStartEpoch"
              variant="outlined"
              type="text"
              step={1.0}
              label="Start"
              value={startEpoch}
              disabled={true}
              className={classes.epochInput}
            />
            <div className={classes.epochDash} />
            <TextField
              id="lrEndEpoch"
              variant="outlined"
              type="text"
              step={1.0}
              label="End"
              value={endEpoch}
              disabled={true}
              className={classes.epochInput}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

LRModifierCard.propTypes = {
  projectId: PropTypes.string.isRequired,
  optimId: PropTypes.string.isRequired,
  modifier: PropTypes.object.isRequired,
  globalStartEpoch: PropTypes.number.isRequired,
  globalEndEpoch: PropTypes.number.isRequired,
};

export default LRModifierCard;
