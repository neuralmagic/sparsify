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
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import makeStyles from "./display-card-metrics-styles";
import SwipeableViews from "react-swipeable-views";
import DisplayMetric from "../display-metric";
import { IconButton, Typography } from "@material-ui/core";

const useStyles = makeStyles();

const DisplayCardMetrics = ({ metricsGroups }) => {
  const classes = useStyles();
  const [index, setIndex] = useState(0);

  return (
    <div className={classes.layout}>
      <div className={classes.swipeContainer}>
        <SwipeableViews
          index={index}
          disabled={true}
          className={classes.swipable}
          slideClassName={classes.swipableSlide}
          containerStyle={{ width: "100%", height: "100%" }}
        >
          {metricsGroups.map((group) => (
            <div key={group.title} className={classes.groupLayout}>
              {group.metrics.map((metric) => (
                <DisplayMetric
                  key={metric.title}
                  title={metric.title}
                  size="large"
                  rootClass={classes.metric}
                >
                  {metric.value ? metric.value : "--"}
                </DisplayMetric>
              ))}
            </div>
          ))}
        </SwipeableViews>
      </div>

      {metricsGroups.length > 1 && (
        <div className={classes.swipeActions}>
          <IconButton
            size="small"
            disabled={index <= 0}
            onClick={() => setIndex(index - 1)}
            className={classes.swipeButton}
          >
            <ChevronLeftIcon className={classes.swipeButtonIcon} />
          </IconButton>

          <div className={classes.swipeActionBody}>
            <Typography
              color="textSecondary"
              variant="subtitle2"
              className={classes.swipeActionTitle}
            >
              {metricsGroups[index].title}
            </Typography>

            <div className={classes.pagination}>
              {metricsGroups.map((metric, metricIndex) => (
                <div
                  className={`${classes.pageMarker} ${
                    metricIndex === index ? classes.pageMarkerSelected : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <IconButton
            size="small"
            disabled={index >= metricsGroups.length - 1}
            onClick={() => setIndex(index + 1)}
            className={classes.swipeButton}
          >
            <ChevronRightIcon className={classes.swipeButtonIcon} />
          </IconButton>
        </div>
      )}

      <div className={classes.divider} />
    </div>
  );
};

DisplayCardMetrics.propTypes = {
  metricsGroups: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DisplayCardMetrics;
