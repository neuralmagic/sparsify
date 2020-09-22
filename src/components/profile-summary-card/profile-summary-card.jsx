import React from "react";
import { Button, CardContent, Divider, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import PropTypes from "prop-types";

import makeStyles from "./profile-summary-card-styles";
import DisplayMetric from "../display-metric";
import NullableText from "../nullable-text";
import { useHistory } from "react-router-dom";
import LoaderOverlay from "../loader-overlay";
import { createProjectOptimPath } from "../../routes/paths";

const useStyles = makeStyles();

function ProfileSummaryCard({
  status,
  error,
  projectId,
  name,
  profileDescriptorsOne,
  profileDescriptorsTwo,
  metricOne,
  metricTwo,
  metricThree,
  metricFour,
  expectedOptimizeText,
}) {
  const classes = useStyles();
  const history = useHistory();

  function handleStartOptimizing() {
    history.push(createProjectOptimPath(projectId));
  }

  return (
    <Card elevation={1} className={classes.root}>
      <CardContent className={classes.layout}>
        <div className={classes.container}>
          <div className={classes.containerRow}>
            <DisplayMetric
              title="Name"
              size="medium"
              rootClass={classes.containerColumn}
            >
              {name}
            </DisplayMetric>
          </div>
          {profileDescriptorsOne.length && (
            <div className={classes.containerRow}>
              {profileDescriptorsOne.map((desc) => (
                <DisplayMetric
                  key={desc.title}
                  title={desc.title}
                  size="small"
                  rootClass={classes.containerColumn}
                >
                  <NullableText placeholder="--" value={desc.value}>
                    {desc.value ? desc.value : ""}
                  </NullableText>
                </DisplayMetric>
              ))}
            </div>
          )}
          {profileDescriptorsTwo.length && (
            <div className={classes.containerRow}>
              {profileDescriptorsTwo.map((desc) => (
                <DisplayMetric
                  key={desc.title}
                  title={desc.title}
                  size="small"
                  rootClass={classes.containerColumn}
                >
                  <NullableText placeholder="--" value={desc.value}>
                    {desc.value ? desc.value : ""}
                  </NullableText>
                </DisplayMetric>
              ))}
            </div>
          )}
          <LoaderOverlay
            errorTitle="Error getting estimated metrics"
            status={status}
            error={error}
          />
        </div>

        <Divider orientation="vertical" flexItem className={classes.divider} />

        <div className={classes.container}>
          <div className={classes.containerRow}>
            <DisplayMetric
              title={metricOne.title}
              size="large"
              rootClass={classes.containerColumn}
            >
              <NullableText placeholder="--" value={metricOne.value}>
                {metricOne.value}
              </NullableText>
            </DisplayMetric>
            <DisplayMetric
              title={metricTwo.title}
              size="large"
              rootClass={classes.containerColumn}
            >
              <NullableText placeholder="--" value={metricTwo.value}>
                {metricTwo.value}
              </NullableText>
            </DisplayMetric>
          </div>

          <div className={classes.containerRow}>
            <DisplayMetric
              title={metricThree.title}
              size="large"
              rootClass={classes.containerColumn}
            >
              <NullableText placeholder="--" value={metricThree.value}>
                {metricThree.value}
              </NullableText>
            </DisplayMetric>
            <DisplayMetric
              title={metricFour.title}
              size="large"
              rootClass={classes.containerColumn}
            >
              <NullableText placeholder="--" value={metricFour.value}>
                {metricFour.value}
              </NullableText>
            </DisplayMetric>
          </div>
        </div>

        <Divider orientation="vertical" flexItem className={classes.divider} />

        <div className={classes.container}>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            className={classes.containerRow}
          >
            Optimize, retrain, and utilize Neural Magic's products to achieve smaller
            models and faster inference times.
          </Typography>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            className={classes.containerRow}
          >
            {expectedOptimizeText}
          </Typography>
          <div className={classes.optimizeButtonSpacer} />
          <Button
            color="secondary"
            variant="contained"
            disableElevation
            className={classes.optimizeButton}
            onClick={handleStartOptimizing}
          >
            Start Optimizing
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

ProfileSummaryCard.propTypes = {
  status: PropTypes.string,
  error: PropTypes.string,
  projectId: PropTypes.string,
  name: PropTypes.string,
  profileDescriptorsOne: PropTypes.arrayOf(PropTypes.object).isRequired,
  profileDescriptorsTwo: PropTypes.arrayOf(PropTypes.object).isRequired,
  metricOne: PropTypes.object,
  metricTwo: PropTypes.object,
  metricThree: PropTypes.object,
  metricFour: PropTypes.object,
  expectedOptimizeText: PropTypes.string,
};

export default ProfileSummaryCard;
