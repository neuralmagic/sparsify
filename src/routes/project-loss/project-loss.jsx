import React, { useEffect } from "react";
import { Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";

import ScrollerLayout from "../../components/scroller-layout";
import makeStyles from "./project-loss-styles";
import GenericPage from "../../components/generic-page";
import LoaderLayout from "../../components/loader-layout";
import {
  getOptimsBestEstimatedThunk,
  selectSelectedOptimsBestEstimated,
  selectSelectedProfileLoss,
  selectSelectedProfilesLossState,
  selectSelectedProfilesPerfState,
  selectSelectedProjectModelAnalysisNodeParams,
  selectSelectedProjectModelAnalysisLossSensitivityNodeResults,
  selectSelectedProjectState,
  STATUS_SUCCEEDED,
  selectSelectedProfileLossNodeResults,
} from "../../store";
import { combineStatuses, readableNumber } from "../../components";
import ChartSummariesCard from "../../components/chart-summaries-card";
import ProfileSummaryCard from "../../components/profile-summary-card";

const useStyles = makeStyles();

function baselineDisplayValues() {
  return {
    name: null,
    pruningSettings: null,
    quantizationSettings: null,
    metricOne: { title: null, value: null },
    metricTwo: { title: null, value: null },
    metricThree: { title: null, value: null },
    metricFour: { title: null, value: null },
    expectedOptimizationText:
      "An estimated --- speedup could be achieved by optimizing.",
    extras: "",
    analysisSensitivityResults: {},
  };
}

function analysisDisplayValues(
  bestEstimatedState,
  modelAnalysisLossSensitivityNodeResults
) {
  const params = bestEstimatedState.val ? bestEstimatedState.val.params : null;
  const paramsBaseline = bestEstimatedState.val
    ? bestEstimatedState.val.params_baseline
    : null;
  const paramsReduction =
    params && params > 0 && paramsBaseline
      ? readableNumber(paramsBaseline / params, 2) + "x"
      : null;
  const avgSensitivity = bestEstimatedState.val
    ? bestEstimatedState.val.est_loss_sensitivity
    : null;
  const estimatedRecovery = bestEstimatedState.val
    ? bestEstimatedState.val.est_recovery
    : null;

  return {
    name: "Approximated Analysis",
    pruningSettings: "equation approximated",
    quantizationSettings: null,
    metricOne: {
      title: "Params",
      value: readableNumber(paramsBaseline, 1),
    },
    metricTwo: {
      title: "Average Sensitivity",
      value: readableNumber(avgSensitivity, 2),
    },
    metricThree: {
      title: "Estimated Params Reduction",
      value: paramsReduction,
    },
    metricFour: {
      title: "Estimated Recovery",
      value: readableNumber(estimatedRecovery, 2),
    },
    expectedOptimizationText: `An estimated ${
      paramsReduction ? paramsReduction : "---"
    } reduction in size could be achieved by optimizing.`,
    extras: "",
    analysisSensitivityResults: modelAnalysisLossSensitivityNodeResults,
  };
}

function profileLossDisplayValues(
  profileLoss,
  bestEstimatedState,
  profileLossNodeResults
) {
  const values = analysisDisplayValues(bestEstimatedState, null);
  const pruningSettings = [];

  if (profileLoss.pruning_estimations && profileLoss.pruning_estimation_type) {
    pruningSettings.push(profileLoss.pruning_estimation_type.replace("_", " "));
  }

  if (profileLoss.pruning_estimations && profileLoss.pruning_structure) {
    pruningSettings.push(profileLoss.pruning_structure.replace("_", " "));
  }

  values.name = profileLoss.name ? profileLoss.name : "Unspecified";
  values.pruningSettings = pruningSettings.join(", ");
  values.analysisSensitivityResults = profileLossNodeResults;

  return values;
}

function ProjectLoss({ match }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const projectState = useSelector(selectSelectedProjectState);
  const profilesLossState = useSelector(selectSelectedProfilesLossState);
  const profileLoss = useSelector(selectSelectedProfileLoss);
  const profilesPerfState = useSelector(selectSelectedProfilesPerfState);
  const bestEstimatedState = useSelector(selectSelectedOptimsBestEstimated);
  const modelAnalysisLossSensitivityNodeResults = useSelector(
    selectSelectedProjectModelAnalysisLossSensitivityNodeResults
  );
  const modelAnalysisNodeParams = useSelector(
    selectSelectedProjectModelAnalysisNodeParams
  );
  const profileLossNodeResults = useSelector(selectSelectedProfileLossNodeResults);

  const profileLossId = profileLoss ? profileLoss.profile_id : null;
  const firstPerfProfile =
    profilesPerfState.val && profilesPerfState.val.length > 0
      ? profilesPerfState.val[0]
      : null;
  const firstPerfProfileId = firstPerfProfile ? firstPerfProfile.profile_id : null;

  useEffect(() => {
    // make sure all desired requests are finished first,
    // then make the best estimated request if it hasn't been made yet
    if (
      projectState.status === STATUS_SUCCEEDED &&
      profilesLossState.status === STATUS_SUCCEEDED &&
      profilesPerfState.status === STATUS_SUCCEEDED
    ) {
      const requestMatches =
        projectState.projectId === bestEstimatedState.projectId &&
        profileLossId === bestEstimatedState.profileLossId &&
        firstPerfProfileId === bestEstimatedState.profilePerfId;

      if (!requestMatches) {
        dispatch(
          getOptimsBestEstimatedThunk({
            projectId: projectState.projectId,
            profilePerfId: firstPerfProfileId,
            profileLossId: profileLossId,
          })
        );
      }
    }
  }, [
    projectState,
    profilesLossState,
    profilesPerfState,
    dispatch,
    profileLossId,
    firstPerfProfileId,
  ]);

  const overallStatus = combineStatuses([
    projectState.status,
    profilesPerfState.status,
    profilesLossState.status,
  ]);
  let overallError =
    projectState.error || profilesPerfState.error || profilesLossState.error;
  const { lossId } = match.params;
  if (!overallError && !profileLoss && lossId) {
    overallError = `Profile with id ${lossId} not found.`;
  }

  let displayValues;

  if (!profilesLossState.selectedId) {
    displayValues = analysisDisplayValues(
      bestEstimatedState,
      modelAnalysisLossSensitivityNodeResults
    );
  } else if (profileLoss) {
    displayValues = profileLossDisplayValues(
      profileLoss,
      bestEstimatedState,
      profileLossNodeResults
    );
  } else {
    displayValues = baselineDisplayValues();
  }

  return (
    <ScrollerLayout layoutClass={classes.root}>
      <LoaderLayout
        status={overallStatus}
        error={overallError}
        errorComponent={
          <GenericPage
            title="Error Retrieving Loss Profile"
            description={overallError}
            logoComponent={<SentimentVeryDissatisfiedIcon />}
          />
        }
        rootClass={overallError ? "" : classes.body}
        loaderClass={classes.loader}
      >
        <div className={classes.layout}>
          <div className={classes.title}>
            <Typography color="textSecondary" variant="h5">
              Loss Profile{" "}
            </Typography>
            <Typography
              color="textSecondary"
              variant="h6"
              className={classes.titleExtras}
            >
              {displayValues.extras}
            </Typography>
          </div>
          <ProfileSummaryCard
            status={bestEstimatedState.status}
            error={bestEstimatedState.error}
            projectId={projectState.projectId}
            name={displayValues.name}
            profileDescriptorsOne={[
              {
                title: "Pruning Settings",
                value: displayValues.pruningSettings,
              },
            ]}
            profileDescriptorsTwo={[
              {
                title: "Quantization Settings",
                value: displayValues.quantizationSettings
                  ? displayValues.quantizationSettings
                  : null,
              },
            ]}
            metricOne={displayValues.metricOne}
            metricTwo={displayValues.metricTwo}
            metricThree={displayValues.metricThree}
            metricFour={displayValues.metricFour}
            expectedOptimizeText={displayValues.expectedOptimizationText}
          />
          <div className={classes.spacer} />

          <Typography color="textSecondary" variant="h5" className={classes.title}>
            Layer Sensitivities
          </Typography>
          <ChartSummariesCard
            plotType="line"
            summaries={displayValues.analysisSensitivityResults}
            xAxisTitle="Layer Depth"
            tooltipValues={[
              { key: "label", display: "Layer Index" },
              { key: "id", display: "Layer ID" },
              { key: "opType", display: "Layer Type" },
              { key: "weightName", display: "Weight Name" },
            ]}
          />
          <div className={classes.spacer} />

          <Typography color="textSecondary" variant="h5" className={classes.title}>
            Layer Params Counts
          </Typography>
          <ChartSummariesCard
            plotType="line"
            summaries={modelAnalysisNodeParams ? modelAnalysisNodeParams : {}}
            xAxisTitle="Layer Depth"
            tooltipValues={[
              { key: "label", display: "Layer Index" },
              { key: "id", display: "Layer ID" },
              { key: "opType", display: "Layer Type" },
              { key: "weightName", display: "Weight Name" },
            ]}
          />
          <div className={classes.spacer} />
        </div>
      </LoaderLayout>
    </ScrollerLayout>
  );
}

export default ProjectLoss;
